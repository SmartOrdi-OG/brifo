import { isTelegramMiniApp } from './telegramWebApp';

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

/** The surfaces that may not sell a subscription in-app, and must point at
 * the website instead: Google Play because of its Billing policy (above), and
 * the Telegram Mini App because on iOS it falls under Apple's in-app-purchase
 * rules. One flag so the paywall states the rule once rather than growing a
 * condition per store. */
export const hidesInAppPurchase = isAndroidTwa || isTelegramMiniApp;

/** Sends the user to `url` in a real Chrome tab instead of this TWA.
 *
 * A plain link or `window.open` does not escape the TWA: `mybrifo.com` is now
 * a *verified* Android App Link (that is what makes the TWA open without a
 * Chrome address bar in the first place), so Android resolves any ordinary
 * navigation to that domain straight back into this same installed app —
 * exactly the loop the "open in your browser to subscribe" message exists to
 * avoid. Addressing the intent to Chrome by package name skips that
 * resolution step entirely: Android docs are explicit that an intent with an
 * explicit package is delivered only to that package, bypassing the App
 * Links verified-handler logic. Falls back to a no-op (returns false) off
 * Android, where the caller should use a plain link instead. */
export function openOutsideAndroidTwa(url: string): boolean {
  if (!isAndroidTwa) return false;
  try {
    const { host, pathname, search } = new URL(url);
    const intentUrl = `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    return true;
  } catch {
    return false;
  }
}
