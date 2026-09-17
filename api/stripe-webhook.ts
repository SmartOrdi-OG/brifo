import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleWebhookEvent, WebhookSignatureError } from '../src/server/stripe.js';
import { ConfigError } from '../src/server/errors.js';

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
    // Three different failures used to look identical from the outside — a
    // bare 400 — which made a freshly configured endpoint impossible to
    // diagnose from Stripe's own delivery log without digging through server
    // logs. They also deserve different answers: Stripe retries a 5xx and
    // gives up on a 4xx, and only one of these is worth retrying.
    if (err instanceof WebhookSignatureError) {
      // The secret is wrong (or this did not come from Stripe). Retrying
      // cannot fix a configuration mistake, so say so and take the 4xx.
      console.error('[api/stripe-webhook] signature verification failed:', err.message);
      res.status(400).json({ error: 'signature verification failed' });
      return;
    }
    if (err instanceof ConfigError) {
      console.error('[api/stripe-webhook] config error:', err.message);
      res.status(500).json({ error: `server misconfigured: ${err.message}` });
      return;
    }
    // The event was genuine; something after it failed (a customer lookup, a
    // KV write). That can succeed on a retry, so ask Stripe for one.
    console.error('[api/stripe-webhook] processing failed:', err);
    res.status(500).json({ error: 'event processing failed' });
  }
}
