import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isTelegramMiniApp, initTelegramWebApp, applyTelegramThemeColor } from '../lib/telegramWebApp';

/** The tab-bar destinations. Telegram's own back button is hidden on these:
 * they are where the app starts, and a back button that leaves the Mini App
 * from the home screen reads as a broken one. Mirrors BottomNav's list. */
const ROOT_ROUTES = ['/', '/calendar', '/todo', '/guide', '/settings'];

/** Renders nothing. It exists to make the Mini App feel native inside
 * Telegram: full viewport height, a header painted in the app's own colour,
 * scrolling that doesn't close the window, and Telegram's system back button
 * driving the router.
 *
 * Mounted above the gates in main.tsx rather than inside App, so the chrome is
 * right on the privacy-consent and sign-in screens too — those are the first
 * thing a Telegram user sees, and they are exactly where a back button that
 * silently closes the app is most expensive. */
export function TelegramChrome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isTelegramMiniApp) return;
    let cancelled = false;
    initTelegramWebApp().then((app) => {
      if (app && !cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The theme colour is read back off the meta tag rather than kept as a copy
  // of ThemeContext's palette: ThemeContext already writes the current theme's
  // colour there, so reading it is always right and can never drift. The
  // location dependency is what re-runs it after a theme change, since the
  // toggle lives on a screen the user then navigates away from.
  useEffect(() => {
    if (!ready) return;
    const color = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
    if (color) applyTelegramThemeColor(color);
  }, [ready, location.pathname]);

  useEffect(() => {
    if (!ready) return;
    const backButton = window.Telegram?.WebApp?.BackButton;
    if (!backButton) return;
    const goBack = () => navigate(-1);
    backButton.onClick(goBack);
    return () => backButton.offClick(goBack);
  }, [ready, navigate]);

  useEffect(() => {
    if (!ready) return;
    const backButton = window.Telegram?.WebApp?.BackButton;
    if (!backButton) return;
    if (ROOT_ROUTES.includes(location.pathname)) backButton.hide();
    else backButton.show();
  }, [ready, location.pathname]);

  return null;
}
