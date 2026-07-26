import type { IncomingMessage, ServerResponse } from 'node:http';
import { createCheckoutSession } from '../src/server/stripe.js';
import { getUserFromRequest } from '../src/server/auth.js';
import { ConfigError } from '../src/server/errors.js';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

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

  const { origin } = (req.body ?? {}) as { origin?: unknown };
  const base = typeof origin === 'string' ? origin : '';

  try {
    const url = await createCheckoutSession(
      user.id,
      user.email ?? '',
      `${base}/paywall?checkout=success`,
      `${base}/paywall?checkout=cancelled`,
    );
    res.status(200).json({ url });
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[api/create-checkout-session] config error:', err.message);
      res.status(500).json({ error: `server misconfigured: ${err.message}` });
      return;
    }
    console.error('[api/create-checkout-session] failed:', err);
    res.status(500).json({ error: 'failed to create checkout session' });
  }
}
