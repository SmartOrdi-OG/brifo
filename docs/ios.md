# Brifo for iOS (App Store)

The iOS app is the same React app, bundled into a native shell with
[Capacitor](https://capacitorjs.com). The `ios/` folder is **generated** on a
Mac and not committed — `scripts/ios-setup.mjs` recreates it with the bundle
id, permission texts, icon and launch screen.

## What differs from the website

| Area | iOS build |
| --- | --- |
| Backend | Relative `/api/...` calls go to `https://mybrifo.com` (`src/lib/native.ts`), over the native HTTP stack (`CapacitorHttp`), so no CORS changes on the server. |
| Reminders | Scheduled on the device with local notifications at 08:00 the day before (`src/lib/nativeReminders.ts`) — works with the app closed. Web push is not used. |
| Payments | Nothing is sold in the app yet (`sellsNothingInApp` in `src/lib/platform.ts`): no Stripe checkout, no billing-portal button, no pointer to the website (App Store rule 3.1.1). Existing subscribers keep access — the server checks the account. In-app purchase comes in a later step. |
| Sign-in | Same email code. The magic link in the email opens the website, not the app. |
| Camera | The scan screen's file input opens the iOS camera / photo picker (permission texts in Info.plist). |

## First time on the Mac

1. Install **Xcode** from the App Store and open it once (accept the licence).
2. Install **Node.js 22** (https://nodejs.org).
3. In Terminal:

   ```sh
   git clone https://github.com/SmartOrdi-OG/brifo.git
   cd brifo
   git checkout ios-capacitor   # until merged
   npm install
   npm run ios:setup
   npm run ios:open
   ```

4. In Xcode: select the **App** target → *Signing & Capabilities* → Team
   **Smartordi OG**, keep bundle id `com.mybrifo.app`.
5. Run on a simulator or your iPhone (▶︎).

## Upload to TestFlight / App Store

1. Bump **Version** / **Build** in the App target (each upload needs a new build number).
2. Device: *Any iOS Device (arm64)* → **Product → Archive**.
3. Organizer → **Distribute App → App Store Connect → Upload**.
4. The build appears in App Store Connect → TestFlight after processing.

After any web change: `npm run ios:setup` again, then archive.
