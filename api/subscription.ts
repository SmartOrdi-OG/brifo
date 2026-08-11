import type { IncomingMessage, ServerResponse } from 'node:http';
import { createCheckoutSession, createBillingPortalSession, getSubscriptionStatus, type Plan } from '../src/server/stripe.js';
import { getUserFromRequest } from '../src/server/auth.js';
import { isComplimentaryEmail } from '../src/server/freeAccounts.js';
import { ConfigError } from '../src/server/errors.js';

// Consolidates create-checkout-session/subscription-status into one function
// — see push.ts for why (Vercel's Hobby plan caps a deployment at 12
// serverless functions).
interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  if (action === 'checkout') {
    const { origin, plan } = (req.body ?? {}) as { origin?: unknown; plan?: unknown };
    const base = typeof origin === 'string' ? origin : '';
    const selectedPlan: Plan = plan === 'annual' ? 'annual' : 'monthly';
    try {
      const url = await createCheckoutSession(
        user.id,
        user.email ?? '',
        `${base}/paywall?checkout=success`,
        `${base}/paywall?checkout=cancelled`,
        selectedPlan,
      );
      res.status(200).json({ url });
    } catch (err) {
      if (err instanceof ConfigError) {
        console.error('[api/subscription:checkout] config error:', err.message);
        res.status(500).json({ error: `server misconfigured: ${err.message}` });
        return;
      }
      console.error('[api/subscription:checkout] failed:', err);
      res.status(500).json({ error: 'failed to create checkout session' });
    }
    return;
  }

  if (action === 'portal') {
    const { origin } = (req.body ?? {}) as { origin?: unknown };
    const base = typeof origin === 'string' ? origin : '';
    try {
      const url = await createBillingPortalSession(user.id, user.email ?? '', `${base}/settings`);
      res.status(200).json({ url });
    } catch (err) {
      if (err instanceof ConfigError) {
        console.error('[api/subscription:portal] config error:', err.message);
        res.status(500).json({ error: `server misconfigured: ${err.message}` });
        return;
      }
      console.error('[api/subscription:portal] failed:', err);
      res.status(500).json({ error: 'failed to create billing portal session' });
    }
    return;
  }

  if (action === 'status') {
    if (isComplimentaryEmail(user.email)) {
      res.status(200).json({ active: true, currentPeriodEnd: null });
      return;
    }
    try {
      const status = await getSubscriptionStatus(user.id);
      res.status(200).json(status);
    } catch (err) {
      console.error('[api/subscription:status] failed:', err);
      res.status(500).json({ error: 'failed to load subscription status' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
