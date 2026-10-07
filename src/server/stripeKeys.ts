/** The KV key layout for billing, split out from stripe.ts so a caller can
 * read a subscription without importing the Stripe SDK with it.
 *
 * That matters for the entitlement check, which runs on the hot path of every
 * scan and every reply: it needs one KV read, not a payment library. Sharing
 * the builders rather than copying them is what keeps the reader and the
 * writer pointing at the same key. */

/** Stripe ids are scoped to the mode that created them: a price/customer made
 * with a test key does not exist under a live key. Namespacing every cached id
 * by mode means flipping STRIPE_SECRET_KEY from test to live (or back) starts
 * from a clean slate instead of replaying ids Stripe will reject with "No such
 * price"/"No such customer".
 *
 * Restricted keys (rk_live_…, rk_test_…) follow the same convention, so
 * matching on the embedded "_test_" covers both shapes. */
export function stripeMode(): 'test' | 'live' {
  const key = process.env.STRIPE_SECRET_KEY ?? '';
  return key.includes('_test_') ? 'test' : 'live';
}

export const subscriptionKey = (userId: string) => `stripe:${stripeMode()}:subscription:${userId}`;
export const customerKey = (userId: string) => `stripe:${stripeMode()}:customer:${userId}`;

/** What the webhook stores under subscriptionKey. */
export interface StoredSubscription {
  status: string;
  currentPeriodEnd: string | null;
}

export function isActiveStatus(status: string): boolean {
  return status === 'active' || status === 'trialing';
}
