/** A log of the faults users actually hit, readable at /admin.
 *
 * Until now nothing told anyone when Brifo broke for somebody. A render that
 * threw, a failed restore, a scan that came back unusable — all of it ended as
 * console.error in a browser nobody here owns. The only way a fault reached us
 * was a parent giving up and saying so, which is not a channel.
 *
 * This is deliberately a log and not a monitoring product. No third party, no
 * new processor in the privacy policy, no source maps, no alerting: a list of
 * what broke, how often, and when it was last seen, in the same admin screen
 * as the ratings. That is the difference between knowing and not knowing,
 * which is the part that was missing.
 *
 * What it stores is the error text, where in the app it happened, and the
 * language and build — never who. See scrubErrorText in
 * src/lib/reportError.ts for what the client strips before sending, and point
 * 3h of the privacy policy for what this says publicly. */

import { kvGet, kvSet, kvDel, kvSadd, kvSrem, kvSmembers, kvIncr } from './kv.js';

const INDEX = 'errors:ids';
const errorKey = (id: string) => `errors:${id}`;

/** Distinct faults kept. Occurrences of a fault already seen only bump a
 * counter, so this is a ceiling on *kinds* of breakage, not on traffic — 300
 * is far more than a working app produces and small enough to list in one
 * screen without paging. */
const MAX_TRACKED = 300;

/** How long a fault nobody has hit again stays in the list. */
const RETENTION_DAYS = 30;

/** Total reports accepted per day, across everyone. The report route takes no
 * token — a fault can happen before sign-in, or while sign-in is what is
 * broken — so this is what stops the endpoint being a way to fill the store.
 * Reports past the ceiling are dropped, and the drop is logged once so a day
 * that hit the wall is visible rather than silently truncated. */
const MAX_REPORTS_PER_DAY = 2000;

export const MAX_MESSAGE_LENGTH = 300;
export const MAX_STACK_LENGTH = 2000;

export interface AppErrorReport {
  message: string;
  stack?: string | null;
  /** The in-app route, path only — the client strips the query string. */
  route?: string | null;
  lang?: string | null;
  /** 'telegram' | 'twa' | 'browser' — which shell the app was running in. */
  platform?: string | null;
  /** The build that produced it, so a fixed fault can be told from a live one. */
  appVersion?: string | null;
}

export interface StoredAppError {
  id: string;
  message: string;
  stack: string | null;
  route: string | null;
  lang: string | null;
  platform: string | null;
  appVersion: string | null;
  /** How many times this same fault has been reported. */
  count: number;
  firstSeen: string;
  lastSeen: string;
}

function clean(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

/** Today in Vienna, matching the window the daily ceiling resets on
 * elsewhere (see entitlement.ts). */
function viennaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date());
}

/** The identity of a fault: the same bug reported by fifty people has to
 * collapse into one entry with a count of fifty, or the list is a stream and
 * nobody reads it.
 *
 * Message plus the first stack frame, because the message alone merges
 * genuinely different faults ("undefined is not an object" happens in a dozen
 * places) while the whole stack splits one fault across every build that
 * shifted a line number. Dates, ids and numbers inside the message are
 * flattened for the same reason: "letter 41f9c2 not found" and "letter 7a0b11
 * not found" are one bug. */
export function fingerprint(message: string, stack: string | null): string {
  const topFrame = (stack ?? '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('at '));
  const generalised = `${message}|${topFrame ?? ''}`
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .slice(0, 200);

  // A short, stable hash — this only has to avoid accidental collisions
  // between a few hundred strings, and it must not need a crypto import on a
  // route that runs on every reported fault.
  let hash = 0;
  for (let i = 0; i < generalised.length; i++) {
    hash = (hash * 31 + generalised.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

/** Ids sort chronologically because they start with the date, so "oldest" is
 * just the front of a sorted list — no timestamps to read back. */
const idFor = (day: string, fp: string) => `${day}:${fp}`;
const dayOf = (id: string) => id.slice(0, 10);

/** Keeps the list inside both limits: drops anything past the retention
 * window, then drops oldest-first until there is room. Runs only when a fault
 * nobody has seen before arrives, which on a healthy day is never. */
async function pruneIndex(cutoffDay: string): Promise<void> {
  const ids = (await kvSmembers(INDEX)).sort();
  const expired = ids.filter((id) => dayOf(id) < cutoffDay);
  const remaining = ids.filter((id) => dayOf(id) >= cutoffDay);
  const overflow = remaining.slice(0, Math.max(0, remaining.length - (MAX_TRACKED - 1)));

  for (const id of [...expired, ...overflow]) {
    await kvDel(errorKey(id));
    await kvSrem(INDEX, id);
  }
}

export type RecordOutcome = 'recorded' | 'counted' | 'rate-limited';

export async function recordAppError(report: AppErrorReport): Promise<RecordOutcome> {
  const message = clean(report.message, MAX_MESSAGE_LENGTH);
  if (!message) return 'rate-limited';

  const day = viennaToday();
  const accepted = await kvIncr(`errors:quota:${day}`, 36 * 60 * 60);
  if (accepted > MAX_REPORTS_PER_DAY) {
    if (accepted === MAX_REPORTS_PER_DAY + 1) {
      console.error(`[appErrors] daily report ceiling reached (${MAX_REPORTS_PER_DAY}) — dropping the rest of ${day}`);
    }
    return 'rate-limited';
  }

  const stack = clean(report.stack, MAX_STACK_LENGTH);
  const id = idFor(day, fingerprint(message, stack));
  const now = new Date().toISOString();

  const existing = await kvGet<StoredAppError>(errorKey(id));
  if (existing) {
    // Read-modify-write, not atomic: two reports landing together can lose a
    // count. That is the right trade here — the number is for triage ("a lot"
    // versus "once"), and the alternative is a second key per fault.
    await kvSet(errorKey(id), { ...existing, count: existing.count + 1, lastSeen: now });
    return 'counted';
  }

  const cutoff = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(
    new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000),
  );
  await pruneIndex(cutoff);

  const entry: StoredAppError = {
    id,
    message,
    stack,
    route: clean(report.route, 120),
    lang: clean(report.lang, 8),
    platform: clean(report.platform, 20),
    appVersion: clean(report.appVersion, 40),
    count: 1,
    firstSeen: now,
    lastSeen: now,
  };
  await kvSet(errorKey(id), entry);
  await kvSadd(INDEX, id);
  return 'recorded';
}

/** Most recently seen first — what broke for somebody just now matters more
 * than what broke most often three weeks ago. */
export async function listAppErrors(): Promise<StoredAppError[]> {
  const ids = await kvSmembers(INDEX);
  const entries = await Promise.all(ids.map((id) => kvGet<StoredAppError>(errorKey(id))));
  return entries
    .filter((e): e is StoredAppError => e !== null)
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
}

/** Clears the list once a batch of faults has been dealt with, so the screen
 * shows what is wrong now rather than a history. */
export async function clearAppErrors(): Promise<number> {
  const ids = await kvSmembers(INDEX);
  for (const id of ids) {
    await kvDel(errorKey(id));
    await kvSrem(INDEX, id);
  }
  return ids.length;
}
