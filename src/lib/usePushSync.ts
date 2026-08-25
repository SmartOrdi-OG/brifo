import { useEffect } from 'react';
import type { Lang } from '../context/translations';
import type { Remindable } from './useReminderScheduler';
import { pushEnabled, subscribeToPush, syncPushReminders } from './push';
import { REMINDER_OFFSETS } from './reminders';

/** Keeps the server's copy of "what to remind this device about" in sync
 * with local events and language — debounced so rapid edits (e.g. typing)
 * don't fire a request per keystroke. */
export function usePushSync(events: Remindable[], lang: Lang) {
  // Re-registers this device's subscription with the server once per app
  // load, silently, whenever the local "reminders enabled" flag is set.
  //
  // The server drops a device from its rotation the moment a single push
  // send to it comes back 404/410 (see runDueReminders/removeSubscription in
  // src/server/push.ts) — which can happen for reasons that have nothing to
  // do with the user's intent (a token rotation, an extended offline spell,
  // iOS being iOS about background push). Nothing told the client this
  // happened: pushEnabled() only ever reads the local flag, syncPushReminders
  // kept "succeeding" (it just writes reminder data the cron would never
  // read again), and Settings kept showing reminders as on — so a device
  // could lose reminders permanently and silently, with no way to notice
  // short of manually toggling the setting off and back on.
  //
  // subscribeToPush() reuses the existing browser-side subscription when one
  // exists (pushManager.getSubscription()), so re-running it here is a cheap,
  // idempotent no-op on the happy path and a silent recovery on the unhappy
  // one — it re-adds the device to the server's rotation without the user
  // ever needing to touch the toggle.
  useEffect(() => {
    if (pushEnabled()) subscribeToPush();
  }, []);

  useEffect(() => {
    if (!pushEnabled()) return;
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events.filter((e) => e.date >= today).map((e) => ({ id: e.id, title: e.title, date: e.date, time: e.time }));

    const timeout = setTimeout(() => {
      syncPushReminders(upcoming, REMINDER_OFFSETS, lang);
    }, 800);

    return () => clearTimeout(timeout);
  }, [events, lang]);
}
