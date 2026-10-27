/** Erasing everything the server holds about one account, and the login too.
 *
 * The app stores children's names, scanned letters and their photos against a
 * Supabase account id, and publishes a privacy policy. GDPR Art. 17 gives the
 * person a right to have that removed, and Google Play requires an app that
 * creates accounts to offer a way to delete the account itself — not only its
 * contents.
 *
 * This used to stop at the data, because removing the Supabase login needs a
 * service-role key the deployment did not hold. It now deletes the login as
 * well when SUPABASE_SERVICE_ROLE_KEY is set, and reports which of the two it
 * managed, so the screen can tell the person the truth either way rather than
 * claiming an account was deleted when the login outlived it. */

import { kvDel, kvGet } from './kv.js';
import { subscriptionKey, customerKey, isActiveStatus, type StoredSubscription } from './stripeKeys.js';

export type EraseResult =
  | { ok: true; deleted: string[]; accountDeleted: boolean }
  | { ok: false; reason: 'active-subscription' };

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

/** Removes the Supabase login itself. Returns whether it is actually gone.
 *
 * The service-role key bypasses every row-level policy in the project, so it
 * is read here and nowhere else, never sent to the browser, and never
 * included in a message that reaches one. A failure is logged and reported as
 * false rather than thrown: the person's data is already deleted by the time
 * this runs, and turning a surviving login into a 500 would tell them the
 * whole request failed when most of it did not. */
async function deleteSupabaseUser(userId: string): Promise<boolean> {
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    console.error('[erase] SUPABASE_SERVICE_ROLE_KEY is not set — the login will survive the erasure');
    return false;
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    });
    // 404 means the login is already gone — a retried request, or one deleted
    // by hand. The caller wants to know the end state, not who did it.
    if (res.status === 404) return true;
    if (!res.ok) {
      console.error(`[erase] admin delete returned ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[erase] admin delete failed:', err);
    return false;
  }
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

  // The data goes first and the login last, never the other way round.
  // Deleting the login invalidates the access token this request arrived
  // with, so a failure after that point would leave the data behind with no
  // signed-in person left who could ask for it again.
  const accountDeleted = await deleteSupabaseUser(userId);
  return { ok: true, deleted: keys, accountDeleted };
}
