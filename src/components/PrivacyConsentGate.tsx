import { useNavigate } from 'react-router-dom';
import { ImageOff, Trash2, EyeOff, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { TranslationKey } from '../context/translations';
import { acceptPrivacyPolicy, privacyConsentState } from '../lib/consent';
import { LanguagePicker } from './LanguagePicker';

interface PrivacyConsentGateProps {
  onAccept: () => void;
}

/** The three promises, each in its own card.
 *
 * Every one of them is a sentence from the privacy policy, not a slogan: the
 * photo really is read once and never stored (point 3c), anything really can
 * be deleted from Settings (point 4), and the data really is never sold
 * (point 5). The policy does name processors — Anthropic, Supabase, Stripe,
 * Vercel — so the third card says "never sold", which is true, rather than
 * "never shared", which would not be. */
const PROMISES: { Icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { Icon: ImageOff, title: 'privacy_gate_point1_title', body: 'privacy_gate_point1_body' },
  { Icon: Trash2, title: 'privacy_gate_point2_title', body: 'privacy_gate_point2_body' },
  { Icon: EyeOff, title: 'privacy_gate_point3_title', body: 'privacy_gate_point3_body' },
];

/** The first screen anyone ever sees of Brifo, and the one a returning user
 * sees when the policy has changed under them. Those are different people
 * with different questions, so the heading differs: a welcome for the first,
 * the old "we updated this" for the second. */
export function PrivacyConsentGate({ onAccept }: PrivacyConsentGateProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Read once: accepting writes to the same storage this reads, and the
  // heading should not change under the user as the screen leaves.
  const returning = privacyConsentState() === 'outdated';

  function handleAccept() {
    acceptPrivacyPolicy();
    onAccept();
  }

  return (
    <div
      className="app"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        // The bottom padding .app reserves is for the fixed nav bar, which
        // this screen does not have.
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LanguagePicker />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
          paddingBlock: 20,
        }}
      >
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <img
            src="/icons/icon-192-v2.png"
            alt=""
            width={64}
            height={64}
            style={{ borderRadius: 19, boxShadow: '0 12px 28px rgba(109,92,231,.3)' }}
          />
          <h1 style={{ fontSize: 25, fontWeight: 900, letterSpacing: '-0.4px' }}>
            {t(returning ? 'privacy_gate_title' : 'privacy_gate_welcome')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.5, maxWidth: 290 }}>
            {t(returning ? 'privacy_gate_summary' : 'privacy_gate_tagline')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROMISES.map(({ Icon, title, body }) => (
            <div key={title} className="card" style={{ padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 13,
                  background: 'var(--bg-tint)',
                  color: 'var(--blue)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={19} strokeWidth={2.2} />
              </div>
              <div>
                <h3 style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 3 }}>{t(title)}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.45 }}>{t(body)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full width and at the bottom, where a thumb reaches on a phone. The
          two buttons used to sit mid-screen at text width. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <button
          className="scan-btn primary"
          onClick={handleAccept}
          style={{ width: '100%', padding: '17px 24px', fontSize: 16 }}
        >
          {t('privacy_gate_accept')}
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
            padding: 8,
          }}
        >
          {t('privacy_gate_read_full')}
        </button>
      </div>
    </div>
  );
}
