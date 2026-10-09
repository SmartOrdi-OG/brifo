/** The paywall's server half.
 *
 * Worth testing above everything else here: it is the only thing standing
 * between /api/analyze and anyone with the URL, every pass through it spends
 * money at Anthropic, and all three of its answers (401 / 402 / 429) are ones
 * a user can hit on a normal day. The arithmetic is also the kind that goes
 * wrong silently — an off-by-one in the trial window locks out a paying
 * customer, or hands a week to someone whose week is over, and neither shows
 * up as an error anywhere.
 *
 * Supabase and KV are stubbed, so these run with no network and no secrets. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const DAY_MS = 24 * 60 * 60 * 1000;

/** What getUserFromRequest will resolve to for the next call. */
let currentUser: { id: string; email: string | null; createdAt: string | null } | null = null;
/** Stand-in for KV: plain strings, as kv.ts stores them (JSON-encoded). */
let store: Map<string, string>;
let counters: Map<string, number>;
/** Only the counter store goes down in these tests — a kvGet failure is a
 * different, uncaught path and not what the fallback below is about. */
let incrThrows = false;

vi.mock('../src/server/auth.js', () => ({
  getUserFromRequest: async () => currentUser,
}));

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => {
    const raw = store.get(key);
    return raw ? JSON.parse(raw) : null;
  },
  kvSet: async (key: string, value: unknown) => {
    store.set(key, JSON.stringify(value));
  },
  kvIncr: async (key: string) => {
    if (incrThrows) throw new Error('KV down');
    const next = (counters.get(key) ?? 0) + 1;
    counters.set(key, next);
    return next;
  },
}));

const { checkEntitlement } = await import('../src/server/entitlement.js');
const { subscriptionKey } = await import('../src/server/stripeKeys.js');

/** checkEntitlement only ever reads the authorization header, and the stub
 * above decides who that resolves to, so the request can be this thin. */
const req = { headers: { authorization: 'Bearer whatever' } };

function signedIn(opts: { email?: string | null; ageDays?: number } = {}) {
  currentUser = {
    id: 'u1',
    email: opts.email ?? 'parent@example.com',
    createdAt: new Date(Date.now() - (opts.ageDays ?? 0) * DAY_MS).toISOString(),
  };
}

