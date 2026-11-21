import type { CapacitorConfig } from '@capacitor/cli';

/** The iOS App Store build. The web app is bundled into the binary (webDir),
 * so the app opens without a network round trip; only API calls go out, to
 * the production backend (see src/lib/native.ts). */
const config: CapacitorConfig = {
  appId: 'com.mybrifo.app',
  appName: 'Brifo',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    // Keeps WKWebView's link previews and the like from fighting the app's
    // own long-press handling.
    allowsLinkPreview: false,
  },
  plugins: {
    // Routes fetch/XHR through the native HTTP stack. The bundled app runs on
    // capacitor://localhost, so a browser-side request to mybrifo.com would
    // be cross-origin and need CORS on every API route; native requests have
    // no such restriction, so the backend stays untouched.
    CapacitorHttp: { enabled: true },
    LocalNotifications: { iconColor: '#4F46E5' },
  },
};

export default config;
