const TWA_REFERRER_PREFIX = 'android-app://';
const STORAGE_KEY = 'brifo:is-android-twa';

/** Detects whether the app is running inside the Android Trusted Web
 * Activity wrapper (the Google Play version) rather than a regular mobile
 * or desktop browser. Android sets `document.referrer` to
 * `android-app://<package-name>` on the very first page load of a TWA —
 * it does not survive a full navigation away and back (e.g. to Stripe
 * Checkout and back), so the result is cached once and reused for the rest
 * of the install.
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
      localStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
  } catch {
    // Ignore — document.referrer/localStorage can throw in locked-down
    // embeds; fall through to whatever was persisted from a prior load.
  }
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Computed once per app session — `document.referrer` doesn't change as
 * the SPA navigates between routes, only on a real page load. */
export const isAndroidTwa = detectAndPersist();
