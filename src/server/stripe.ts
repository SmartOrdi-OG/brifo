import Stripe from 'stripe';
import { kvGet, kvSet } from './kv.js';
import { ConfigError } from './errors.js';

const subscriptionKey = (userId: string) => `stripe:subscription:${userId}`;
const customerKey = (userId: string) => `stripe:customer:${userId}`;

/** 2.90 EUR/month — see todo.md for the open decision on what exactly this gates. */
const MONTHLY_PRICE_EUR_CENTS = 290;

// Keyed by amount so a future price change here automatically creates (and
// caches) a fresh Stripe Price instead of silently keeping checkouts on a
// stale cached price_id from before the change.
const priceIdCacheKey = () => `stripe:price_id:${MONTHLY_PRICE_EUR_CENTS}`;

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ConfigError('STRIPE_SECRET_KEY is not set');
  stripeClient = new Stripe(key);
  return stripeClient;
}

/** Creates the Product/Price once (on whichever request needs it first) and
 * caches the id in KV, so repeated checkouts reuse the same Price instead of
 * accumulating duplicates. Set STRIPE_PRICE_ID to skip this and pin an id
 * created by hand instead. */
async function getOrCreatePriceId(stripe: Stripe): Promise<string> {
  const pinned = process.env.STRIPE_PRICE_ID;
  if (pinned) return pinned;

  const cacheKey = priceIdCacheKey();
  const cached = await kvGet<string>(cacheKey);
  if (cached) return cached;

  const product = await stripe.products.create({ name: 'Brifo Premium' });
  const price = await stripe.prices.create({
    product: product.id,
    currency: 'eur',
    unit_amount: MONTHLY_PRICE_EUR_CENTS,
    recurring: { interval: 'month' },
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
): Promise<string> {
  const stripe = getStripe();
  const [priceId, customerId] = await Promise.all([getOrCreatePriceId(stripe), getOrCreateCustomerId(stripe, userId, email)]);

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
