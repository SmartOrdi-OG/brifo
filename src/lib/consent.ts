import { PRIVACY_POLICY_VERSION, SENSITIVE_CONSENT_VERSION } from '../data/privacyPolicy';
import { supabase } from './supabaseClient';

const CONSENT_KEY = 'brifo_privacy_consent';
const CONSENT_SYNCED_KEY = 'brifo_privacy_consent_synced';

interface ConsentRecord {
  accepted: boolean;
  version: number;
  acceptedAt: string;
}

/** Why this is three answers and not a yes/no.
 *
 * Both "never seen this app before" and "agreed to an older version" land on
 * the same gate, but they are not the same person and must not be told the
 * same thing. The gate used to greet everyone with "we updated our privacy
 * policy" — which, for someone opening Brifo for the first time, is a
 * sentence about an update to something they have never read, as the very
 * first thing the app ever says to them. */
export type ConsentState = 'none' | 'outdated' | 'current';

export function privacyConsentState(): ConsentState {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return 'none';
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.accepted !== true) return 'none';
    return parsed.version === PRIVACY_POLICY_VERSION ? 'current' : 'outdated';
  } catch {
    return 'none';
  }
}

/** Bumping PRIVACY_POLICY_VERSION invalidates every prior acceptance, so
 * existing users are re-prompted the next time the policy materially changes. */
export function hasAcceptedPrivacyPolicy(): boolean {
  return privacyConsentState() === 'current';
}

export function acceptPrivacyPolicy(): void {
  const record: ConsentRecord = { accepted: true, version: PRIVACY_POLICY_VERSION, acceptedAt: new Date().toISOString() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  localStorage.removeItem(CONSENT_SYNCED_KEY);
}

/** Consent is accepted before sign-in (see App.tsx's gate order), so there's
 * no account to attach it to yet at accept-time — this pushes the
 * already-recorded local acceptance up to the server as durable
 * proof-of-consent once a session exists, tied to that account. Call once a
 * session appears; no-ops if already synced or nothing was accepted. */
export async function syncConsentToServer(): Promise<void> {
  if (!supabase || localStorage.getItem(CONSENT_SYNCED_KEY) === '1') return;
  let record: ConsentRecord | null = null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    record = raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return;
  }
  if (!record?.accepted) return;

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return;

  try {
    const res = await fetch('/api/consent-accept', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ version: record.version, acceptedAt: record.acceptedAt }),
    });
    if (res.ok) localStorage.setItem(CONSENT_SYNCED_KEY, '1');
  } catch (err) {
    console.error('[consent] sync failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Art. 9 consent — health and other sensitive data in letters
// ---------------------------------------------------------------------------

/** Separate from the policy acceptance above, on purpose: Art. 9(2)(a) GDPR
 * needs an *explicit* consent to processing health data, given for that
 * purpose, and a single "I agree" to the whole privacy policy is not one. It
 * is asked before the first scan or reply draft (SensitiveConsentGate), can be
 * withdrawn in Settings, and is checked again on the server
 * (src/server/entitlement.ts), which is where it actually binds. */
const SENSITIVE_KEY = 'brifo_sensitive_consent';

/** Fired on window when the local consent is dropped, so a mounted
 * SensitiveConsentGate asks again. */
export const SENSITIVE_CONSENT_RESET_EVENT = 'brifo:sensitive-consent-reset';

interface SensitiveConsentLocal {
  granted: boolean;
  version: number;
  decidedAt: string;
  /** False until the server has the same answer. Only ever false for a
   * withdrawal: a grant is written locally only after the server took it. */
  synced: boolean;
}

function readSensitive(): SensitiveConsentLocal | null {
  try {
    const raw = localStorage.getItem(SENSITIVE_KEY);
    return raw ? (JSON.parse(raw) as SensitiveConsentLocal) : null;
  } catch {
    return null;
  }
}

function writeSensitive(record: SensitiveConsentLocal): void {
  try {
    localStorage.setItem(SENSITIVE_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked: the gate simply asks again next time.
  }
}

export function hasSensitiveConsent(): boolean {
  const record = readSensitive();
  return !!record && record.granted === true && record.version === SENSITIVE_CONSENT_VERSION;
}

async function postSensitive(granted: boolean, decidedAt: string): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return false;
  try {
    const res = await fetch('/api/consent-accept', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'sensitive', version: SENSITIVE_CONSENT_VERSION, granted, decidedAt }),
    });
    return res.ok;
  } catch (err) {
    console.error('[consent] sensitive consent sync failed:', err);
    return false;
  }
}

/** Server first, then the device: the server refuses to analyse without its
 * own record, so a grant that only reached this device would let the gate
 * through into a scan that then fails. Resolves false if the server could not
 * be reached — the caller says so and the consent counts as not given. */
export async function grantSensitiveConsent(): Promise<boolean> {
  const decidedAt = new Date().toISOString();
  if (!(await postSensitive(true, decidedAt))) return false;
  writeSensitive({ granted: true, version: SENSITIVE_CONSENT_VERSION, decidedAt, synced: true });
  return true;
}

/** Device first, then the server: a withdrawal takes effect here at once,
 * whatever the network does, and an unsynced one is retried by
 * syncSensitiveConsentToServer on the next start. */
export async function withdrawSensitiveConsent(): Promise<void> {
  const decidedAt = new Date().toISOString();
  writeSensitive({ granted: false, version: SENSITIVE_CONSENT_VERSION, decidedAt, synced: false });
  if (await postSensitive(false, decidedAt)) {
    writeSensitive({ granted: false, version: SENSITIVE_CONSENT_VERSION, decidedAt, synced: true });
  }
}

/** The server said there is no consent on record (403) — forget the local
 * one, so the gate asks again instead of the scan failing every time. */
export function forgetSensitiveConsent(): void {
  try {
    localStorage.removeItem(SENSITIVE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(SENSITIVE_CONSENT_RESET_EVENT));
}

/** Retries a withdrawal that did not reach the server. */
export async function syncSensitiveConsentToServer(): Promise<void> {
  const record = readSensitive();
  if (!record || record.synced) return;
  if (await postSensitive(record.granted, record.decidedAt)) writeSensitive({ ...record, synced: true });
}
