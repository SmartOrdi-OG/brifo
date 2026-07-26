import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleWebhookEvent } from '../src/server/stripe.js';

// Stripe's signature check needs the exact raw request bytes — anything
// re-serialized from a parsed JSON body fails verification. This opts the
// route out of Vercel's default body parsing so we can read the stream
// ourselves.
export const config = { api: { bodyParser: false } };

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

function readRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') {
    res.status(400).json({ error: 'missing signature' });
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    await handleWebhookEvent(rawBody, signature);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[api/stripe-webhook] failed:', err);
    res.status(400).json({ error: 'webhook error' });
  }
}
