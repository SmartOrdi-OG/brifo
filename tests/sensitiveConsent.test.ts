/** The separate Art. 9 consent, on the device.
 *
 * Two orderings carry the whole design and are easy to break by "tidying":
 * a grant is written locally only after the server has it (otherwise the gate
 * opens onto a scan the server refuses), and a withdrawal is written locally
 * first (otherwise a dead connection keeps the consent alive). */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const store = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
});
const events: string[] = [];
vi.stubGlobal('window', { dispatchEvent: (e: Event) => void events.push(e.type) });

vi.mock('../src/lib/supabaseClient', () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: { access_token: 'tok' } } }) } },
}));

let serverUp = true;
const posted: unknown[] = [];
vi.stubGlobal('fetch', async (_url: string, init: { body: string }) => {
  if (!serverUp) throw new TypeError('network down');
  posted.push(JSON.parse(init.body));
  return { ok: true } as Response;
});

const consent = await import('../src/lib/consent');
const { SENSITIVE_CONSENT_VERSION } = await import('../src/data/privacyPolicy');
const KEY = 'brifo_sensitive_consent';

beforeEach(() => {
  store.clear();
  posted.length = 0;
  events.length = 0;
  serverUp = true;
});

describe('granting', () => {
  it('starts out not given', () => {
    expect(consent.hasSensitiveConsent()).toBe(false);
  });

  it('records it on the server, then on the device', async () => {
    expect(await consent.grantSensitiveConsent()).toBe(true);
    expect(posted).toEqual([expect.objectContaining({ kind: 'sensitive', granted: true, version: SENSITIVE_CONSENT_VERSION })]);
    expect(consent.hasSensitiveConsent()).toBe(true);
  });

  it('does not count on the device when the server never got it', async () => {
    serverUp = false;
    expect(await consent.grantSensitiveConsent()).toBe(false);
    expect(consent.hasSensitiveConsent()).toBe(false);
  });

  it('given to an older consent text is asked again', () => {
    store.set(KEY, JSON.stringify({ granted: true, version: SENSITIVE_CONSENT_VERSION - 1, decidedAt: '', synced: true }));
    expect(consent.hasSensitiveConsent()).toBe(false);
  });
});

describe('withdrawing', () => {
  it('takes effect on the device even with no connection, and is retried later', async () => {
    await consent.grantSensitiveConsent();
    serverUp = false;
    await consent.withdrawSensitiveConsent();
    expect(consent.hasSensitiveConsent()).toBe(false);
    expect(JSON.parse(store.get(KEY)!).synced).toBe(false);

    serverUp = true;
    posted.length = 0;
    await consent.syncSensitiveConsentToServer();
    expect(posted).toEqual([expect.objectContaining({ kind: 'sensitive', granted: false })]);
    expect(JSON.parse(store.get(KEY)!).synced).toBe(true);
  });

  it('is not re-sent once the server has it', async () => {
    await consent.withdrawSensitiveConsent();
    posted.length = 0;
    await consent.syncSensitiveConsentToServer();
    expect(posted).toHaveLength(0);
  });
});

describe('a server that has no consent on record', () => {
  it('drops the local copy and tells the gate to ask again', async () => {
    await consent.grantSensitiveConsent();
    consent.forgetSensitiveConsent();
    expect(consent.hasSensitiveConsent()).toBe(false);
    expect(events).toContain(consent.SENSITIVE_CONSENT_RESET_EVENT);
  });
});
