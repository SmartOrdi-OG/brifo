/** Deleting an account, which has to be all of it.
 *
 * This used to delete a person's data and leave their login standing, and the
 * screen said so. It now deletes both — which makes the order load-bearing
 * and the failure modes worth pinning:
 *
 * - the data must go before the login, because deleting the login invalidates
 *   the token the request arrived with;
 * - an active subscription must stop the whole thing, before anything is
 *   touched, or the person keeps paying Stripe with nothing left here able to
 *   connect the payment to them or cancel it;
 * - a missing service-role key must report a half-deletion honestly rather
 *   than claim success, because the screen tells the person which happened.
 *
 * None of that surfaces as an exception anywhere, so these are the only thing
 * standing between a wrong edit and a user who is told their account is gone
 * while they are still signed in to it. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { eraseAccountData } from '../src/server/eraseAccount';
import { kvSet, kvGet } from '../src/server/kv';
import { subscriptionKey, customerKey } from '../src/server/stripeKeys';

const USER = 'user-1234';

const saved: Record<string, string | undefined> = {};
const WATCHED = ['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY'];

beforeEach(() => {
  for (const name of WATCHED) {
    saved[name] = process.env[name];
    delete process.env[name];
  }
  // Pins the KV namespace the keys are built in; stripeMode() reads this.
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
});

afterEach(() => {
  for (const name of WATCHED) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
  vi.unstubAllGlobals();
});

/** Fills KV with everything an account leaves behind. */
async function seedAccount(userId = USER) {
  await kvSet(`cloudbackup:${userId}`, { children: ['a child'] });
  await kvSet(`privacyconsent:${userId}`, { acceptedAt: 'now' });
  await kvSet(`referral:bonus:${userId}`, 7);
  await kvSet(`referral:redeemed:${userId}`, true);
  await kvSet(customerKey(userId), 'cus_123');
}

const configureServiceRole = () => {
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
};

describe('what it deletes', () => {
  it('removes every key holding something about the person', async () => {
    await seedAccount();
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    const result = await eraseAccountData(USER);
    expect(result.ok).toBe(true);

    // The backup is the one that holds children's names and letter photos.
    expect(await kvGet(`cloudbackup:${USER}`)).toBeNull();
    expect(await kvGet(`privacyconsent:${USER}`)).toBeNull();
    expect(await kvGet(`referral:bonus:${USER}`)).toBeNull();
    expect(await kvGet(`referral:redeemed:${USER}`)).toBeNull();
    expect(await kvGet(customerKey(USER))).toBeNull();
  });

  it('leaves another account alone', async () => {
    await seedAccount();
    await seedAccount('someone-else');
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    await eraseAccountData(USER);

    expect(await kvGet('cloudbackup:someone-else')).not.toBeNull();
  });
});

describe('deleting the login', () => {
  it('calls the admin endpoint for that user, with the service-role key', async () => {
    configureServiceRole();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    const result = await eraseAccountData(USER);
    expect(result).toMatchObject({ ok: true, accountDeleted: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://example.supabase.co/auth/v1/admin/users/${USER}`);
    expect((init as { method: string }).method).toBe('DELETE');
    const headers = (init as { headers: Record<string, string> }).headers;
    expect(headers.apikey).toBe('service-role-key');
    expect(headers.Authorization).toBe('Bearer service-role-key');
  });

  it('deletes the data first, so a surviving login never strands it', async () => {
    await seedAccount();
    configureServiceRole();
    // Assert the ordering from inside the admin call: by the time the login
    // is deleted the backup must already be gone. Reversed, a failure here
    // would leave the data behind with nobody able to ask for it again.
    let backupAtDeleteTime: unknown = 'not checked';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        backupAtDeleteTime = await kvGet(`cloudbackup:${USER}`);
        return { ok: true, status: 200 };
      }),
    );

    await eraseAccountData(USER);
    expect(backupAtDeleteTime).toBeNull();
  });

  it('treats an already-deleted login as deleted', async () => {
    // A retried request, or one deleted by hand. The caller wants the end
    // state, not who got there first.
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    expect(await eraseAccountData(USER)).toMatchObject({ accountDeleted: true });
  });
});

describe('when the login cannot be deleted', () => {
  it('still deletes the data, and says the login survived', async () => {
    // No SUPABASE_SERVICE_ROLE_KEY. Refusing outright would be worse: the
    // person asked to be deleted, and most of it can be honoured.
    await seedAccount();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await eraseAccountData(USER);

    expect(result).toMatchObject({ ok: true, accountDeleted: false });
    expect(await kvGet(`cloudbackup:${USER}`)).toBeNull();
    // Nothing was even attempted without a key.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports false when Supabase rejects the key', async () => {
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    expect(await eraseAccountData(USER)).toMatchObject({ ok: true, accountDeleted: false });
  });

  it('reports false when the request throws, rather than failing the erasure', async () => {
    await seedAccount();
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const result = await eraseAccountData(USER);
    expect(result).toMatchObject({ ok: true, accountDeleted: false });
    expect(await kvGet(`cloudbackup:${USER}`)).toBeNull();
  });
});

describe('an active subscription stops everything', () => {
  it('refuses, and touches neither the data nor the login', async () => {
    await seedAccount();
    await kvSet(subscriptionKey(USER), { status: 'active', currentPeriodEnd: null });
    configureServiceRole();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    const result = await eraseAccountData(USER);

    expect(result).toEqual({ ok: false, reason: 'active-subscription' });
    // The point of refusing: dropping the customer mapping under a live
    // subscription leaves the person paying with nothing here able to stop it.
    expect(await kvGet(customerKey(USER))).toBe('cus_123');
    expect(await kvGet(`cloudbackup:${USER}`)).not.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses a trial too, which is just as live a subscription', async () => {
    await kvSet(subscriptionKey(USER), { status: 'trialing', currentPeriodEnd: null });
    const result = await eraseAccountData(USER);
    expect(result).toEqual({ ok: false, reason: 'active-subscription' });
  });

  it('proceeds once the subscription has ended', async () => {
    await seedAccount();
    await kvSet(subscriptionKey(USER), { status: 'canceled', currentPeriodEnd: null });
    configureServiceRole();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }));

    expect(await eraseAccountData(USER)).toMatchObject({ ok: true, accountDeleted: true });
    expect(await kvGet(subscriptionKey(USER))).toBeNull();
  });
});
