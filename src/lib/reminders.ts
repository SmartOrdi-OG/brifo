/** Foreground fallback reminders — fires a local Notification while the app
 * happens to be open. Once push is active (see lib/push.ts) the server
 * handles delivery even when the app is closed, so this path steps aside to
 * avoid double notifications; it only fires when push subscription isn't
 * active (unsupported browser, subscribe failure, etc). */
import { pushEnabled } from './push';

const ENABLED_KEY = 'brifo_reminders_enabled';
const NOTIFIED_KEY = 'brifo_reminders_notified';

export const REMINDER_OFFSET_DAY_BEFORE = 1440;

/** One timing, not a choice.
 *
 * Delivery for a closed app comes from a cron job, and Vercel's Hobby plan
 * caps those at one run per day (see vercel.json). Simulating the real due
 * window against that schedule showed what the other two options were worth:
 * "15 minutes before" never fired at all, and "an hour before" only fired for
 * appointments falling in the one hour after the daily run. Offering them
 * promised the user something the system cannot do.
 *
 * What the day-before offset actually produces is a reminder on the *morning
 * of* the appointment — the daily run is the first one whose window contains
 * the fire time. That's a useful, honest promise, and it is the one the
 * settings screen now makes. Restoring a choice here means moving to a plan
 * with sub-daily cron first. */
export const REMINDER_OFFSETS = [REMINDER_OFFSET_DAY_BEFORE];

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function remindersEnabled(): boolean {
  return notificationsSupported() && Notification.permission === 'granted' && localStorage.getItem(ENABLED_KEY) === '1';
}

export async function enableReminders(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  const permission = await Notification.requestPermission();
  const granted = permission === 'granted';
  localStorage.setItem(ENABLED_KEY, granted ? '1' : '0');
  return granted;
}

export function disableReminders(): void {
  localStorage.setItem(ENABLED_KEY, '0');
}

function readNotifiedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeNotifiedIds(ids: Set<string>): void {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
}

export interface ReminderCandidate {
  id: string;
  title: string;
  /** The originally-requested bucket (day-before/hour-before/...) — stable
   * across repeated checks, so it's what identifies this reminder slot for
   * dedup. Must NOT be used for the notification's text (see actualMinutesLeft). */
  offsetMin: number;
  /** How much time is actually left until the appointment right now — this,
   * not offsetMin, is what the notification's text should be based on, since
   * a late-firing check would otherwise keep claiming e.g. "tomorrow" for
   * something now only an hour out. */
  actualMinutesLeft: number;
}

/** Fires a local notification for each (event, offset) pair that's newly due
 * and hasn't fired yet. */
export function notifyDueReminders(candidates: ReminderCandidate[], bodyForOffset: (actualMinutesLeft: number) => string): void {
  if (!remindersEnabled() || pushEnabled()) return;
  const notified = readNotifiedIds();
  let changed = false;

  for (const c of candidates) {
    const key = `${c.id}:${c.offsetMin}`;
    if (notified.has(key)) continue;
    new Notification(c.title, { body: bodyForOffset(c.actualMinutesLeft), tag: key });
    notified.add(key);
    changed = true;
  }

  if (changed) writeNotifiedIds(notified);
}
