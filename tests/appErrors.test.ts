/** The error log, both ends of it.
 *
 * It exists so a fault that breaks the app for somebody is visible instead of
 * ending as a console message in a browser nobody here owns. Two properties
 * decide whether that works, and neither is obvious from reading the code:
 *
 * - the same fault reported fifty times has to collapse into one entry with a
 *   count of fifty. Otherwise the list is a stream, and a stream does not get
 *   read.
 * - nothing personal may leave the browser. The scrubber is the only thing
 *   standing between an interpolated error message and an email address in a
 *   log, so it is tested on the shapes that actually identify somebody.
 *
 * And one that is: the store must not be fillable by whoever finds the open
 * route. */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scrubErrorText } from '../src/lib/reportError';

let store: Map<string, unknown>;
let sets: Map<string, Set<string>>;
let counters: Map<string, number>;

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
  kvMarkSentOnce: async () => true,
  kvIncr: async (key: string) => {
    const next = (counters.get(key) ?? 0) + 1;
    counters.set(key, next);
    return next;
  },
}));

const { recordAppError, listAppErrors, clearAppErrors, fingerprint, MAX_MESSAGE_LENGTH, MAX_STACK_LENGTH } =
  await import('../src/server/appErrors.js');

const INDEX = 'errors:ids';

beforeEach(() => {
  store = new Map();
  sets = new Map();
  counters = new Map();
});

describe('collapsing the same fault', () => {
  it('counts a repeat instead of adding a row', async () => {
    const report = { message: 'TypeError: x is not a function', stack: 'at Home (Home.tsx:12:3)' };
    expect(await recordAppError(report)).toBe('recorded');
    expect(await recordAppError(report)).toBe('counted');
    expect(await recordAppError(report)).toBe('counted');

    const list = await listAppErrors();
    expect(list).toHaveLength(1);
    expect(list[0].count).toBe(3);
  });

  it('ignores the ids and numbers inside a message', async () => {
    // "letter 41f9c2 not found" and "letter 7a0b11 not found" are one bug.
    await recordAppError({ message: 'Error: letter 4192 not found', stack: 'at load (Data.tsx:40:1)' });
    await recordAppError({ message: 'Error: letter 7811 not found', stack: 'at load (Data.tsx:40:1)' });
    expect(await listAppErrors()).toHaveLength(1);
  });

  it('keeps two different faults apart even with the same message', async () => {
    // The same generic message from two places is two bugs.
    await recordAppError({ message: 'TypeError: undefined is not an object', stack: 'at Home (Home.tsx:12:3)' });
    await recordAppError({ message: 'TypeError: undefined is not an object', stack: 'at Todo (Todo.tsx:88:9)' });
    expect(await listAppErrors()).toHaveLength(2);
  });

  it('does not split one fault across builds that shifted a line number', async () => {
    const a = fingerprint('TypeError: boom', 'at Home (Home-a1b2.js:12:3)');
    const b = fingerprint('TypeError: boom', 'at Home (Home-a1b2.js:19:7)');
    expect(a).toBe(b);
  });
});

describe('what it keeps', () => {
  it('records where, in what language, on what build', async () => {
    await recordAppError({
      message: 'Error: restore failed',
      stack: 'at restore (cloudBackup.ts:30:5)',
      route: '/settings',
      lang: 'ar',
      platform: 'telegram',
      appVersion: 'ab12cd3',
    });
    const [entry] = await listAppErrors();
    expect(entry).toMatchObject({
      message: 'Error: restore failed',
      route: '/settings',
      lang: 'ar',
      platform: 'telegram',
      appVersion: 'ab12cd3',
      count: 1,
    });
    expect(entry.firstSeen).toBe(entry.lastSeen);
  });

  it('truncates rather than storing an unbounded message or stack', async () => {
    await recordAppError({ message: 'x'.repeat(5000), stack: 'y'.repeat(50000) });
    const [entry] = await listAppErrors();
    expect(entry.message).toHaveLength(MAX_MESSAGE_LENGTH);
    expect(entry.stack).toHaveLength(MAX_STACK_LENGTH);
  });

  it('refuses a report with no message at all', async () => {
    expect(await recordAppError({ message: '   ' })).toBe('rate-limited');
    expect(await listAppErrors()).toHaveLength(0);
  });

  it('lists the most recently seen fault first', async () => {
    await recordAppError({ message: 'Error: first', stack: 'at a (a.ts:1:1)' });
    await new Promise((r) => setTimeout(r, 2));
    await recordAppError({ message: 'Error: second', stack: 'at b (b.ts:1:1)' });
    const list = await listAppErrors();
    expect(list.map((e) => e.message)).toEqual(['Error: second', 'Error: first']);
  });

  it('empties on request, index included', async () => {
    await recordAppError({ message: 'Error: one', stack: 'at a (a.ts:1:1)' });
    await recordAppError({ message: 'Error: two', stack: 'at b (b.ts:1:1)' });
    expect(await clearAppErrors()).toBe(2);
    expect(await listAppErrors()).toHaveLength(0);
    expect(sets.get(INDEX)?.size ?? 0).toBe(0);
  });
});

