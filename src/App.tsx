import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './screens/Home';
import { Onboarding } from './screens/Onboarding';
import { Scan } from './screens/Scan';
import { Result } from './screens/Result';
import { Reply } from './screens/Reply';
import { Calendar } from './screens/Calendar';
import { Guide } from './screens/Guide';
import { GuideArticle } from './screens/GuideArticle';
import { Paywall } from './screens/Paywall';
import { Settings } from './screens/Settings';
import { ChildNew } from './screens/ChildNew';
import { ChildProfile } from './screens/ChildProfile';
import { Todo } from './screens/Todo';
import { Search } from './screens/Search';
import { Datenschutz } from './screens/Datenschutz';
import { Impressum } from './screens/Impressum';
import { AGB } from './screens/AGB';
import { Admin } from './screens/Admin';
import { PrivacyConsentGate } from './components/PrivacyConsentGate';
import { AuthGate } from './components/AuthGate';
import { PremiumGate } from './components/PremiumGate';
import { useLanguage } from './context/LanguageContext';
import { useData } from './context/DataContext';
import { useAuth } from './context/AuthContext';
import { useReminderScheduler } from './lib/useReminderScheduler';
import { usePushSync } from './lib/usePushSync';
import { hasAcceptedPrivacyPolicy, syncConsentToServer } from './lib/consent';
import { captureReferralCodeFromUrl } from './lib/referral';

function App() {
  const { t, lang } = useLanguage();
  const { events, todos } = useData();
  const { session, loading: authLoading, passwordPromptPending, syncUserLanguage } = useAuth();
  const location = useLocation();
  const [consented, setConsented] = useState(hasAcceptedPrivacyPolicy());
  const remindables = [
    ...events,
    ...todos
      .filter((item) => !item.done && item.dueDate)
      .map((item) => ({ id: item.id, title: item.title, date: item.dueDate! })),
  ];
  useReminderScheduler(
    remindables,
    t('reminders_body_day_before'),
    t('reminders_body_today'),
    t('reminders_body_hour_before'),
    t('reminders_body_soon'),
  );
  usePushSync(remindables, lang);

  useEffect(() => {
    if (session) syncConsentToServer();
  }, [session]);

  // Mirror the chosen language onto the account so Supabase's email templates
  // can send the sign-in code in it. Runs on sign-in and on every later
  // change, which is what brings accounts created before this into line.
  useEffect(() => {
    if (session) syncUserLanguage(lang);
    // syncUserLanguage is stable for the provider's lifetime; depending on it
    // would re-run this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, lang]);

  // Must run before any gate below gets a chance to strip ?ref= off via a
  // redirect/navigation, and before sign-up — captured once, it survives in
  // localStorage through privacy consent and the whole auth flow.
  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  // The privacy policy, Impressum, and AGB must stay reachable without a
  // barrier — the first two because there's otherwise no way to read them
  // before agreeing (Impressum unconditionally, per Austrian law), and AGB
  // because the paywall itself links there for the withdrawal-rights terms.
  const bypassesGate =
    location.pathname === '/datenschutz' || location.pathname === '/impressum' || location.pathname === '/agb';

  if (authLoading) return null;
  if (!consented && !bypassesGate) {
    return <PrivacyConsentGate onAccept={() => setConsented(true)} />;
  }
  if ((!session || passwordPromptPending) && !bypassesGate) {
    return <AuthGate />;
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/scan"
        element={
          <PremiumGate>
            <Scan />
          </PremiumGate>
        }
      />
      <Route path="/result" element={<Result />} />
      <Route
        path="/reply"
        element={
          <PremiumGate>
            <Reply />
          </PremiumGate>
        }
      />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/guide" element={<Guide />} />
      <Route path="/guide/:id" element={<GuideArticle />} />
      <Route path="/paywall" element={<Paywall />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/child/new" element={<ChildNew />} />
      <Route path="/child/:id" element={<ChildProfile />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/search" element={<Search />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/agb" element={<AGB />} />
      <Route path="/admin" element={<Admin />} />
      {/* A stray/mistyped/stale URL otherwise renders nothing at all — React
          Router doesn't fall back to anything without an explicit wildcard. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
