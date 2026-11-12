/** Telling an iPhone the truth about notifications.
 *
 * The settings screen had one line for every case — "Notifications aren't
 * supported on this device" — and showed it to every iPhone opening Brifo in
 * a Safari tab. On an iPhone it is false: Apple allows web notifications only
 * from the Home Screen, so the device supports them and the user is two taps
 * away. A customer read it, believed it, and stopped.
 *
 * What these pin is the narrowness of the claim. "Add to Home Screen" is
 * useful advice in exactly one situation, and actively wrong in the two that
 * look like it: an iPhone already installed (older iOS, installing changes
 * nothing) and a desktop browser (no Home Screen to add to).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { isIosDevice, isInstalled, notificationBlock } from '../src/lib/notificationBlock';
import { AddToHomeScreenHint } from '../src/components/AddToHomeScreenHint';
import { LanguageProvider } from '../src/context/LanguageContext';
import { translations } from '../src/context/translations';

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
// iPadOS 13 and later say "Macintosh" to every script that asks. The only
// thing separating this string from a desktop Mac is the touch count.
const IPAD =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const MAC = IPAD;
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36';

describe('which devices are iOS', () => {
  it('recognises an iPhone', () => {
    expect(isIosDevice(IPHONE, 'iPhone', 5)).toBe(true);
  });

  it('recognises an iPad behind its Macintosh disguise', () => {
    expect(isIosDevice(IPAD, 'MacIntel', 5)).toBe(true);
  });

  it('does not mistake a desktop Mac for one', () => {
    // Same user-agent string as the iPad above; only the touch count differs.
    expect(isIosDevice(MAC, 'MacIntel', 0)).toBe(false);
  });

  it('does not claim Android', () => {
    expect(isIosDevice(ANDROID, 'Linux armv8l', 5)).toBe(false);
  });
});

describe('whether the app is on the Home Screen', () => {
  it('believes Safari’s own flag', () => {
    expect(isInstalled(true, false)).toBe(true);
  });

  it('believes the standard display-mode query', () => {
    expect(isInstalled(undefined, true)).toBe(true);
  });

  it('says no when neither does', () => {
    expect(isInstalled(false, false)).toBe(false);
  });
});

describe('what the settings screen should say', () => {
  it('nothing at all when notifications already work', () => {
    expect(notificationBlock({ notificationApiAvailable: true, ios: true, installed: false })).toBe('none');
  });

  it('offers the Home Screen to an iPhone in a browser tab', () => {
    expect(notificationBlock({ notificationApiAvailable: false, ios: true, installed: false })).toBe(
      'add-to-home-screen',
    );
  });

  it('does not offer it to an iPhone that is already installed', () => {
    // An iOS older than 16.4. Installing again changes nothing, so sending
    // the user through three steps would waste their time and lose their
    // trust in the next thing the app tells them.
    expect(notificationBlock({ notificationApiAvailable: false, ios: true, installed: true })).toBe('unsupported');
  });

  it('does not offer it to a desktop browser, which has no Home Screen', () => {
    expect(notificationBlock({ notificationApiAvailable: false, ios: false, installed: false })).toBe('unsupported');
  });
});

describe('the hint itself', () => {
  beforeAll(() => {
    const store = new Map<string, string>([['brifo_lang', 'ar']]);
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
  });

  it('names the step the user is looking for', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <AddToHomeScreenHint />
      </LanguageProvider>,
    );
    expect(html).toContain(translations.ar.reminders_ios_step_add);
    expect(html).toContain('<svg');
  });

  it('never repeats the line that sent the customer away', () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <AddToHomeScreenHint />
      </LanguageProvider>,
    );
    expect(html).not.toContain(translations.ar.reminders_unsupported);
  });
});
