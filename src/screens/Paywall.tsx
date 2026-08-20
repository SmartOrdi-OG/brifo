import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { isRtlLang, type TranslationKey } from '../context/translations';
import { isolateBidiRuns } from '../lib/bidiText';
import { useSubscription } from '../context/SubscriptionContext';
import { startCheckout } from '../lib/subscription';
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
    window.location.href = url;
  }

  return (
    <FlowLayout title={t('screen_paywall')}>
      <div className="card paywall-card">
        {active ? (
          <p className="paywall-active">{t('paywall_already_active')}</p>
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
