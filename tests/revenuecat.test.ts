import { afterEach, describe, expect, it, vi } from 'vitest';
import { deleteAppStoreSubscriber, entitlementFromSubscriber } from '../src/server/revenuecat';

const NOW = Date.parse('2026-11-22T12:00:00Z');

describe('entitlementFromSubscriber', () => {
  it('is active while the entitlement has not expired', () => {
    const r = entitlementFromSubscriber({ subscriber: { entitlements: { brifo_premium: { expires_date: '2026-12-01T00:00:00Z' } } } }, NOW);
    expect(r).toEqual({ active: true, expiresAt: '2026-12-01T00:00:00Z' });
  });
  it('is inactive once it has expired', () => {
    const r = entitlementFromSubscriber({ subscriber: { entitlements: { brifo_premium: { expires_date: '2026-11-01T00:00:00Z' } } } }, NOW);
    expect(r.active).toBe(false);
  });
  it('treats a missing expiry as a lifetime grant', () => {
    expect(entitlementFromSubscriber({ subscriber: { entitlements: { brifo_premium: { expires_date: null } } } }, NOW).active).toBe(true);
  });
  it('ignores other entitlements and unknown subscribers', () => {
    expect(entitlementFromSubscriber({ subscriber: { entitlements: { other: { expires_date: null } } } }, NOW).active).toBe(false);
    expect(entitlementFromSubscriber({}, NOW).active).toBe(false);
  });
});

describe('deleteAppStoreSubscriber', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  it('sends DELETE for the account and treats 404 as already gone', async () => {
    vi.stubEnv('REVENUECAT_SECRET_KEY', 'sk_test');
    const fetchMock = vi.fn(async () => new Response(null, { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await deleteAppStoreSubscriber('user-1')).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.revenuecat.com/v1/subscribers/user-1');
    expect(init.method).toBe('DELETE');
  });

  it('reports a failed delete without throwing', async () => {
    vi.stubEnv('REVENUECAT_SECRET_KEY', 'sk_test');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 500 })));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await deleteAppStoreSubscriber('user-1')).toBe(false);
  });
});
