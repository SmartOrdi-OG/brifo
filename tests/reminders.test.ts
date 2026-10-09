/** Reminder delivery — the cron path.
 *
 * This is the feature that has to work while the app is closed, it gets one
 * run a day on the Hobby plan, and nobody is watching it. Everything about it
 * is arithmetic over timezones and a dedupe claim: an appointment is stored as
 * "2026-07-01" plus maybe "09:30", and the question "is this due now?" has to
 * be answered in Vienna local time, across a daylight-saving change, in a
 * process running in UTC. Get the offset backwards and every reminder lands an
 * hour or two out, or on the wrong day, and the only signal is a parent
 * missing an appointment.
 *
 * web-push and KV are stubbed, so nothing here sends or stores anything. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const sent: { endpoint: string; payload: Record<string, unknown> }[] = [];
/** Status code the next sendNotification should fail with, if any. */
let failWith: number | 'transient' | null = null;

vi.mock('web-push', () => ({
  default: {
    setVapidDetails: () => {},
    sendNotification: async (sub: { endpoint: string }, body: string) => {
      if (failWith === 'transient') throw new Error('network blip');
      if (failWith !== null) throw Object.assign(new Error('gone'), { statusCode: failWith });
      sent.push({ endpoint: sub.endpoint, payload: JSON.parse(body) });
    },
  },
}));

let store: Map<string, unknown>;
let sets: Map<string, Set<string>>;

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => store.get(key) ?? null,
  kvSet: async (key: string, value: unknown) => void store.set(key, value),
  kvDel: async (key: string) => void store.delete(key),
  kvSadd: async (setKey: string, member: string) => {
    if (!sets.has(setKey)) sets.set(setKey, new Set());
    sets.get(setKey)!.add(member);
  },
  kvSrem: async (setKey: string, member: string) => void sets.get(setKey)?.delete(member),
  kvSmembers: async (setKey: string) => [...(sets.get(setKey) ?? [])],
  kvMarkSentOnce: async (key: string) => {
    if (store.has(key)) return false;
    store.set(key, '1');
    return true;
  },
}));

const push = await import('../src/server/push.js');
const { eventAnchorUtcMs, saveSubscription, syncReminders, runDueReminders } = push;

const SUBSCRIPTION = { endpoint: 'https://push.example/abc', keys: { p256dh: 'p', auth: 'a' } };
const WINDOW = 25 * 60; // what api/cron/send-reminders.ts passes

/** The UTC instant of a wall-clock time in Vienna, worked out independently of
 * the code under test so the two can disagree. */
function viennaInstant(iso: string): number {
  return Date.parse(iso);
}

beforeEach(() => {
  store = new Map();
  sets = new Map();
  sent.length = 0;
  failWith = null;
  process.env.VAPID_PUBLIC_KEY = 'pub';
  process.env.VAPID_PRIVATE_KEY = 'priv';
  process.env.VAPID_SUBJECT = 'mailto:test@example.com';
});

describe('anchoring an appointment to a real instant', () => {
  it('reads a summer time as CEST (UTC+2)', () => {
    expect(eventAnchorUtcMs('2026-07-01', '09:30')).toBe(viennaInstant('2026-07-01T07:30:00Z'));
  });

  it('reads a winter time as CET (UTC+1)', () => {
    expect(eventAnchorUtcMs('2026-01-15', '09:30')).toBe(viennaInstant('2026-01-15T08:30:00Z'));
  });

  it('gets the day the clocks go forward right', () => {
    expect(eventAnchorUtcMs('2026-03-29', '09:00')).toBe(viennaInstant('2026-03-29T07:00:00Z'));
  });

  it('gets the day the clocks go back right', () => {
    expect(eventAnchorUtcMs('2026-10-25', '09:00')).toBe(viennaInstant('2026-10-25T08:00:00Z'));
  });

  it('treats an all-day item as 08:00 Vienna', () => {
    expect(eventAnchorUtcMs('2026-07-01')).toBe(viennaInstant('2026-07-01T06:00:00Z'));
    expect(eventAnchorUtcMs('2026-01-15')).toBe(viennaInstant('2026-01-15T07:00:00Z'));
  });

  it('never lands on the wrong calendar day in Vienna', () => {
    // Midnight and late evening are where an offset applied the wrong way
    // shows up as a date change rather than an hour's error.
    for (const [date, time] of [
      ['2026-07-01', '00:00'],
      ['2026-07-01', '23:30'],
      ['2026-01-15', '00:00'],
      ['2026-01-15', '23:30'],
    ] as const) {
      const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(
        new Date(eventAnchorUtcMs(date, time)),
      );
      expect(local, `${date} ${time}`).toBe(date);
    }
  });
});

describe('the daily run', () => {
  const LEAD = 26 * 60; // REMINDER_LEAD_MINUTES

  async function withDevice(events: { id: string; title: string; date: string; time?: string }[]) {
    await saveSubscription('dev-1', SUBSCRIPTION);
    await syncReminders('dev-1', events, [LEAD], 'de');
  }

  it('sends a reminder on the run before the appointment', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-07-02', time: '09:00' }]);
    // The 08:00 Vienna run on the day before. The appointment is at 07:00 UTC
    // on the 2nd, so the reminder fell due 26h earlier — 05:00 UTC on the 1st.
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));

    const result = await runDueReminders(WINDOW);
    expect(result.sent).toBe(1);
    expect(sent[0].payload.title).toBe('Zahnarzt');
    expect(sent[0].payload.url).toBe('/calendar');
    vi.useRealTimers();
  });

  it('does not send one twice, however often the cron runs', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-07-02', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));

    expect((await runDueReminders(WINDOW)).sent).toBe(1);
    expect((await runDueReminders(WINDOW)).sent).toBe(0);
    expect(sent).toHaveLength(1);
    vi.useRealTimers();
  });

  it('stays quiet when the appointment is still far off', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-12-01', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));
    expect((await runDueReminders(WINDOW)).sent).toBe(0);
    vi.useRealTimers();
  });

  it('does not chase an appointment that already happened', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-06-01', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));
    expect((await runDueReminders(WINDOW)).sent).toBe(0);
    vi.useRealTimers();
  });

  it('says "tomorrow" when it is tomorrow, in the reader\'s language', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-07-02', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));
    await runDueReminders(WINDOW);
    expect(sent[0].payload.body).toContain('morgen');
    vi.useRealTimers();
  });

  it('drops a device the push service says is gone', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-07-02', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));
    failWith = 410;

    const result = await runDueReminders(WINDOW);
    expect(result.removed).toBe(1);
    expect(result.sent).toBe(0);
    expect(await push.runDueReminders(WINDOW)).toMatchObject({ checked: 0 });
    vi.useRealTimers();
  });

  it('retries on the next run after a transient failure', async () => {
    await withDevice([{ id: 'e1', title: 'Zahnarzt', date: '2026-07-02', time: '09:00' }]);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));

    failWith = 'transient';
    expect((await runDueReminders(WINDOW)).sent).toBe(0);

    // The claim must have been released, or the reminder is lost for a
    // fortnight — the dedupe TTL — which is the same as lost.
    failWith = null;
    expect((await runDueReminders(WINDOW)).sent).toBe(1);
    vi.useRealTimers();
  });

  it('does nothing for a device with a subscription but no reminders', async () => {
    await saveSubscription('dev-1', SUBSCRIPTION);
    vi.setSystemTime(new Date('2026-07-01T06:00:00Z'));
    expect(await runDueReminders(WINDOW)).toEqual({ checked: 0, sent: 0, removed: 0 });
    vi.useRealTimers();
  });
});
