import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { FlowLayout } from './FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { grantSensitiveConsent, hasSensitiveConsent, SENSITIVE_CONSENT_RESET_EVENT } from '../lib/consent';
import './ChildForm.css';

/** The separate, explicit Art. 9 GDPR consent, asked before the first scan
 * or reply draft — the two features that send a letter's content to the
 * model. Letters from doctors, clinics and offices carry health data, and the
 * one "I agree" on the privacy policy is not an explicit consent to that.
 *
 * The box is not pre-ticked, the button does nothing until it is, and "not
 * now" leads back to the app: calendar, tasks, guide and reminders work
 * without this consent (Art. 7(4) — it must not be the price of the rest).
 * The server checks the same consent again (src/server/entitlement.ts). */
export function SensitiveConsentGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [given, setGiven] = useState(hasSensitiveConsent());
  const [ticked, setTicked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  // The server can still say "no consent on record" (another device withdrew
  // it, say); the screens then reset the local copy and this asks again.
  useEffect(() => {
    const onReset = () => setGiven(hasSensitiveConsent());
    window.addEventListener(SENSITIVE_CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(SENSITIVE_CONSENT_RESET_EVENT, onReset);
  }, []);

  if (given) return <>{children}</>;

  async function handleGrant() {
    if (!ticked || saving) return;
    setSaving(true);
    setFailed(false);
    const ok = await grantSensitiveConsent();
    setSaving(false);
    if (ok) setGiven(true);
    else setFailed(true);
  }

  return (
    <FlowLayout title={t('sensitive_consent_title')}>
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: 'var(--bg-tint)',
            color: 'var(--blue)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <HeartPulse size={21} strokeWidth={2.2} />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.55 }}>{t('sensitive_consent_body')}</p>

        <label className="consent-row">
          <input type="checkbox" checked={ticked} onChange={(e) => setTicked(e.target.checked)} />
          <span>{t('sensitive_consent_checkbox')}</span>
        </label>

        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{t('sensitive_consent_note')}</p>

        {failed && (
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>{t('error_connection')}</p>
        )}

        <button
          className="scan-btn primary"
          disabled={!ticked || saving}
          onClick={handleGrant}
          style={{ width: '100%', opacity: ticked ? 1 : 0.5 }}
        >
          {saving ? t('settings_manage_subscription_loading') : t('sensitive_consent_accept')}
        </button>
        <button className="scan-btn" onClick={() => navigate('/')} style={{ width: '100%' }}>
          {t('sensitive_consent_decline')}
        </button>
        <button
          onClick={() => navigate('/datenschutz')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 13.5,
            fontWeight: 700,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          {t('sensitive_consent_more')}
        </button>
      </div>
    </FlowLayout>
  );
}
