/** The one check standing in front of /admin.
 *
 * That screen shows the ratings people left, the error log with its stack
 * traces, and the configuration check — which names every service this
 * deployment talks to and what state it is in. It is also, deliberately,
 * reachable without signing in (src/lib/gateFreePaths.ts: it reports whether
 * sign-in works, so it cannot sit behind sign-in). So the password is the
 * whole of the protection, and until now it could be guessed at an unlimited
 * rate.
 *
 * Two things fix that, neither of which asks the operator to memorise a
 * longer password:
 *
 *  - a ceiling on wrong guesses per address, so a list of likely passwords
 *    takes years rather than minutes;
 *  - a constant-time comparison, so the time taken to answer does not reveal
 *    how much of the password was right.
 *
 * Both live here rather than in each api/ file, because two copies of a
 * security check is one copy that gets updated. */
import { timingSafeEqual } from 'node:crypto';
import { kvIncr, kvDel } from './kv.js';

/** Wrong guesses allowed from one address before it is shut out. Generous
 * enough that a typo, or a password manager filling the wrong field a few
 * times, never locks the operator out of their own admin screen. */
const MAX_ATTEMPTS = 5;

/** How long the ceiling applies, in seconds. Fifteen minutes turns an
 * unlimited online guessing attack into roughly 480 guesses a day. */
const WINDOW_SECONDS = 15 * 60;

export type AdminAuthResult = 'ok' | 'wrong-secret' | 'rate-limited' | 'not-configured';

/** The caller's address, as Vercel reports it.
 *
 * x-forwarded-for is a comma-separated chain and only the first entry is the
 * client; the rest are proxies. A request arriving without one is counted
 * under a shared "unknown" bucket rather than waved through — being
 * unidentifiable is not a reason to get unlimited guesses. */
function clientAddress(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const first = value?.split(',')[0]?.trim();
  return first && first.length > 0 ? first : 'unknown';
}

/** Compares without leaking, through timing, how far a guess got.
 *
 * `===` on strings stops at the first differing character, so a guess
 * sharing a longer prefix takes measurably longer to reject — enough, over
 * many requests, to recover a secret one character at a time. Lengths are
 * compared first because timingSafeEqual throws on a mismatch; the length of
 * the secret is not what needs hiding. */
function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function authorizeAdmin(
  secret: unknown,
  headers: Record<string, string | string[] | undefined>,
): Promise<AdminAuthResult> {
  const expected = process.env.ADMIN_SECRET;
  // Fail closed. These endpoints only ever run deployed — local `npm run dev`
  // is served by the middleware in vite.config.ts — so a missing secret means
  // a misconfigured deployment, and treating that as "allow" would publish
  // every rating, stack trace and service name to anyone who opened /admin.
  if (!expected) {
    console.error('[admin] ADMIN_SECRET is not set — refusing');
    return 'not-configured';
  }

  const key = `admin:attempts:${clientAddress(headers)}`;

  // Counted before the comparison, so the answer cannot be used to probe
  // whether an address is still under the ceiling. A correct password clears
  // the count below, which is what keeps the operator's own failed attempts
  // from accumulating across a session of getting it right eventually.
  let attempts: number;
  try {
    attempts = await kvIncr(key, WINDOW_SECONDS);
  } catch (err) {
    // KV being down must not lock the operator out of the screen that would
    // tell them KV is down. The password is still required.
    console.error('[admin] could not count attempts, allowing the check:', err);
    attempts = 0;
  }

  if (attempts > MAX_ATTEMPTS) {
    console.warn(`[admin] rate-limited after ${attempts} attempts`);
    return 'rate-limited';
  }

  if (typeof secret !== 'string' || !secretsMatch(secret, expected)) {
    return 'wrong-secret';
  }

  // Clearing on success is not a nicety. The admin screen re-sends the
  // password on every tab switch and on every press of the refresh button in
  // the configuration tab, so without this the operator locks themselves out
  // of their own screen on the sixth correct request in a quarter of an hour
  // — which is an ordinary amount of looking at a page that reports live
  // state. Only wrong guesses should accumulate.
  try {
    await kvDel(key);
  } catch (err) {
    console.error('[admin] could not reset the attempt count:', err);
  }

  return 'ok';
}

/** The HTTP status for a result, so both endpoints answer alike.
 *
 * 'not-configured' is reported as 401 rather than 500 on purpose: the caller
 * is unauthorized either way, and the difference is the operator's business,
 * not an unauthenticated stranger's. It is in the server log instead. */
export function adminAuthStatus(result: Exclude<AdminAuthResult, 'ok'>): number {
  return result === 'rate-limited' ? 429 : 401;
}
