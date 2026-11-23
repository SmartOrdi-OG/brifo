import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { isRtlLang, type TranslationKey } from '../context/translations';
import { isolateBidiRuns } from '../lib/bidiText';
import { useSubscription } from '../context/SubscriptionContext';
import { startCheckout } from '../lib/subscription';
import { isAndroidTwa, openOutsideAndroidTwa, sellsNothingInApp } from '../lib/platform';
import { APPLE_EULA_URL, IOS_PAYWALL } from '../lib/nativeStrings';
import { iapAvailable, loadMonthlyOffer, manageSubscription, offerDiagnostic, purchase, restore, type MonthlyOffer } from '../lib/iap';
import { isTelegramMiniApp, openOutsideTelegram } from '../lib/telegramWebApp';
import './Paywall.css';

const FEATURES: TranslationKey[] = ['paywall_feature_scan', 'paywall_feature_organize', 'paywall_feature_reply'];

export function Paywall() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { active, trialDaysLeft, refresh } = useSubscription();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkoutResult = searchParams.get('checkout');
  const rtl = isRtlLang(lang);
  // Prices and periods are full of Latin digits and currency symbols; in RTL
  // prose those runs need isolating or they reorder (see lib/bidiText).
  const bidi = (text: string) => (rtl ? isolateBidiRuns(text) : text);
  const tx = (key: TranslationKey) => bidi(t(key));

  // The webhook that flips the subscription to active can land a moment
  // after Stripe redirects back here, so poll briefly instead of assuming
  // one refresh is enough.
  useEffect(() => {
    if (checkoutResult !== 'success') return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      refresh();
      if (attempts >= 5) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, [checkoutResult, refresh]);

  async function handleSubscribe() {
    setLoading(true);
    setError(false);
    const url = await startCheckout(plan);
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }
    // Neither store lets a digital subscription be sold in-app — Google Play
    // wants Play Billing, and a Telegram Mini App on iOS falls under Apple's
    // rules — so checkout has to happen in a real external browser. A plain
    // `window.location.href` would not get there: on Android, mybrifo.com is
    // now a *verified* App Link, so it would just reopen this same TWA
    // instead of a real Chrome tab; Telegram has no address bar to escape to
    // one either. Each platform gets its own escape hatch straight to the
    // Stripe URL, skipping the extra hop through the paywall page.
    if (isTelegramMiniApp) {
      if (!openOutsideTelegram(url)) window.open(url, '_blank', 'noopener');
      setLoading(false);
      return;
    }
    if (isAndroidTwa) {
      if (!openOutsideAndroidTwa(url)) window.open(url, '_blank', 'noopener');
      setLoading(false);
      return;
    }
    window.location.href = url;
  }

  // iOS App Store build: Apple In-App Purchase through RevenueCat, never
  // Stripe and never a pointer to the website (Guideline 3.1.1 / 3.1.3).
  if (sellsNothingInApp && !active) return <IosPaywall />;

  return (
    <FlowLayout title={t('screen_paywall')}>
      <div className="card paywall-card">
        {active ? (
          <>
            <p className="paywall-active">{t('paywall_already_active')}</p>
            {sellsNothingInApp && (
              <button className="scan-btn" onClick={manageSubscription}>
                {IOS_PAYWALL[lang].manage}
              </button>
            )}
          </>
        ) : (
          <>
            <p className="paywall-value">{tx('paywall_value_line')}</p>

            <p className="paywall-plan-name">{t('paywall_plan_name')}</p>
            <div className="paywall-plans">
              <button
                className={`paywall-plan-btn${plan === 'monthly' ? ' selected' : ''}`}
                onClick={() => setPlan('monthly')}
              >
                {t('paywall_plan_monthly')}
              </button>
              <button
                className={`paywall-plan-btn${plan === 'annual' ? ' selected' : ''}`}
                onClick={() => setPlan('annual')}
              >
                {t('paywall_plan_annual')}
              </button>
            </div>

            <p className="paywall-price">
              {tx(plan === 'annual' ? 'paywall_price_annual' : 'paywall_price')}{' '}
              <span className="paywall-price-period">
                {t(plan === 'annual' ? 'paywall_price_annual_period' : 'paywall_price_period')}
              </span>
            </p>
            {plan === 'annual' && (
              <>
                <p className="paywall-savings">{tx('paywall_annual_savings')}</p>
                {/* The saving is only persuasive next to the number it beats. */}
                <p className="paywall-compare">{tx('paywall_annual_compare')}</p>
              </>
            )}

            {trialDaysLeft > 0 ? (
              <p className="paywall-trial left">
                {bidi(t('paywall_trial_days_left').replace('{days}', String(trialDaysLeft)))}
              </p>
            ) : (
              <p className="paywall-trial ended">{t('paywall_trial_ended')}</p>
            )}

            <p className="paywall-includes-title">{t('paywall_includes_title')}</p>
            <ul className="paywall-features">
              {FEATURES.map((key) => (
                <li className="paywall-feature" key={key}>
                  <Check size={17} strokeWidth={2.75} aria-hidden />
                  <span>{tx(key)}</span>
                </li>
              ))}
            </ul>

            <p className="paywall-free-note">{tx('paywall_free_note')}</p>

            <label className="paywall-consent">
              <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
              <span>
                {t('paywall_consent_label')}{' '}
                <span
                  className="paywall-consent-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/agb');
                  }}
                >
                  {t('paywall_consent_link')}
                </span>
              </span>
            </label>

            <button
              className="scan-btn primary paywall-subscribe"
              disabled={!consented || loading}
              onClick={handleSubscribe}
            >
              {loading ? t('paywall_redirecting') : t('paywall_subscribe_button')}
            </button>
            {error && <p className="paywall-note error">{t('paywall_checkout_error')}</p>}
            {checkoutResult === 'cancelled' && <p className="paywall-note muted">{t('paywall_checkout_cancelled')}</p>}
          </>
        )}
      </div>
    </FlowLayout>
  );
}

