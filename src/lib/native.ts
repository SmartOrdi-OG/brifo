import { Capacitor } from '@capacitor/core';

/** True inside the iOS App Store build (Capacitor), false in every browser,
 * the Android TWA and the Telegram Mini App — those all load the website. */
export const isNativeApp = Capacitor.isNativePlatform();
export const isNativeIos = isNativeApp && Capacitor.getPlatform() === 'ios';

/** Where the backend lives. The website calls its own `/api/...` routes
 * relative to itself; the native build is served from capacitor://localhost,
 * where a relative `/api/...` would point at the app bundle instead. */
export const API_ORIGIN = 'https://mybrifo.com';

/** Absolute URL for a backend path in the native build, unchanged on the web. */
export function apiUrl(path: string): string {
  return isNativeApp && path.startsWith('/') ? `${API_ORIGIN}${path}` : path;
}

/** Rewrites every relative `/api/...` fetch to the production backend when
 * running natively, so the existing call sites (lib/*, screens/Scan,
 * screens/Reply, error reporting…) need no per-call changes. Must run before
 * anything else fetches — main.tsx calls it first. No-op on the web. */
export function installNativeApiBase(): void {
  if (!isNativeApp || typeof window === 'undefined') return;
  const original = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return original(apiUrl(input), init);
    }
    return original(input, init);
  };
}
