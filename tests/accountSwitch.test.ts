/** One account's data must never reach another account signed in on the same
 * device (see src/lib/accountSwitch.ts). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { claimDeviceData, clearAccountData, OWNER_KEY, PER_ACCOUNT_KEYS } from '../src/lib/accountSwitch';

function memoryStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const ahmedsDevice = () =>
  memoryStore({
    [OWNER_KEY]: 'ahmed',
    brifo_data: '{"letters":[{"id":"1","summary":"Befund"}]}',
    brifo_privacy_consent: '{"version":6}',
    brifo_privacy_consent_synced: '1',
    brifo_sensitive_consent: '{"granted":true}',
    brifo_reminders_notified: '["1"]',
    brifo_lang: 'ar',
    brifo_theme: 'dark',
  });

describe('signing in on a device that holds another account’s data', () => {
  it('removes that data before the new account sees it, and keeps device settings', () => {
    const store = ahmedsDevice();
    expect(claimDeviceData('abdelrhman', store)).toBe('switched');
    for (const key of PER_ACCOUNT_KEYS) expect(store.getItem(key), key).toBeNull();
    expect(store.getItem(OWNER_KEY)).toBe('abdelrhman');
    expect(store.getItem('brifo_lang')).toBe('ar');
    expect(store.getItem('brifo_theme')).toBe('dark');
  });

  it('keeps everything when the same account signs in again', () => {
    const store = ahmedsDevice();
    expect(claimDeviceData('ahmed', store)).toBe('same');
    expect(store.getItem('brifo_data')).toContain('Befund');
  });

  it('lets the signed-in account take over data from before this change, without deleting it', () => {
    const store = memoryStore({ brifo_data: '{"letters":[]}' });
    expect(claimDeviceData('abdelrhman', store)).toBe('adopted');
    expect(store.getItem('brifo_data')).toBe('{"letters":[]}');
    expect(store.getItem(OWNER_KEY)).toBe('abdelrhman');
  });

  it('a device signed out by one account starts clean for the next', () => {
    const store = ahmedsDevice();
    clearAccountData(store);
    for (const key of PER_ACCOUNT_KEYS) expect(store.getItem(key), key).toBeNull();
    expect(store.getItem(OWNER_KEY)).toBeNull();
    expect(claimDeviceData('abdelrhman', store)).toBe('adopted');
  });
});

describe('wiring', () => {
  const auth = readFileSync(new URL('../src/context/AuthContext.tsx', import.meta.url), 'utf8');
  const erase = readFileSync(new URL('../src/lib/eraseData.ts', import.meta.url), 'utf8');

  it('checks every session before handing it to the app, and reloads on a switch', () => {
    expect(auth).toContain("claimDeviceData(next.user.id) === 'switched'");
    expect(auth).toContain('window.location.reload()');
    expect(auth).not.toMatch(/onAuthStateChange\(\(_event, next\) => setSession\(next\)\)/);
  });

  it('clears this account’s data on sign-out', () => {
    const signOut = auth.slice(auth.indexOf('async function signOut'));
    expect(signOut.indexOf('clearAccountData()')).toBeGreaterThan(-1);
    expect(signOut.indexOf('clearAccountData()')).toBeLessThan(signOut.indexOf('auth.signOut()'));
  });

  it('"Delete account" also removes the owner marker and every per-account key', () => {
    for (const key of [...PER_ACCOUNT_KEYS, OWNER_KEY]) expect(erase, key).toContain(`'${key}'`);
  });
});
