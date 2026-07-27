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
