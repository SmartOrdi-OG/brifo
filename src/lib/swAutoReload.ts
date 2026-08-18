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
