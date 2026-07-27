/** Minimal RFC5545 .ics builder for a single event (all-day, or timed with a
 * one-hour default duration) with a 1-day-before alarm. */

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, '');
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function icsTimestamp(): string {
  return `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

/** Floating (no timezone) local date-time, one hour after `time`. */
function addOneHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const total = (h * 60 + m + 60) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}${String(total % 60).padStart(2, '0')}00`;
}

export interface IcsEventInput {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM (24-hour), optional — omit for an all-day event. */
  time?: string;
  description?: string;
}

export function buildIcsContent({ title, date, time, description }: IcsEventInput): string {
  const uid = `brifo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}@brifo.app`;
  const timePart = time ? time.replace(':', '') + '00' : null;
  const dtLines = timePart
    ? [`DTSTART:${toIcsDate(date)}T${timePart}`, `DTEND:${toIcsDate(date)}T${addOneHour(time!)}`]
    : [`DTSTART;VALUE=DATE:${toIcsDate(date)}`, `DTEND;VALUE=DATE:${toIcsDate(addDays(date, 1))}`];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Brifo//Reminders//AR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${icsTimestamp()}`,
    ...dtLines,
    `SUMMARY:${escapeIcsText(title)}`,
    ...(description ? [`DESCRIPTION:${escapeIcsText(description)}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(title)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

function slugify(title: string): string {
  const ascii = title.replace(/[^\x20-\x7E]/g, '').trim();
  const slug = ascii
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'reminder';
}

export function downloadIcsEvent(input: IcsEventInput): void {
  const content = buildIcsContent(input);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brifo-${slugify(input.title)}-${input.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
