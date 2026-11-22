import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativeApp } from './native';
import type { Remindable } from './useReminderScheduler';

/** In the iOS build, appointment reminders are scheduled on the device with
 * the system's own notification scheduler. WKWebView has neither web push
 * nor the Notification API, and unlike the website's once-a-day server cron
 * a local schedule can fire at any time — even with the app closed.
 *
 * Timing matches what the website promises (see REMINDER_OFFSETS in
 * lib/reminders): a reminder on the morning of the day before, at 08:00
 * device time. An appointment too close for that gets none, the same as on
 * the web. */
const REMINDER_HOUR = 8;
const MAX_SCHEDULED = 60; // iOS keeps at most 64 pending local notifications

/** Stable positive 31-bit id per reminder (the plugin needs an int). */
function notificationId(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function fireTimeFor(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d - 1, REMINDER_HOUR, 0, 0);
}

export async function requestNativeNotificationPermission(): Promise<boolean> {
  if (!isNativeApp) return false;
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    const asked = await LocalNotifications.requestPermissions();
    return asked.display === 'granted';
  } catch {
    return false;
  }
}

export async function cancelAllNativeReminders(): Promise<void> {
  if (!isNativeApp) return;
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    }
  } catch {
    // Nothing useful to do — the next sync tries again.
  }
}

/** Replaces the whole pending set with one reminder per upcoming item. */
async function scheduleNativeReminders(items: Remindable[], body: string): Promise<void> {
  const now = Date.now();
  const upcoming = items
    .map((item) => ({ item, at: fireTimeFor(item.date) }))
    .filter(({ at }) => at.getTime() > now)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, MAX_SCHEDULED);

  await cancelAllNativeReminders();
  if (!upcoming.length) return;
  await LocalNotifications.schedule({
    notifications: upcoming.map(({ item, at }) => ({
      id: notificationId(`${item.id}:${item.date}`),
      title: item.title,
      body,
      schedule: { at, allowWhileIdle: true },
    })),
  });
}

/** Keeps the device's scheduled reminders in step with the user's calendar
 * and tasks. No-op outside the native app, or while reminders are switched
 * off in Settings. */
export function useNativeReminders(items: Remindable[], enabled: boolean, dayBeforeLabel: string) {
  const signature = enabled ? items.map((i) => `${i.id}|${i.date}|${i.title}`).sort().join('\n') : '';
  useEffect(() => {
    if (!isNativeApp) return;
    if (!enabled) {
      void cancelAllNativeReminders();
      return;
    }
    void scheduleNativeReminders(items, dayBeforeLabel).catch((err) => console.error('[reminders] native schedule failed:', err));
    // `signature` captures everything that matters about `items`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, enabled, dayBeforeLabel]);
}