beforeEach(() => {
  currentUser = null;
  store = new Map();
  counters = new Map();
  incrThrows = false;
  delete process.env.FREE_ACCOUNT_EMAILS;
  delete process.env.ANALYZE_DAILY_LIMIT;
  delete process.env.REPLY_DAILY_LIMIT;
  delete process.env.STRIPE_SECRET_KEY;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('who is calling', () => {
  it('refuses a caller with no account', async () => {
    const result = await checkEntitlement(req, 'analyze');
    expect(result).toEqual({ ok: false, failure: { status: 401, error: 'not signed in' } });
  });
});

describe('the trial window', () => {
  it('lets a brand-new account through', async () => {
    signedIn({ ageDays: 0 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('still allows the last day of the week', async () => {
    signedIn({ ageDays: 6.9 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('asks for a subscription once the week is over', async () => {
    signedIn({ ageDays: 7.1 });
    const result = await checkEntitlement(req, 'analyze');
    expect(result).toEqual({ ok: false, failure: { status: 402, error: 'subscription required' } });
  });

  it('extends the window by referral bonus days', async () => {
    signedIn({ ageDays: 9 });
    store.set('referral:bonus:u1', JSON.stringify(7));
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('treats a missing created_at as still in trial rather than locking the account out', async () => {
    currentUser = { id: 'u1', email: 'parent@example.com', createdAt: null };
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('treats an unparseable created_at the same way', async () => {
    currentUser = { id: 'u1', email: 'parent@example.com', createdAt: 'not a date' };
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });
});

describe('a subscription', () => {
  it('overrides an expired trial when active', async () => {
    signedIn({ ageDays: 400 });
    store.set(subscriptionKey('u1'), JSON.stringify({ status: 'active', currentPeriodEnd: null }));
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('counts a Stripe trial as active', async () => {
    signedIn({ ageDays: 400 });
    store.set(subscriptionKey('u1'), JSON.stringify({ status: 'trialing', currentPeriodEnd: null }));
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('does not accept a cancelled or unpaid one', async () => {
    for (const status of ['canceled', 'past_due', 'unpaid', 'incomplete_expired']) {
      signedIn({ ageDays: 400 });
      store.set(subscriptionKey('u1'), JSON.stringify({ status, currentPeriodEnd: null }));
      const result = await checkEntitlement(req, 'analyze');
      expect(result, `status ${status} must not entitle`).toEqual({
        ok: false,
        failure: { status: 402, error: 'subscription required' },
      });
    }
  });

  it('is read under a key namespaced by Stripe mode, so test and live never mix', async () => {
    signedIn({ ageDays: 400 });
    // Written while the deployment was on a test key...
    process.env.STRIPE_SECRET_KEY = 'rk_test_abc';
    store.set(subscriptionKey('u1'), JSON.stringify({ status: 'active', currentPeriodEnd: null }));
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);

    // ...must not be honoured once the deployment is live.
    process.env.STRIPE_SECRET_KEY = 'rk_live_abc';
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(false);
  });
});

describe('complimentary accounts', () => {
  it('skip the trial and the subscription entirely', async () => {
    process.env.FREE_ACCOUNT_EMAILS = 'owner@example.com';
    signedIn({ email: 'owner@example.com', ageDays: 400 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('match regardless of case and surrounding spaces in the env var', async () => {
    process.env.FREE_ACCOUNT_EMAILS = ' Owner@Example.com , other@example.com ';
    signedIn({ email: 'OWNER@example.COM', ageDays: 400 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('are still subject to the daily ceiling', async () => {
    process.env.FREE_ACCOUNT_EMAILS = 'owner@example.com';
    process.env.ANALYZE_DAILY_LIMIT = '2';
    signedIn({ email: 'owner@example.com', ageDays: 400 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
    const third = await checkEntitlement(req, 'analyze');
    expect(third).toEqual({ ok: false, failure: { status: 429, error: 'daily limit reached' } });
  });

  it('do not let an unrelated address through', async () => {
    process.env.FREE_ACCOUNT_EMAILS = 'owner@example.com';
    signedIn({ email: 'someone@example.com', ageDays: 400 });
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(false);
  });
});

describe('the daily ceiling', () => {
  it('allows exactly the limit and refuses the next one', async () => {
    process.env.ANALYZE_DAILY_LIMIT = '3';
    signedIn();
    for (let i = 1; i <= 3; i++) {
      expect((await checkEntitlement(req, 'analyze')).ok, `call ${i}`).toBe(true);
    }
    expect(await checkEntitlement(req, 'analyze')).toEqual({
      ok: false,
      failure: { status: 429, error: 'daily limit reached' },
    });
  });

  it('counts analyze and reply separately', async () => {
    process.env.ANALYZE_DAILY_LIMIT = '1';
    process.env.REPLY_DAILY_LIMIT = '1';
    signedIn();
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(false);
    // Spending the scan budget must not spend the reply budget.
    expect((await checkEntitlement(req, 'reply')).ok).toBe(true);
  });

  it('falls back to 30 when the env var is missing or nonsense', async () => {
    for (const value of [undefined, '', 'abc', '0', '-5']) {
      counters = new Map();
      if (value === undefined) delete process.env.ANALYZE_DAILY_LIMIT;
      else process.env.ANALYZE_DAILY_LIMIT = value;
      signedIn();
      for (let i = 0; i < 30; i++) await checkEntitlement(req, 'analyze');
      expect((await checkEntitlement(req, 'analyze')).ok, `limit value ${String(value)}`).toBe(false);
    }
  });

  it('resets per day, by keying the counter on the Vienna date', async () => {
    process.env.ANALYZE_DAILY_LIMIT = '1';
    signedIn();
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(false);

    // Tomorrow is a different key, so tomorrow starts at zero.
    const keys = [...counters.keys()];
    expect(keys).toHaveLength(1);
    expect(keys[0]).toMatch(/^usage:analyze:u1:\d{4}-\d{2}-\d{2}$/);
    counters.clear();
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });

  it('lets an entitled user through when the counter store is unreachable', async () => {
    // Deliberate: refusing here would take the app down for everyone over a
    // counter, and the account is still authenticated and in trial.
    signedIn({ ageDays: 1 });
    incrThrows = true;
    expect((await checkEntitlement(req, 'analyze')).ok).toBe(true);
  });
});
