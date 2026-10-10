/** Which of the two people the consent gate is talking to.
 *
 * "Never seen this app before" and "agreed to an older version of the policy"
 * both land on the same screen, and they are not the same person. The gate
 * used to greet both with "we updated our privacy policy" — a sentence about
 * an update to something a first-time user has never read, as the first thing
 * Brifo ever says to them. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const store = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
});

// The module reads VITE_SUPABASE_* at import time via supabaseClient; it is
// not used by the function under test, but it must not throw on import.
vi.mock('../src/lib/supabaseClient', () => ({ supabase: null }));

const { privacyConsentState, hasAcceptedPrivacyPolicy, acceptPrivacyPolicy } = await import('../src/lib/consent');
const { PRIVACY_POLICY_VERSION } = await import('../src/data/privacyPolicy');

const KEY = 'brifo_privacy_consent';

beforeEach(() => store.clear());

describe('a first-time visitor', () => {
  it('has no consent on record', () => {
    expect(privacyConsentState()).toBe('none');
    expect(hasAcceptedPrivacyPolicy()).toBe(false);
  });

  it('is not mistaken for a returning one by unreadable storage', () => {
    store.set(KEY, 'not json at all');
    expect(privacyConsentState()).toBe('none');
  });

  it('is not mistaken for one who declined', () => {
    store.set(KEY, JSON.stringify({ accepted: false, version: PRIVACY_POLICY_VERSION, acceptedAt: '' }));
    expect(privacyConsentState()).toBe('none');
  });
});

describe('someone who already agreed', () => {
  it('to this version is let straight through', () => {
    acceptPrivacyPolicy();
    expect(privacyConsentState()).toBe('current');
    expect(hasAcceptedPrivacyPolicy()).toBe(true);
  });

  it('to an older version is asked again, and known to be returning', () => {
    store.set(
      KEY,
      JSON.stringify({ accepted: true, version: PRIVACY_POLICY_VERSION - 1, acceptedAt: '2026-01-01T00:00:00Z' }),
    );
    expect(privacyConsentState()).toBe('outdated');
    expect(hasAcceptedPrivacyPolicy()).toBe(false);
  });
});

describe('accepting', () => {
  it('records the version in force, so a later bump re-prompts', () => {
    acceptPrivacyPolicy();
    const record = JSON.parse(store.get(KEY)!) as { accepted: boolean; version: number; acceptedAt: string };
    expect(record.accepted).toBe(true);
    expect(record.version).toBe(PRIVACY_POLICY_VERSION);
    expect(Number.isNaN(Date.parse(record.acceptedAt))).toBe(false);
  });

  it('clears the synced flag, so the new acceptance is pushed to the server', () => {
    store.set('brifo_privacy_consent_synced', '1');
    acceptPrivacyPolicy();
    expect(store.has('brifo_privacy_consent_synced')).toBe(false);
  });
});
