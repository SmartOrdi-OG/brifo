/** Account deletion, server side.
 *
 * What matters: the Supabase login is deleted too (Google Play requires real
 * account deletion), it is deleted *last* (once it is gone the user cannot
 * authenticate a retry), and nothing at all is deleted when the deployment
 * cannot delete the login — "your account is deleted" must never be half
 * true again. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

let store: Map<string, string>;
const order: string[] = [];

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => {
    const raw = store.get(key);
    return raw ? JSON.parse(raw) : null;
  },
  kvSet: async (key: string, value: unknown) => void store.set(key, JSON.stringify(value)),
  kvDel: async (key: string) => {
    order.push(`kv:${key}`);
    store.delete(key);
  },
}));

let adminStatus = 200;
const adminCalls: { url: string; method?: string; auth?: string }[] = [];
vi.stubGlobal('fetch', async (url: string, init: { method?: string; headers: Record<string, string> }) => {
  order.push('auth-delete');
  adminCalls.push({ url, method: init.method, auth: init.headers.Authorization });
  return { ok: adminStatus >= 200 && adminStatus < 300, status: adminStatus } as Response;
});

const { eraseAccountData } = await import('../src/server/eraseAccount.js');
const { subscriptionKey } = await import('../src/server/stripeKeys.js');
const { sensitiveConsentKey } = await import('../src/server/consent.js');

beforeEach(() => {
  store = new Map([
    ['cloudbackup:u1', '{"children":[]}'],
    ['privacyconsent:u1', '{}'],
    [sensitiveConsentKey('u1'), '{"granted":true}'],
  ]);
  order.length = 0;
  adminCalls.length = 0;
  adminStatus = 200;
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
});

afterEach(() => vi.unstubAllEnvs());

describe('deleting an account', () => {
  it('removes the data, the Art. 9 consent record and the login', async () => {
    const result = await eraseAccountData('u1');
    expect(result.ok).toBe(true);
    expect(store.size).toBe(0);
    expect(adminCalls).toEqual([
      { url: 'https://example.supabase.co/auth/v1/admin/users/u1', method: 'DELETE', auth: 'Bearer service-key' },
    ]);
  });

  it('deletes the login last', async () => {
    await eraseAccountData('u1');
    expect(order.at(-1)).toBe('auth-delete');
    expect(order.filter((o) => o === 'auth-delete')).toHaveLength(1);
  });

  it('treats an already-deleted login as done, so a retry succeeds', async () => {
    adminStatus = 404;
    expect((await eraseAccountData('u1')).ok).toBe(true);
  });

  it('fails loudly when Supabase refuses', async () => {
    adminStatus = 500;
    await expect(eraseAccountData('u1')).rejects.toThrow();
  });

  it('deletes nothing when the service-role key is missing', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    expect(await eraseAccountData('u1')).toEqual({ ok: false, reason: 'not-configured' });
    expect(store.size).toBe(3);
    expect(adminCalls).toHaveLength(0);
  });

  it('is refused under a live subscription, before anything is deleted', async () => {
    store.set(subscriptionKey('u1'), JSON.stringify({ status: 'active' }));
    expect(await eraseAccountData('u1')).toEqual({ ok: false, reason: 'active-subscription' });
    expect(store.has('cloudbackup:u1')).toBe(true);
    expect(adminCalls).toHaveLength(0);
  });
});
