import { describe, expect, it } from 'vitest';
import { entitlementFromSubscriber } from '../src/server/revenuecat';

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
