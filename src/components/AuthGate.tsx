import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function AuthGate() {
  const { t } = useLanguage();
  const { signInWithEmail, verifyEmailCode, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<{ kind: 'missing' | 'failed' | 'code'; detail?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    // Reads straight from the form instead of trusting React's `email`
    // state — iOS Safari's autofill can update the input's DOM value
    // without firing a React change event, which left the native
    // `required` check (and this state) seeing an empty field even
    // though the user had visibly typed an address.
    const typed = new FormData(e.currentTarget).get('email');
    const emailValue = typeof typed === 'string' ? typed.trim() : '';
    if (!emailValue) {
      setError({ kind: 'missing' });
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signInWithEmail(emailValue);
    setLoading(false);
    if (error) {
      setError({ kind: 'failed', detail: error });
      return;
    }
    setEmail(emailValue);
    setSentTo(emailValue);
  }

  async function handleSubmitCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || !sentTo) return;
    const typed = new FormData(e.currentTarget).get('code');
    const codeValue = typeof typed === 'string' ? typed.trim() : '';
    if (!codeValue) {
      setError({ kind: 'missing' });
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await verifyEmailCode(sentTo, codeValue);
    setLoading(false);
    if (error) {
      setError({ kind: 'code', detail: error });
      return;
    }
    // On success, the session updates via onAuthStateChange and App re-renders past this gate.
  }

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'linear-gradient(135deg,var(--blue),var(--purple))',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          boxShadow: '0 14px 34px rgba(109,92,231,.4)',
        }}
      >
        <Mail size={32} strokeWidth={2} />
      </div>
      <h1 style={{ fontSize: 21, fontWeight: 900 }}>Brifo</h1>

      {!configured ? (
        <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 320 }}>{t('auth_not_configured')}</p>
      ) : sentTo ? (
        <form
          key="code-step"
          onSubmit={handleSubmitCode}
          style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_enter_code').replace('{email}', sentTo)}</p>
          <input
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t('auth_code_placeholder')}
            style={{
              padding: '12px 16px',
              borderRadius: 14,
              border: '1px solid var(--card-border)',
              background: 'var(--card)',
              color: 'var(--text)',
              fontSize: 20,
              letterSpacing: 4,
              textAlign: 'center',
            }}
          />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
              {t(error.kind === 'missing' ? 'auth_code_required' : error.kind === 'code' ? 'auth_code_invalid' : 'auth_error')}
              {error.detail ? ` (${error.detail})` : ''}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 32px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg,var(--blue),var(--purple))',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {t('auth_verify_code')}
          </button>
          <button
            type="button"
            onClick={() => {
              setSentTo(null);
              setError(null);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            {t('auth_use_different_email')}
          </button>
        </form>
      ) : (
        <form
          key="email-step"
          onSubmit={handleSubmitEmail}
          style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_intro')}</p>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth_email_placeholder')}
            style={{
              padding: '12px 16px',
              borderRadius: 14,
              border: '1px solid var(--card-border)',
              background: 'var(--card)',
              color: 'var(--text)',
              fontSize: 15,
              textAlign: 'center',
            }}
          />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
              {t(error.kind === 'missing' ? 'auth_email_required' : 'auth_error')}
              {error.detail ? ` (${error.detail})` : ''}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 32px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg,var(--blue),var(--purple))',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {t('auth_send_link')}
          </button>
        </form>
      )}
    </div>
  );
}
