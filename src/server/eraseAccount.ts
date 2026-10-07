/** Erasing everything the server holds about one account.
 *
 * The app stores children's names, scanned letters and their photos against a
 * Supabase account id, and publishes a privacy policy. GDPR Art. 17 gives the
 * person a right to have that removed, and until now there was no button and
 * no route — a request to be deleted could not have been honoured.
 *
 * What this does NOT do is remove the Supabase login itself, which needs a
 * service-role key this deployment does not have. So the feature is named for
 * what it actually does — delete your data — rather than "delete account",
 * and the screen says the same. Adding SUPABASE_SERVICE_ROLE_KEY and a call to
 * the admin API is what would close that last gap. */

import { kvDel, kvGet } from './kv.js';
import { subscriptionKey, customerKey, isActiveStatus, type StoredSubscription } from './stripeKeys.js';

export type EraseResult = { ok: true; deleted: string[] } | { ok: false; reason: 'active-subscription' };

/** Keys holding something about this person. Push subscriptions are keyed by
 * device, not account, so the client unsubscribes its own device before
 * calling this; ratings are stored with nothing that identifies who left
 * them; the usage counters hold a number and expire within the day. */
function personalKeys(userId: string): string[] {
  return [
    `cloudbackup:${userId}`,
    `privacyconsent:${userId}`,
    `referral:bonus:${userId}`,
    `referral:redeemed:${userId}`,
  ];
}

export async function eraseAccountData(userId: string): Promise<EraseResult> {
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
  return { ok: true, deleted: keys };
}
