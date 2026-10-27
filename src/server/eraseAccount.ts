/** Erasing everything the server holds about one account — the account
 * included.
 *
 * The app stores children's names and letter summaries against a Supabase
 * account id. GDPR Art. 17 gives the person a right to have that removed, and
 * Google Play requires that an account can be deleted from inside the app.
 * So this removes the KV data first and the Supabase login last, through the
 * service-role admin API (see deleteAuthUser): once the login is gone the
 * caller can no longer authenticate a retry, so everything that can fail
 * independently has to be done before it.
 *
 * Without SUPABASE_SERVICE_ROLE_KEY nothing is deleted at all and the route
 * answers 500. Deleting the data but leaving the login would make the screen's
 * "your account is deleted" untrue, which is the exact defect this replaced.
 *
 * Still not covered here: push subscriptions of the person's *other* devices
 * (keyed by device, not account — this device unsubscribes itself first, see
 * src/lib/eraseData.ts) and the Stripe customer object, which Stripe keeps
 * under its own retention duties. */

import { kvDel, kvGet } from './kv.js';
import { subscriptionKey, customerKey, isActiveStatus, type StoredSubscription } from './stripeKeys.js';
import { canDeleteAuthUsers, deleteAuthUser } from './auth.js';
import { sensitiveConsentKey } from './consent.js';

export type EraseResult =
  | { ok: true; deleted: string[] }
  | { ok: false; reason: 'active-subscription' | 'not-configured' };

/** Keys holding something about this person. Push subscriptions are keyed by
 * device, not account, so the client unsubscribes its own device before
 * calling this; ratings are stored with nothing that identifies who left
 * them; the usage counters hold a number and expire within the day. */
function personalKeys(userId: string): string[] {
  return [
    `cloudbackup:${userId}`,
    `privacyconsent:${userId}`,
    sensitiveConsentKey(userId),
    `referral:bonus:${userId}`,
    `referral:redeemed:${userId}`,
  ];
}

export async function eraseAccountData(userId: string): Promise<EraseResult> {
  if (!canDeleteAuthUsers()) return { ok: false, reason: 'not-configured' };

  // Refused while billing is live, on purpose. Dropping the customer mapping
  // under an active subscription would leave the person paying Stripe every
  // month with nothing on this side able to connect the payment to them, or
  // to stop it — a worse outcome than asking them to cancel first. The
  // billing portal is one tap away on the same screen.
  const subscription = await kvGet<StoredSubscription>(subscriptionKey(userId));
  if (subscription && isActiveStatus(subscription.status)) {
    return { ok: false, reason: 'active-subscription' };
  }

  const keys = [...personalKeys(userId), subscriptionKey(userId), customerKey(userId)];
  for (const key of keys) await kvDel(key);
  // Last, on purpose — see the note at the top of this file.
  await deleteAuthUser(userId);
  return { ok: true, deleted: [...keys, 'supabase-auth-user'] };
}