describe('not being fillable', () => {
  it('stops accepting reports past the daily ceiling', async () => {
    // The route takes no token, so this is the only bound on it. Each report
    // is a distinct fault, which is the expensive case.
    const outcomes = new Set<string>();
    for (let i = 0; i < 2100; i++) {
      outcomes.add(await recordAppError({ message: `Error: distinct ${i}`, stack: `at f (f.ts:${i}:1)` }));
    }
    expect(outcomes.has('rate-limited')).toBe(true);
  });

  it('never keeps more than a few hundred distinct faults', async () => {
    for (let i = 0; i < 400; i++) {
      await recordAppError({ message: `Error: fault ${i}`, stack: `at f (f${i}.ts:1:1)` });
    }
    const list = await listAppErrors();
    expect(list.length).toBeLessThanOrEqual(300);
    // Pruning must delete the rows too, not just drop them from the index.
    expect(sets.get(INDEX)!.size).toBe(list.length);
    expect([...store.keys()].filter((k) => k.startsWith('errors:') && !k.includes('quota')).length).toBe(list.length);
  });

  it('drops faults older than the retention window', async () => {
    // An entry from last year, planted the way the store would hold it.
    const stale = '2024-01-01:abc123';
    store.set(`errors:${stale}`, { id: stale, message: 'old', count: 1, lastSeen: '2024-01-01T00:00:00Z' });
    sets.set(INDEX, new Set([stale]));

    await recordAppError({ message: 'Error: fresh', stack: 'at f (f.ts:1:1)' });

    const list = await listAppErrors();
    expect(list.map((e) => e.message)).toEqual(['Error: fresh']);
    expect(store.has(`errors:${stale}`)).toBe(false);
  });
});

describe('the scrubber', () => {
  it('removes an email address', () => {
    expect(scrubErrorText('Error: no account for parent.name+tag@gmail.com')).toBe('Error: no account for [email]');
  });

  it('removes a bearer token', () => {
    expect(scrubErrorText('401 with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6')).toContain('Bearer [token]');
    expect(scrubErrorText('401 with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6')).not.toContain('eyJhbG');
  });

  it('removes a query string, which carries ids and referral codes', () => {
    const scrubbed = scrubErrorText('failed to load /paywall?ref=abc123&checkout=success');
    expect(scrubbed).not.toContain('ref=');
    expect(scrubbed).toContain('[params]');
  });

  it('removes a long opaque id', () => {
    expect(scrubErrorText('user 7f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c not found')).toBe('user [id] not found');
  });

  it('removes a long run of digits', () => {
    expect(scrubErrorText('phone 436641234567 invalid')).toBe('phone [number] invalid');
  });

  it('leaves an ordinary error message readable', () => {
    const message = 'TypeError: Cannot read properties of undefined (reading "name")';
    expect(scrubErrorText(message)).toBe(message);
  });

  it('keeps line and column numbers in a stack', () => {
    // Short numbers survive — a trace with every number replaced is useless.
    expect(scrubErrorText('at Home (Home.tsx:12:3)')).toBe('at Home (Home.tsx:12:3)');
  });
});
