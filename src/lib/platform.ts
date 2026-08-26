const TWA_REFERRER_PREFIX = 'android-app://';
const STORAGE_KEY = 'brifo:is-android-twa';

/** Detects whether the app is running inside the Android Trusted Web
 * Activity wrapper (the Google Play version) rather than a regular mobile
 * or desktop browser. Android sets `document.referrer` to
 * `android-app://<package-name>` on every TWA launch (cold or warm), and a
 * same-document reload keeps whatever `document.referrer` the page already
 * had — so the only gap is a hard reload that clears it, which
 * `sessionStorage` covers.
 *
 * `sessionStorage`, not `localStorage`: this used to persist across browser
 * sessions, but that leaked across tabs — once the TWA set the flag, a
 * regular Chrome tab on the same phone/domain inherited it too and hid the
 * subscribe button there as well, defeating the whole point of pointing
 * Android users to the browser to pay. `sessionStorage` is scoped to one
 * tab/window, so the TWA's tab and a separately-opened browser tab never
 * share it.
 *
 * Google Play's payments policy requires digital subscriptions unlocked
 * inside the app to go through Google Play Billing, not a third-party
 * processor like Stripe. Rather than build and maintain a separate Play
 * Billing integration, the Android build simply never offers the in-app
 * purchase flow — `isAndroidTwa` gates the Stripe checkout button so
 * Android users are pointed to the website instead (see Paywall.tsx). */
function detectAndPersist(): boolean {
  try {
    if (document.referrer.startsWith(TWA_REFERRER_PREFIX)) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
  } catch {
    // Ignore — document.referrer/sessionStorage can throw in locked-down
    // embeds; fall through to whatever was persisted earlier this tab.
  }
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Computed once per app session — `document.referrer` doesn't change as
 * the SPA navigates between routes, only on a real page load. */
export const isAndroidTwa = detectAndPersist();
