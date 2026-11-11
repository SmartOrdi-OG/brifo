/** When an appointment stops counting as upcoming.
 *
 * Reported from the app: a paediatrician's appointment at 10:50 was still
 * listed on the reminders bell at 15:14, under "اليوم". The panel filtered on
 * `e.date >= today`, so anything booked for today stayed on the list until
 * midnight however long ago it had finished.
 *
 * The second thing pinned here is the timezone. `toISOString()` is UTC, and
 * Vienna is ahead of it, so for the first hour or two after local midnight a
 * UTC "today" is still yesterday — today's appointments read as past and
 * yesterday's as present. It is a narrow window, but it is the window in
 * which someone checks tomorrow's appointment before going to bed.
 */
import { describe, it, expect } from 'vitest';
import { endOfWeekKey, isUpcoming, localDateKey, localTimeKey } from '../src/lib/eventTime';

/** A local wall-clock moment, whatever the test machine's timezone. */
const at = (y: number, m: number, d: number, hh = 0, mm = 0) => new Date(y, m - 1, d, hh, mm);

describe('a timed appointment on the day itself', () => {
  const appointment = { date: '2026-11-04', time: '10:50' };

  it('is upcoming before its time', () => {
    expect(isUpcoming(appointment, at(2026, 11, 4, 9, 0))).toBe(true);
    expect(isUpcoming(appointment, at(2026, 11, 4, 10, 49))).toBe(true);
  });

  it('is still upcoming in its own minute', () => {
    // "Starting now" is worth a reminder; one minute's grace costs nothing
    // and avoids the appointment vanishing as the clock reaches it.
    expect(isUpcoming(appointment, at(2026, 11, 4, 10, 50))).toBe(true);
  });

  it('is over once its time has passed', () => {
    expect(isUpcoming(appointment, at(2026, 11, 4, 10, 51))).toBe(false);
    // The reported case, exactly.
    expect(isUpcoming(appointment, at(2026, 11, 4, 15, 14))).toBe(false);
  });
});

describe('an all-day event', () => {
  const holiday = { date: '2026-11-04' };

  it('lasts its whole day, whatever the hour', () => {
    // There is no time to pass, so dropping it mid-afternoon would be
    // arbitrary — it is not late, it is simply today.
    expect(isUpcoming(holiday, at(2026, 11, 4, 0, 1))).toBe(true);
    expect(isUpcoming(holiday, at(2026, 11, 4, 23, 59))).toBe(true);
  });

  it('is over the next day', () => {
    expect(isUpcoming(holiday, at(2026, 11, 5, 0, 1))).toBe(false);
  });
});

describe('other days', () => {
  it('a later date is upcoming whatever the times are', () => {
    expect(isUpcoming({ date: '2026-11-05', time: '08:00' }, at(2026, 11, 4, 23, 0))).toBe(true);
  });

  it('an earlier date is not, however late in the day it was', () => {
    expect(isUpcoming({ date: '2026-11-03', time: '23:30' }, at(2026, 11, 4, 0, 1))).toBe(false);
  });
});

describe('the day key follows the device, not UTC', () => {
  it('reads the local calendar date', () => {
    // Just after local midnight. toISOString() would still say the 4th in any
    // timezone ahead of UTC, which is where every one of these families is.
    expect(localDateKey(at(2026, 11, 5, 0, 30))).toBe('2026-11-05');
  });

  it('holds the date through the last minute of the day', () => {
    expect(localDateKey(at(2026, 11, 4, 23, 59))).toBe('2026-11-04');
  });

  it('pads single digits, so the strings compare correctly', () => {
    // '2026-1-5' sorts after '2026-11-04' as a string; the padding is what
    // lets every comparison in this file be a string comparison at all.
    expect(localDateKey(at(2026, 1, 5))).toBe('2026-01-05');
    expect(localTimeKey(at(2026, 1, 5, 9, 5))).toBe('09:05');
  });
});

describe('"this week" ends on Sunday', () => {
  /* Reported from the app: on Wednesday 11 November the home screen said
   * "you have one appointment this week" about an appointment on the 18th.
   * The window was `today + 7 days`, inclusive at both ends — eight days
   * wide, sliding with the date, and never the week the user was in. */

  it('ends on the Sunday of the current week, not seven days out', () => {
    // Wed 11 Nov 2026 → Sun 15 Nov.
    expect(endOfWeekKey(at(2026, 11, 11))).toBe('2026-11-15');
  });

  it('leaves next Wednesday out', () => {
    const today = localDateKey(at(2026, 11, 11));
    const weekEnd = endOfWeekKey(at(2026, 11, 11));
    const nextWeek = '2026-11-18';
    expect(nextWeek >= today && nextWeek <= weekEnd).toBe(false);
  });

  it('keeps an appointment later in the same week', () => {
    const today = localDateKey(at(2026, 11, 11));
    const weekEnd = endOfWeekKey(at(2026, 11, 11));
    for (const date of ['2026-11-11', '2026-11-13', '2026-11-15']) {
      expect(date >= today && date <= weekEnd, date).toBe(true);
    }
  });

  it('treats Sunday as the last day of its own week, not the first of the next', () => {
    // Weeks run Monday to Sunday here, as the calendar screen draws them.
    // Read the other way, Sunday would get a whole extra week.
    expect(endOfWeekKey(at(2026, 11, 15))).toBe('2026-11-15');
  });

  it('gives Monday the whole week', () => {
    expect(endOfWeekKey(at(2026, 11, 16))).toBe('2026-11-22');
  });

  it('crosses a month end without leaving the month', () => {
    // Sat 28 Nov 2026 → Sun 29 Nov; Mon 30 Nov → Sun 6 Dec.
    expect(endOfWeekKey(at(2026, 11, 28))).toBe('2026-11-29');
    expect(endOfWeekKey(at(2026, 11, 30))).toBe('2026-12-06');
  });
});
