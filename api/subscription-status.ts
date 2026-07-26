import type { IncomingMessage, ServerResponse } from 'node:http';
import { getSubscriptionStatus } from '../src/server/stripe.js';
import { getUserFromRequest } from '../src/server/auth.js';

interface VercelRequest extends IncomingMessage {}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    const status = await getSubscriptionStatus(user.id);
    res.status(200).json(status);
  } catch (err) {
    console.error('[api/subscription-status] failed:', err);
    res.status(500).json({ error: 'failed to load subscription status' });
  }
}
