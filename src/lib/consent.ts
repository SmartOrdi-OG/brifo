import { PRIVACY_POLICY_VERSION } from '../data/privacyPolicy';
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
