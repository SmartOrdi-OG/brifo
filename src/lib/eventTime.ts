/** When an appointment stops being something that is coming up.
 *
 * Events carry a local date (YYYY-MM-DD) and an optional local time (HH:MM).
 * Comparing only the date makes an appointment at 10:50 still "coming up" at
 * 15:14, which is what the reminders panel was showing: the doctor's
 * appointment was over and the bell still listed it under "اليوم".
 */

export interface TimedEvent {
  date: string;
  /** HH:MM, 24-hour, local. Absent means all-day. */
  time?: string;
}

/** Today's date in the device's own timezone.
 *
 * Not `toISOString().slice(0, 10)`, which is UTC: east of Greenwich that
 * rolls over before local midnight, so for the first hour or two of a new day
 * in Vienna "today" is still yesterday — today's appointments then sort as
 * past, and yesterday's as present.
 *
 * (Calendar.tsx, usePushSync.ts and ics.ts still take the UTC route. Worth
 * putting right, but each needs its own look and none of them is what the
 * reminders panel was reported for.) */
export function localDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** The current local time as HH:MM, comparable with an event's `time`. */
export function localTimeKey(now: Date = new Date()): string {
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** Is this event still ahead of `now`?
 *
 * A timed event stops being upcoming the minute its time passes — no grace
 * period, so "upcoming" means "has not started", which is what a reminder is
 * for and the only rule that is simple to explain.
 *
 * An all-day event has no time to pass, so it stays upcoming until its day
 * is over. Dropping it at midnight would be right; dropping it at any hour
 * inside its own day would not.
 */
export function isUpcoming(event: TimedEvent, now: Date = new Date()): boolean {
  const today = localDateKey(now);
  if (event.date !== today) return event.date > today;
  if (!event.time) return true;
  return event.time >= localTimeKey(now);
}
