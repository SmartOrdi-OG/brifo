/** Brifo running inside Telegram's Mini App webview — the same app, opened
 * from a button in the bot chat instead of a home-screen icon.
 *
 * Only the handful of `Telegram.WebApp` members the app actually uses are
 * typed here; the SDK ships no types and pulling in a package for six methods
 * would be more surface than it saves. Everything optional is called through
 * `?.` because Telegram's API is versioned per client — a phone on an older
 * build simply does not have the newer methods, and that must degrade quietly
 * rather than throw. */

interface TelegramBackButton {
  show(): void;
  hide(): void;
  onClick(handler: () => void): void;
  offClick(handler: () => void): void;
}

export interface TelegramWebApp {
  /** Empty when the page was not opened as a Mini App. */
  initData: string;
  colorScheme: 'light' | 'dark';
  BackButton?: TelegramBackButton;
  ready(): void;
  expand(): void;
  /** Bot API 7.7+. Without it, scrolling the page down closes the Mini App. */
  disableVerticalSwipes?(): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  openLink?(url: string, options?: { try_instant_view?: boolean }): void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/** Telegram appends `#tgWebAppPlatform=…` (plus theme and launch data) to the
 * Mini App's URL on every launch. Checking the URL rather than the SDK means
 * detection is synchronous and available before the SDK script has loaded —
 * which is what lets the loader in index.html decide whether to fetch it at
 * all. Kept byte-identical to the key that loader writes. */
const LAUNCH_PARAM = 'tgWebAppPlatform';
const STORAGE_KEY = 'brifo:is-telegram';

/** `sessionStorage`, not `localStorage`, for the same reason as
 * platform.ts's Android check: the flag must not leak out of this tab. A
 * regular browser tab on the same phone that inherited it would hide the
 * subscribe button for no reason. Telegram re-appends the launch params on a
 * hard reload anyway; this only covers in-between navigations. */
function detectAndPersist(): boolean {
  try {
    if (`${window.location.hash}${window.location.search}`.includes(LAUNCH_PARAM)) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      return true;
    }
  } catch {
    // Ignore — locked-down embeds can throw on either access.
  }
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Computed once per app session: the launch params arrive on a real page
 * load and do not change as the SPA navigates. */
export const isTelegramMiniApp = detectAndPersist();

const SDK_TIMEOUT_MS = 3000;
let readyPromise: Promise<TelegramWebApp | null> | null = null;

/** Resolves once Telegram's SDK has loaded, or with null if it never does.
 *
 * index.html injects the script dynamically (so ordinary visitors to the
 * website never fetch a third-party script), which means it is not guaranteed
 * to have run by the time React mounts. Polling is unlovely but it is the only
 * thing that does not depend on the loader exposing a handle — and the timeout
 * matters: on a flaky connection the SDK may simply never arrive, and the app
 * must still work. */
export function whenTelegramReady(): Promise<TelegramWebApp | null> {
  if (!isTelegramMiniApp) return Promise.resolve(null);
  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve) => {
    const deadline = Date.now() + SDK_TIMEOUT_MS;
    const poll = () => {
      const app = window.Telegram?.WebApp;
      if (app) {
        resolve(app);
        return;
      }
      if (Date.now() > deadline) {
        console.warn('[telegram] SDK did not load; running without Mini App chrome');
        resolve(null);
        return;
      }
      setTimeout(poll, 50);
    };
    poll();
  });
  return readyPromise;
}

/** Tells Telegram the page is up, takes the full viewport height, and stops a
 * downward scroll from being read as "close the app". */
export async function initTelegramWebApp(): Promise<TelegramWebApp | null> {
  const app = await whenTelegramReady();
  if (!app) return null;
  app.ready();
  app.expand();
  app.disableVerticalSwipes?.();
  return app;
}

/** Paints Telegram's own header and background in the app's current theme
 * colour, so the chrome above the page does not stay a contrasting slab. */
export function applyTelegramThemeColor(color: string): void {
  const app = window.Telegram?.WebApp;
  app?.setHeaderColor?.(color);
  app?.setBackgroundColor?.(color);
}

/** Opens a URL outside Telegram, in the phone's real browser.
 *
 * This is the only correct way to send someone to checkout from here: a plain
 * link opens Telegram's in-app browser, which is exactly the context the store
 * rules are about. Returns false when there is no SDK to ask, so the caller
 * can fall back. */
export function openOutsideTelegram(url: string): boolean {
  const open = window.Telegram?.WebApp?.openLink;
  if (!open) return false;
  open.call(window.Telegram!.WebApp!, url, { try_instant_view: false });
  return true;
}
