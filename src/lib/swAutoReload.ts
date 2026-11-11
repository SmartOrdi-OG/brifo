/** The generated registerSW.js only registers the service worker — it never
 * reacts once a new one takes over. Combined with skipWaiting()/clientsClaim()
 * in sw.ts, that means a new version installs and refreshes the precache in
 * the background, but the page already on screen keeps running the old bundle.
 * The user therefore only sees an update on the *next* launch — and since iOS
 * suspends installed PWAs rather than closing them, that next launch can be a
 * long way off, which is why reinstalling looked like the only way to update.
 *
 * Reloading when control passes to a new worker closes that gap.
 */
/** How many automatic reloads one browsing session may do, and over how long.
 *
 * The in-page `reloading` flag only survives until the reload it triggers, so
 * on its own it guards nothing: every fresh page attaches a fresh listener
 * with the flag back at false. If a worker keeps handing over — several
 * deploys landing in a row, an install that never settles, storage that will
 * not persist what the page just wrote — the page reloads, reloads again, and
 * the user watches a white screen flash with no way to stop it. Nothing the
 * user can reach from there helps, because nothing stays on screen long
 * enough to touch.
 *
 * Three is more than any real update needs and few enough to be over in a
 * second or two. Past that the page simply stays on the version it has, which
 * is old but usable; the next real navigation picks the new one up. */
const MAX_RELOADS = 3;
const WINDOW_MS = 60_000;
const RELOAD_LOG_KEY = 'brifo_sw_reloads';

/** Exported under this name for tests/whiteScreen.test.tsx only: the guard is
 * the whole point of this file and is worth pinning, but nothing else should
 * call it. */
export const __mayReloadAgainForTests = (): boolean => mayReloadAgain();

function mayReloadAgain(): boolean {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(RELOAD_LOG_KEY);
    const recent = (JSON.parse(raw ?? '[]') as number[]).filter((at) => now - at < WINDOW_MS);
    if (recent.length >= MAX_RELOADS) {
      console.warn('[sw] stopped auto-reloading: the worker kept handing over');
      return false;
    }
    sessionStorage.setItem(RELOAD_LOG_KEY, JSON.stringify([...recent, now]));
    return true;
  } catch {
    // No sessionStorage (private mode, storage disabled) means no way to
    // count, and an uncounted reload is the loop this guard exists for.
    return false;
  }
}

export function enableServiceWorkerAutoReload(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  // On a first-ever visit there is no controller yet, and clientsClaim() will
  // fire controllerchange as the very first worker takes over. Reloading then
  // would be a pointless refresh of an already-current page, so only treat it
  // as an update when we were already controlled by an older worker.
  const hadController = !!navigator.serviceWorker.controller;
  if (!hadController) return;

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    if (!mayReloadAgain()) return;
    reloading = true;
    window.location.reload();
  });

  // The browser only looks for a new worker on navigation (or roughly daily).
  // An installed PWA brought back from the background is resumed rather than
  // navigated, so without an explicit check it can sit on an old version
  // indefinitely — ask on every return to the foreground instead.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    navigator.serviceWorker.getRegistration().then((registration) => {
      // Offline or a transient failure here is fine — the next foreground
      // (or navigation) simply tries again.
      registration?.update().catch(() => {});
    });
  });
}
