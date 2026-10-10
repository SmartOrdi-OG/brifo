/** What happens when the Stripe webhook does not arrive.
 *
 * The subscription record in KV used to be written by the webhook and by
 * nothing else, which made one HTTP delivery a single point of failure with
 * the worst failure mode there is: the customer pays, Stripe is happy, and
 * the app keeps showing them the paywall. A wrong STRIPE_WEBHOOK_SECRET is
 * answered with a 400, and Stripe does not retry a 400 — so that state is
 * permanent and only repairable by editing the database by hand.
 *
 * resolveSubscriptionStatus asks Stripe itself when our copy says no. These
 * tests pin the two things that makes it safe: it must never turn a paying
 * customer away, and it must not call Stripe for people who are not paying. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

let store: Map<string, unknown>;
/** Subscriptions Stripe will claim this customer has. */
let stripeSubscriptions: { status: string; items: { data: { current_period_end: number }[] } }[];
let listCalls: { customer: string; status: string }[];
let stripeThrows = false;

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => store.get(key) ?? null,
  kvSet: async (key: string, value: unknown) => void store.set(key, value),
  kvDel: async (key: string) => void store.delete(key),
}));

vi.mock('stripe', () => ({
  default: class {
    subscriptions = {
      list: async (params: { customer: string; status: string }) => {
        listCalls.push(params);
        if (stripeThrows) throw new Error('Stripe unreachable');
        return { data: stripeSubscriptions };
      },
    };
  },
}));

const { resolveSubscriptionStatus } = await import('../src/server/stripe.js');
const { subscriptionKey, customerKey } = await import('../src/server/stripeKeys.js');

const USER = 'user-1';
const periodEnd = Math.floor(Date.parse('2026-12-01T00:00:00Z') / 1000);
const subscription = (status: string) => ({ status, items: { data: [{ current_period_end: periodEnd }] } });

beforeEach(() => {
  store = new Map();
  stripeSubscriptions = [];
  listCalls = [];
  stripeThrows = false;
  process.env.STRIPE_SECRET_KEY = 'rk_live_test';
});

describe('when our copy already says active', () => {
  it('answers from KV without troubling Stripe', async () => {
    store.set(subscriptionKey(USER), { status: 'active', currentPeriodEnd: '2026-12-01T00:00:00.000Z' });
    store.set(customerKey(USER), 'cus_1');

    const result = await resolveSubscriptionStatus(USER);
    expect(result.active).toBe(true);
    expect(result.recoveredFromStripe).toBe(false);
    expect(listCalls).toHaveLength(0);
  });
});

describe('when the webhook never delivered', () => {
  beforeEach(() => {
    // Checkout happened — there is a customer — but nothing wrote a
    // subscription record, which is exactly what a lost webhook looks like.
    store.set(customerKey(USER), 'cus_1');
    stripeSubscriptions = [subscription('active')];
  });

  it('asks Stripe and lets the paying customer in', async () => {
    const result = await resolveSubscriptionStatus(USER);
    expect(result.active).toBe(true);
    expect(result.currentPeriodEnd).toBe('2026-12-01T00:00:00.000Z');
    expect(result.recoveredFromStripe).toBe(true);
  });

  it('writes the record the webhook should have written', async () => {
    await resolveSubscriptionStatus(USER);
    // So everything downstream sees it — including the entitlement check on
    // every scan, which reads this key and never loads the Stripe SDK.
    expect(store.get(subscriptionKey(USER))).toEqual({
      status: 'active',
      currentPeriodEnd: '2026-12-01T00:00:00.000Z',
    });
  });

  it('does not ask Stripe twice', async () => {
    await resolveSubscriptionStatus(USER);
    await resolveSubscriptionStatus(USER);
    expect(listCalls).toHaveLength(1);
  });

  it('reports the recovery only on the call that did it', async () => {
    expect((await resolveSubscriptionStatus(USER)).recoveredFromStripe).toBe(true);
    expect((await resolveSubscriptionStatus(USER)).recoveredFromStripe).toBe(false);
  });

  it('counts a Stripe trial as paying too', async () => {
    stripeSubscriptions = [subscription('trialing')];
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });

  it('picks the live subscription out of a customer with old ones', async () => {
    stripeSubscriptions = [subscription('canceled'), subscription('incomplete_expired'), subscription('active')];
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });

  it('recovers from a stale inactive record, not just a missing one', async () => {
    // The 'incomplete' arrived, the 'active' that followed it did not.
    store.set(subscriptionKey(USER), { status: 'incomplete', currentPeriodEnd: null });
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });
});

describe('when nobody is paying', () => {
  it('never calls Stripe for an account that has not been to checkout', async () => {
    // No customer id means no checkout ever happened. This is almost everyone
    // on a given day, and it must cost nothing.
    const result = await resolveSubscriptionStatus(USER);
    expect(result.active).toBe(false);
    expect(listCalls).toHaveLength(0);
  });

  it('asks once and then remembers the answer for a while', async () => {
    store.set(customerKey(USER), 'cus_1');
    stripeSubscriptions = [subscription('canceled')];

    expect((await resolveSubscriptionStatus(USER)).active).toBe(false);
    expect((await resolveSubscriptionStatus(USER)).active).toBe(false);
    expect((await resolveSubscriptionStatus(USER)).active).toBe(false);
    expect(listCalls).toHaveLength(1);
  });
});

describe('when Stripe cannot be reached', () => {
  it('falls back to what we have rather than failing the request', async () => {
    // This path exists to be more generous than KV alone, never less — a
    // Stripe outage must not take the status endpoint down with it.
    store.set(customerKey(USER), 'cus_1');
    stripeThrows = true;

    const result = await resolveSubscriptionStatus(USER);
    expect(result.active).toBe(false);
    expect(result.recoveredFromStripe).toBe(false);
  });

  it('still answers an active customer from KV', async () => {
    store.set(subscriptionKey(USER), { status: 'active', currentPeriodEnd: null });
    store.set(customerKey(USER), 'cus_1');
    stripeThrows = true;
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });

  it('does not remember a failed check as "not subscribed"', async () => {
    store.set(customerKey(USER), 'cus_1');
    stripeThrows = true;
    await resolveSubscriptionStatus(USER);

    // The next call must try again — caching an outage as a no would lock a
    // paying customer out for the length of the cache.
    stripeThrows = false;
    stripeSubscriptions = [subscription('active')];
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });
});

describe('test and live stay apart', () => {
  it('does not reuse a test-mode recheck under a live key', async () => {
    process.env.STRIPE_SECRET_KEY = 'rk_test_x';
    store.set(customerKey(USER), 'cus_test');
    stripeSubscriptions = [subscription('canceled')];
    await resolveSubscriptionStatus(USER);
    expect(listCalls).toHaveLength(1);

    // Same user, live key: a different customer, and the test-mode "no" must
    // not answer for it.
    process.env.STRIPE_SECRET_KEY = 'rk_live_x';
    store.set(customerKey(USER), 'cus_live');
    stripeSubscriptions = [subscription('active')];
    expect((await resolveSubscriptionStatus(USER)).active).toBe(true);
  });
});