function IosPaywall() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const s = IOS_PAYWALL[lang];
  const rtl = isRtlLang(lang);
  const bidi = (text: string) => (rtl ? isolateBidiRuns(text) : text);
  const [offer, setOffer] = useState<MonthlyOffer | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMonthlyOffer()
      .then((o) => {
        if (cancelled) return;
        if (o) setOffer(o);
        else setLoadFailed(true);
      })
      .catch(() => !cancelled && setLoadFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // The server confirms with RevenueCat, which can trail the purchase by a
  // moment; ask a few times instead of trusting one refresh.
  function refreshSoon() {
    let n = 0;
    const iv = setInterval(() => {
      n += 1;
      refresh();
      if (n >= 5) clearInterval(iv);
    }, 1500);
    refresh();
  }

  async function onSubscribe() {
    if (!offer) return;
    setBusy(true);
    setMessage(null);
    const outcome = await purchase(offer.pkg);
    setBusy(false);
    if (outcome === 'subscribed') refreshSoon();
    else if (outcome === 'failed') setMessage(s.error);
  }

  async function onRestore() {
    setBusy(true);
    setMessage(null);
    const ok = await restore();
    setBusy(false);
    setMessage(ok ? s.restored : s.nothingToRestore);
    if (ok) refreshSoon();
  }

  return (
    <FlowLayout title={t('screen_paywall')}>
      <div className="card paywall-card">
        <p className="paywall-value">{bidi(t('paywall_value_line'))}</p>

        {offer ? (
          <>
            {offer.trialDays > 0 && (
              <p className="paywall-trial left">{bidi(s.trial.replace('{days}', String(offer.trialDays)))}</p>
            )}
            <p className="paywall-price">{bidi(s.then.replace('{price}', offer.price))}</p>
          </>
        ) : (
          !loadFailed && <p className="paywall-note muted">…</p>
        )}

        <p className="paywall-includes-title">{t('paywall_includes_title')}</p>
        <ul className="paywall-features">
          {FEATURES.map((key) => (
            <li className="paywall-feature" key={key}>
              <Check size={17} strokeWidth={2.75} aria-hidden />
              <span>{bidi(t(key))}</span>
            </li>
          ))}
        </ul>
        <p className="paywall-free-note">{bidi(t('paywall_free_note'))}</p>

        {iapAvailable && offer && (
          <button className="scan-btn primary paywall-subscribe" disabled={busy} onClick={onSubscribe}>
            {offer.trialDays > 0 ? s.subscribe : s.subscribeNoTrial}
          </button>
        )}
        {loadFailed && <p className="paywall-note error">{s.unavailable}</p>}
        {/* Temporary, while the App Store product is being set up: the reason
            the offer did not load. Remove before App Review. */}
        {loadFailed && offerDiagnostic && (
          <p className="paywall-note muted" dir="ltr" style={{ fontSize: 11, wordBreak: 'break-word' }}>
            {offerDiagnostic}
          </p>
        )}
        {message && <p className="paywall-note muted">{message}</p>}

        <p className="paywall-note muted" style={{ fontSize: 12 }}>
          {s.disclosure}
        </p>

        <button className="scan-btn" disabled={busy} onClick={onRestore}>
          {s.restore}
        </button>

        <p className="paywall-note muted" style={{ textAlign: 'center' }}>
          <a href={APPLE_EULA_URL} target="_blank" rel="noreferrer">
            {s.terms}
          </a>
          {' · '}
          <span className="paywall-consent-link" onClick={() => navigate('/datenschutz')}>
            {s.privacy}
          </span>
        </p>
      </div>
    </FlowLayout>
  );
}
