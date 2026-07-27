import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { startCheckout } from '../lib/subscription';

export function Paywall() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { active, trialDaysLeft, refresh } = useSubscription();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkoutResult = searchParams.get('checkout');

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
      <div className="card" style={{ padding: '20px', margin: '16px' }}>
        {active ? (
          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--green)' }}>{t('paywall_already_active')}</p>
        ) : (
          <>
            <p style={{ fontSize: 17, fontWeight: 900 }}>{t('paywall_plan_name')}</p>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setPlan('monthly')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 14,
                  border: '1px solid var(--card-border)',
                  background: plan === 'monthly' ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'transparent',
                  color: plan === 'monthly' ? '#fff' : 'var(--text)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                {t('paywall_plan_monthly')}
              </button>
              <button
                onClick={() => setPlan('annual')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 14,
                  border: '1px solid var(--card-border)',
                  background: plan === 'annual' ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'transparent',
                  color: plan === 'annual' ? '#fff' : 'var(--text)',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                {t('paywall_plan_annual')}
              </button>
            </div>

            <p style={{ fontSize: 28, fontWeight: 900, marginTop: 14 }}>
              {plan === 'annual' ? t('paywall_price_annual') : t('paywall_price')}{' '}
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)' }}>
                {plan === 'annual' ? t('paywall_price_annual_period') : t('paywall_price_period')}
              </span>
            </p>
            {plan === 'annual' && (
              <p style={{ fontSize: 12.5, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>{t('paywall_annual_savings')}</p>
            )}
            {trialDaysLeft > 0 ? (
              <p style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 700, marginTop: 8 }}>
                {t('paywall_trial_days_left').replace('{days}', String(trialDaysLeft))}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700, marginTop: 8 }}>{t('paywall_trial_ended')}</p>
            )}
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>{t('paywall_features_note')}</p>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--card-border)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={consented}
                onChange={(e) => setConsented(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)' }}
              />
              <span>
                {t('paywall_consent_label')}{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/agb');
                  }}
                  style={{ color: 'var(--blue)', textDecoration: 'underline' }}
                >
                  {t('paywall_consent_link')}
                </span>
              </span>
            </label>

            <button
              className="scan-btn primary"
              style={{ width: '100%', marginTop: 16 }}
              disabled={!consented || loading}
              onClick={handleSubscribe}
            >
              {loading ? t('paywall_redirecting') : t('paywall_subscribe_button')}
            </button>
            {error && <p style={{ fontSize: 12.5, color: 'var(--red)', marginTop: 10 }}>{t('paywall_checkout_error')}</p>}
            {checkoutResult === 'cancelled' && (
              <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 10 }}>{t('paywall_checkout_cancelled')}</p>
            )}
          </>
        )}
      </div>
    </FlowLayout>
  );
}
