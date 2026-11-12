/** How long the splash stays up when there is nothing left to wait for.
 *
 * On a phone that already has the bundle cached there is no wait at all, so
 * the splash would otherwise flash for a single frame — which reads as a
 * glitch rather than as the app opening. A floor turns it into a deliberate
 * moment.
 *
 * It is a real cost, paid on every launch by someone opening the app to check
 * one deadline, so it is kept short and is a floor and not a duration: when
 * the app genuinely takes longer than this, nothing is added on top.
 */
export const MIN_SPLASH_MS = 800;

declare global {
  interface Window {
    /** Stamped by the inline script in index.html, at the first paint. */
    __splashStart?: number;
  }
}

/** When the splash first appeared.
 *
 * index.html stamps this before the bundle is even requested, so the floor is
 * measured from what the user actually saw — not from whenever React happened
 * to mount, which on a slow connection is seconds later and would add the
 * whole 800 ms on top of an already long wait.
 *
 * Falls back to "now" if the stamp is missing (an old cached index.html, or a
 * test rendering the app directly), which keeps the full floor rather than
 * skipping it.
 */
export function splashStartedAt(now: number): number {
  const stamped = typeof window === 'undefined' ? undefined : window.__splashStart;
  return typeof stamped === 'number' && Number.isFinite(stamped) && stamped <= now ? stamped : now;
}

/** Milliseconds still owed to the splash; 0 once the floor is met. */
export function splashRemainingMs(now: number): number {
  return Math.max(0, MIN_SPLASH_MS - (now - splashStartedAt(now)));
}
