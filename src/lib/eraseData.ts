import { supabase } from './supabaseClient';
import { authHeader } from './authHeader';

/** Deleting everything this person's data lives in, on both sides.
 *
 * Order matters and is the point of this file. The push subscription goes
 * first because it is keyed by device rather than account, so the server
 * cannot find it from the account alone — only this device knows its own id,
 * and once the local keys are gone nothing can unsubscribe it and the phone
 * keeps getting reminders for data that no longer exists. Then the server
 * copy, then the device, then the session. */

export type EraseOutcome = 'done' | 'active-subscription' | 'failed';

/** Everything the app writes locally. Listed rather than wiping all of
 * localStorage because the origin is shared with nothing else today but may
 * not always be, and a blanket clear is the kind of thing that quietly breaks
 * something else later. */
const LOCAL_KEYS = [
  'brifo_data',
  'brifo_device_id',
  'brifo_gender',
  'brifo_lang',
  'brifo_privacy_consent',
  'brifo_privacy_consent_synced',
  'brifo_push_enabled',
  'brifo_referral_code',
  'brifo_reminders_enabled',
  'brifo_reminders_notified',
  'brifo_theme',
];

async function unsubscribeThisDevice(): Promise<void> {
  try {
    const deviceId = localStorage.getItem('brifo_device_id');
    if (!deviceId) return;
    await fetch('/api/push-unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    });
  } catch (err) {
    // Not fatal: the subscription expires on its own once the browser drops
    // it, and holding up an erasure request over it would be the wrong call.
    console.error('[erase] could not unsubscribe this device:', err);
  }
}

export async function eraseEverything(): Promise<EraseOutcome> {
  await unsubscribeThisDevice();

  let response: Response;
  try {
    response = await fetch('/api/erase-data', { method: 'POST', headers: await authHeader() });
  } catch (err) {
    console.error('[erase] request failed:', err);
    return 'failed';
  }

  if (response.status === 409) return 'active-subscription';
  if (!response.ok) {
    console.error('[erase] server refused:', response.status);
    return 'failed';
  }

  // Only now the device, so a failed server call leaves the user with their
  // data and a retry rather than a half-erased app.
  try {
    for (const key of LOCAL_KEYS) localStorage.removeItem(key);
  } catch (err) {
    console.error('[erase] could not clear local storage:', err);
  }

  try {
    await supabase?.auth.signOut();
  } catch (err) {
    console.error('[erase] sign-out failed:', err);
  }
  return 'done';
}
