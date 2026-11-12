/** Why the notification toggle is missing, when it is.
 *
 * The settings screen used to have one answer for every case: "Notifications
 * aren't supported on this device". On an iPhone that is not true, and it is
 * the worst possible thing to say — Apple allows web notifications only once
 * the site has been added to the Home Screen, so the device supports them
 * perfectly well and the user is two taps away. Told that her phone could not
 * do it, a customer stopped. She was right to: there was nothing else on the
 * screen to try.
 *
 * Every iPhone user who opens Brifo in a Safari tab hits this, so one
 * complaint stands for an unknown number of people who simply believed the
 * message.
 *
 * The functions here are pure and take the environment as arguments, because
 * the interesting cases are the ones this machine cannot be: an iPad that
 * claims to be a Mac, an iPhone already on the Home Screen, a desktop browser
 * with notifications genuinely switched off.
 */

export type NotificationBlock =
  /** Nothing in the way — the toggle works. */
  | 'none'
  /** An iPhone or iPad in a browser tab: Apple's rule, not a missing feature. */
  | 'add-to-home-screen'
  /** Genuinely unavailable here, and nothing the user can do about it. */
  | 'unsupported';

/** iPadOS 13 and later report themselves as "Macintosh" to every script that
 * asks, which is why the touch-point test is here: a desktop Mac has no touch
 * screen, an iPad has several. Without it every iPad falls through to
 * "unsupported" — the exact message this exists to stop showing. */
export function isIosDevice(userAgent: string, platform: string, maxTouchPoints: number): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  return /Mac/.test(platform) && maxTouchPoints > 1;
}

/** Whether the app is running from the Home Screen rather than in a tab.
 *
 * `navigator.standalone` is Safari's own flag and the only one iOS sets
 * reliably; the display-mode query is the standard every other browser
 * answers. Either is enough. */
export function isInstalled(navigatorStandalone: boolean | undefined, displayModeStandalone: boolean): boolean {
  return navigatorStandalone === true || displayModeStandalone;
}

export function notificationBlock(env: {
  notificationApiAvailable: boolean;
  ios: boolean;
  installed: boolean;
}): NotificationBlock {
  if (env.notificationApiAvailable) return 'none';
  // Only an iPhone still in a tab has something to do about it. One already
  // on the Home Screen with no Notification API is an iOS older than 16.4,
  // where installing changes nothing and saying so would send the user off to
  // follow three steps for no result.
  if (env.ios && !env.installed) return 'add-to-home-screen';
  return 'unsupported';
}

/** The same question, asked of the browser this is actually running in. */
export function currentNotificationBlock(): NotificationBlock {
  if (typeof window === 'undefined') return 'unsupported';
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return notificationBlock({
    notificationApiAvailable: 'Notification' in window,
    ios: isIosDevice(nav.userAgent, nav.platform ?? '', nav.maxTouchPoints ?? 0),
    installed: isInstalled(nav.standalone, window.matchMedia?.('(display-mode: standalone)').matches ?? false),
  });
}
