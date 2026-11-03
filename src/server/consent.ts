/** Server-side proof-of-consent record, keyed by the signed-in user's
 * Supabase account id — the local acceptance flag in lib/consent.ts lives
 * only on the device and is lost if it's cleared, so this is what lets the
 * business actually show who accepted which privacy policy version and
 * when, if that's ever needed. */
import { kvGet, kvSet } from './kv.js';

const consentKey = (userId: string) => `privacyconsent:${userId}`;

export interface ConsentRecord {
  email: string | null;
  version: number;
  /** When the user actually clicked accept, on their device. */
  acceptedAt: string;
  /** When this record was written to the server (may lag acceptedAt if the
   * device was offline or the user accepted before signing in). */
  recordedAt: string;
}

export async function saveConsentRecord(userId: string, record: ConsentRecord): Promise<void> {
  await kvSet(consentKey(userId), record);
}

export async function loadConsentRecord(userId: string): Promise<ConsentRecord | null> {
  return kvGet<ConsentRecord>(consentKey(userId));
}

/** Version of the separate Art. 9 GDPR consent (health and other sensitive
 * data in letters). Must match SENSITIVE_CONSENT_VERSION in
 * src/data/privacyPolicy.ts — repeated rather than imported because that file
 * is browser-side ESM and this tree compiles as CommonJS;
 * tests/constantsInSync.test.ts holds the two together. Bump it when the
 * consent text changes materially, and every account is asked again. */
export const SENSITIVE_CONSENT_VERSION = 1;

export const sensitiveConsentKey = (userId: string) => `sensitiveconsent:${userId}`;

/** Proof of the Art. 9 consent, and of its withdrawal. A withdrawal is
 * written as `granted: false` rather than deleting the key, so the record
 * still shows when consent ended — Art. 7(1) puts the burden of proof on us. */
export interface SensitiveConsentRecord {
  email: string | null;
  version: number;
  granted: boolean;
  /** When the user tapped grant/withdraw, on their device. */
  decidedAt: string;
  recordedAt: string;
}

export async function saveSensitiveConsent(userId: string, record: SensitiveConsentRecord): Promise<void> {
  await kvSet(sensitiveConsentKey(userId), record);
}

/** Whether the server may send this account's letters to the model. Only a
 * current-version grant counts: a withdrawn, missing or outdated record is a
 * no, which is the safe way round for Art. 9 data. */
export async function hasSensitiveConsent(userId: string): Promise<boolean> {
  const record = await kvGet<SensitiveConsentRecord>(sensitiveConsentKey(userId));
  return !!record && record.granted === true && record.version >= SENSITIVE_CONSENT_VERSION;
}
