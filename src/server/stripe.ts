import Stripe from 'stripe';
import { kvGet, kvSet } from './kv.js';
import { ConfigError } from './errors.js';

const subscriptionKey = (userId: string) => `stripe:subscription:${userId}`;
const customerKey = (userId: string) => `stripe:customer:${userId}`;

export type Plan = 'monthly' | 'annual';

/** See todo.md for the open decision on what exactly a subscription gates. */
const PLAN_CONFIG: Record<Plan, { unitAmount: number; interval: Stripe.PriceCreateParams.Recurring.Interval }> = {
  monthly: { unitAmount: 290, interval: 'month' }, // 2.90 EUR/month
  annual: { unitAmount: 2000, interval: 'year' }, // 20 EUR/year
};

// Keyed by plan + amount so a future price change here automatically creates
// (and caches) a fresh Stripe Price instead of silently keeping checkouts on
// a stale cached price_id from before the change.
const priceIdCacheKey = (plan: Plan) => `stripe:price_id:${plan}:${PLAN_CONFIG[plan].unitAmount}`;

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ConfigError('STRIPE_SECRET_KEY is not set');
  stripeClient = new Stripe(key);
  return stripeClient;
}

/** Creates each plan's Product/Price once (on whichever request needs it
 * first) and caches the id in KV, so repeated checkouts reuse the same Price
 * instead of accumulating duplicates. Set STRIPE_PRICE_ID to skip this and
 * pin the monthly plan to an id created by hand instead. */
async function getOrCreatePriceId(stripe: Stripe, plan: Plan): Promise<string> {
  if (plan === 'monthly') {
    const pinned = process.env.STRIPE_PRICE_ID;
    if (pinned) return pinned;
  }

  const cacheKey = priceIdCacheKey(plan);
  const cached = await kvGet<string>(cacheKey);
  if (cached) return cached;

  const { unitAmount, interval } = PLAN_CONFIG[plan];
  const product = await stripe.products.create({ name: plan === 'annual' ? 'Brifo Premium (jährlich)' : 'Brifo Premium' });
  const price = await stripe.prices.create({
    product: product.id,
    currency: 'eur',
    unit_amount: unitAmount,
    recurring: { interval },
  });
  await kvSet(cacheKey, price.id);
  return price.id;
}

async function getOrCreateCustomerId(stripe: Stripe, userId: string, email: string): Promise<string> {
  const cached = await kvGet<string>(customerKey(userId));
  if (cached) return cached;

  const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: userId } });
  await kvSet(customerKey(userId), customer.id);
  return customer.id;
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  successUrl: string,
  cancelUrl: string,
  plan: Plan = 'monthly',
): Promise<string> {
  const stripe = getStripe();
  const [priceId, customerId] = await Promise.all([
    getOrCreatePriceId(stripe, plan),
    getOrCreateCustomerId(stripe, userId, email),
  ]);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
  });

  if (!session.url) throw new Error('Stripe did not return a checkout URL');
  return session.url;
}

/** Stripe's own hosted page for an existing customer to view their
 * subscription, update payment details, or cancel — no custom cancellation
 * UI/logic needed on our side. Requires the customer to already exist (i.e.
 * they've been through checkout at least once), which is why the caller
 * gates this on an active subscription. */
export async function createBillingPortalSession(userId: string, email: string, returnUrl: string): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateCustomerId(stripe, userId, email);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

export interface SubscriptionStatus {
  active: boolean;
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const stored = await kvGet<{ status: Stripe.Subscription.Status; currentPeriodEnd: string }>(subscriptionKey(userId));
  if (!stored) return { active: false, currentPeriodEnd: null };
  return { active: stored.status === 'active' || stored.status === 'trialing', currentPeriodEnd: stored.currentPeriodEnd };
}

/** Verifies and applies a Stripe webhook event. Must receive the exact raw
 * request body — Stripe's signature check fails on anything re-serialized
 * from parsed JSON, which is why the calling route disables body parsing. */
export async function handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new ConfigError('STRIPE_WEBHOOK_SECRET is not set');

  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) break;
      const userId = customer.metadata?.supabase_user_id;
      if (!userId) break;

      const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
      await kvSet(subscriptionKey(userId), {
        status: subscription.status,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      });
      break;
    }
  }
}
