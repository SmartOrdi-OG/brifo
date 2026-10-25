/** Retention periods the privacy policy (v6, §8) promises, held to the code:
 * ratings at most 24 months. Error reports (30 days) are
 * covered in appErrors.test.ts. */
import { describe, it, expect, beforeEach, vi } from 'vitest';

let store: Map<string, unknown>;
let ttls: Map<string, number | undefined>;
let sets: Map<string, Set<string>>;

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => store.get(key) ?? null,
  kvSet: async (key: string, value: unknown, ttlSeconds?: number) => {
    store.set(key, value);
    ttls.set(key, ttlSeconds);
  },
  kvDel: async (key: string) => void store.delete(key),
  kvSadd: async (setKey: string, member: string) => {
    if (!sets.has(setKey)) sets.set(setKey, new Set());
    sets.get(setKey)!.add(member);
  },
  kvSrem: async (setKey: string, member: string) => void sets.get(setKey)?.delete(member),
  kvSmembers: async (setKey: string) => [...(sets.get(setKey) ?? [])],
  kvMarkSentOnce: async () => true,
}));

vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => ({ ok: true, result: {} }) }) as unknown as Response);

const { submitRating, listRatings, RATING_TTL_SECONDS } = await import('../src/server/ratings.js');

const DAY = 24 * 60 * 60;

beforeEach(() => {
  store = new Map();
  ttls = new Map();
  sets = new Map();
});

describe('ratings', () => {
  it('expire after 24 months', async () => {
    await submitRating(5, 'gut', 'de');
    const key = [...store.keys()][0];
    expect(RATING_TTL_SECONDS).toBe(730 * DAY);
    expect(ttls.get(key)).toBe(RATING_TTL_SECONDS);
  });

  it('leave no dangling id in the index once expired', async () => {
    await submitRating(4, '', 'ar');
    store.clear();
    expect(await listRatings()).toEqual([]);
    expect(sets.get('ratings:ids')?.size ?? 0).toBe(0);
  });
});

