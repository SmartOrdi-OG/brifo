/** The floor under the splash.
 *
 * On a phone with the bundle already cached there is no wait at all, so
 * without a floor the splash renders for one frame and reads as a glitch.
 * With one it is a deliberate moment. The two things worth pinning are that
 * the floor is measured from what the user saw, and that it is a floor and
 * not a duration — a slow launch must not have 800 ms added on top of it.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { MIN_SPLASH_MS, splashStartedAt, splashRemainingMs } from '../src/lib/splashTiming';

function stamp(value: unknown) {
  (globalThis as { window?: unknown }).window = { __splashStart: value };
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe('splashRemainingMs', () => {
  it('owes the whole floor the instant the page paints', () => {
    stamp(1_000);
    expect(splashRemainingMs(1_000)).toBe(MIN_SPLASH_MS);
  });

  it('owes what is left part-way through', () => {
    stamp(1_000);
    expect(splashRemainingMs(1_300)).toBe(MIN_SPLASH_MS - 300);
  });

  it('owes nothing once the floor is met', () => {
    stamp(1_000);
    expect(splashRemainingMs(1_000 + MIN_SPLASH_MS)).toBe(0);
  });

  it('adds nothing to a launch that was already slow', () => {
    // The whole point of a floor rather than a duration: a phone that took
    // four seconds to get here does not then wait another 0.8.
    stamp(1_000);
    expect(splashRemainingMs(5_000)).toBe(0);
  });
});

describe('splashStartedAt', () => {
  it('measures from the stamp index.html wrote, not from React mounting', () => {
    stamp(1_000);
    expect(splashStartedAt(4_000)).toBe(1_000);
  });

  it('falls back to now when the stamp is missing', () => {
    // An index.html cached before the stamp existed. Keeping the full floor
    // is the safe way to be wrong: a short pause, never a negative one.
    stamp(undefined);
    expect(splashStartedAt(4_000)).toBe(4_000);
    expect(splashRemainingMs(4_000)).toBe(MIN_SPLASH_MS);
  });

  it('ignores a stamp that is not a usable number', () => {
    for (const bad of ['soon', NaN, Infinity, null, {}]) {
      stamp(bad);
      expect(splashStartedAt(4_000)).toBe(4_000);
    }
  });

  it('ignores a stamp from the future', () => {
    // A clock change between the stamp and now would otherwise make the
    // remaining time longer than the floor itself.
    stamp(9_000);
    expect(splashStartedAt(4_000)).toBe(4_000);
    expect(splashRemainingMs(4_000)).toBe(MIN_SPLASH_MS);
  });
});
