import { useEffect } from 'react';
import { notifyDueReminders, getReminderOffsets, REMINDER_OFFSET_DAY_BEFORE, REMINDER_OFFSET_HOUR_BEFORE } from './reminders';

/** Anything with a date can be reminded about — calendar events and
 * due-dated todos both qualify. */
export interface Remindable {
  id: string;
  title: string;
  date: string;
  /** HH:MM (24-hour), optional — calendar events may carry one, todos don't. */
  time?: string;
}

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const LOOKBACK_MS = 10 * 60 * 1000;

/** Uses the item's own time when it has one; 08:00 in the device's own local
 * time zone is the assumed appointment time otherwise, same convention the
 * server-side scheduler uses for Europe/Vienna (see src/server/push.ts). */
function eventAnchorMs(dateStr: string, timeStr?: string): number {
  return new Date(`${dateStr}T${timeStr ?? '08:00'}:00`).getTime();
}

/** Foreground fallback: fires a local notification the first time an
 * appointment becomes due at one of the user's chosen offsets, while the app
 * is open. Steps aside once push is active (see notifyDueReminders). */
export function useReminderScheduler(events: Remindable[], dayBeforeLabel: string, hourBeforeLabel: string, soonLabel: string) {
  useEffect(() => {
    // Labels from how much time is actually left at fire time, not from which
    // offset bucket the reminder was originally requested for — a check that's
    // late (e.g. the tab was backgrounded past LOOKBACK_MS) would otherwise
    // keep claiming "tomorrow" for something now only an hour out (see the
    // identical fix on the server side, src/server/push.ts).
    function labelFor(actualMinutesLeft: number): string {
      if (actualMinutesLeft >= REMINDER_OFFSET_DAY_BEFORE) return dayBeforeLabel;
      if (actualMinutesLeft >= REMINDER_OFFSET_HOUR_BEFORE) return hourBeforeLabel;
      return soonLabel;
    }

    function check() {
      const now = Date.now();
      const offsets = getReminderOffsets();
      const due = events.flatMap((e) => {
        const anchor = eventAnchorMs(e.date, e.time);
        if (anchor < now) return []; // already happened — nothing to remind about
        return offsets
          .filter((offsetMin) => {
            const fireAt = anchor - offsetMin * 60000;
            return fireAt <= now && fireAt > now - LOOKBACK_MS;
          })
          .map((offsetMin) => ({ id: e.id, title: e.title, offsetMin, actualMinutesLeft: Math.round((anchor - now) / 60000) }));
      });
      notifyDueReminders(due, labelFor);
    }

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [events, dayBeforeLabel, hourBeforeLabel, soonLabel]);
}
