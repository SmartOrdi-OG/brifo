import { useState, type CSSProperties, type FormEvent } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { isRtlLang } from '../context/translations';
import { isolateBidiRuns } from '../lib/bidiText';
import type { TranslationKey } from '../context/translations';

type ErrorKind = 'missing' | 'failed' | 'code' | 'password' | 'password_missing' | 'mismatch' | 'too_short';

const inputStyle: CSSProperties = {
  padding: '12px 16px',
  borderRadius: 14,
  border: '1px solid var(--card-border)',
  background: 'var(--card)',
  color: 'var(--text)',
  fontSize: 15,
  textAlign: 'center',
};

const codeInputStyle: CSSProperties = {
  ...inputStyle,
  fontSize: 20,
  letterSpacing: 4,
};

const buttonStyle: CSSProperties = {
  padding: '14px 32px',
  borderRadius: 16,
  border: 'none',
  background: 'linear-gradient(135deg,var(--blue),var(--purple))',
  color: '#fff',
  fontWeight: 800,
  fontSize: 15,
  cursor: 'pointer',
};

const linkStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--blue)',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

const formStyle: CSSProperties = {
  width: '100%',
  maxWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const ERROR_MESSAGE_KEY: Record<ErrorKind, TranslationKey> = {
  missing: 'auth_email_required',
  failed: 'auth_error',
  code: 'auth_code_invalid',
  password: 'auth_password_error',
  password_missing: 'auth_password_required',
  mismatch: 'auth_password_mismatch',
  too_short: 'auth_password_too_short',
};

function PasswordField({
  name,
  autoComplete,
  placeholder,
}: {
  name: string;
  autoComplete: string;
  placeholder: string;
}) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={visible ? 'text' : 'password'}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        dir="ltr"
        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', paddingInlineEnd: 44 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={t(visible ? 'auth_hide_password' : 'auth_show_password')}
        style={{
          position: 'absolute',
          insetInlineEnd: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          padding: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {visible ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
      </button>
    </div>
  );
}

export function AuthGate() {
  const { t, lang } = useLanguage();
  const {
    passwordPromptPending,
    signInWithEmail,
    verifyEmailCode,
    signInWithPassword,
    setPassword,
    skipPasswordPrompt,
    configured,
  } = useAuth();

  const [mode, setMode] = useState<'password' | 'code'>('password');
  const [lastEmail, setLastEmail] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<{ kind: ErrorKind; detail?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    // Reads straight from the form instead of trusting React state — iOS
    // Safari's autofill can update an input's DOM value without firing a
    // React change event.
    const form = new FormData(e.currentTarget);
    const emailValue = typeof form.get('email') === 'string' ? (form.get('email') as string).trim() : '';
    const passwordValue = typeof form.get('password') === 'string' ? (form.get('password') as string) : '';
    setLastEmail(emailValue);
    if (!emailValue) {
      setError({ kind: 'missing' });
      return;
    }
    if (!passwordValue) {
      setError({ kind: 'password_missing' });
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signInWithPassword(emailValue, passwordValue);
    setLoading(false);
    if (error) {
      setError({ kind: 'password', detail: error });
    }
    // On success, the session updates via onAuthStateChange and App re-renders past this gate.
  }

  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const typed = new FormData(e.currentTarget).get('email');
    const emailValue = typeof typed === 'string' ? typed.trim() : '';
    setLastEmail(emailValue);
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
    setSentTo(emailValue);
  }

  async function handleVerifyCode(e: FormEvent<HTMLFormElement>) {
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
    }
    // On success, passwordPromptPending flips on and this component re-renders
    // into the "set a password" step below, without ever unmounting.
  }

  async function handleSetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = new FormData(e.currentTarget);
    const passwordValue = typeof form.get('password') === 'string' ? (form.get('password') as string) : '';
    const confirmValue = typeof form.get('confirm') === 'string' ? (form.get('confirm') as string) : '';
    if (!passwordValue || !confirmValue) {
      setError({ kind: 'password_missing' });
      return;
    }
    if (passwordValue.length < 6) {
      setError({ kind: 'too_short' });
      return;
    }
    if (passwordValue !== confirmValue) {
      setError({ kind: 'mismatch' });
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await setPassword(passwordValue);
    setLoading(false);
    if (error) {
      setError({ kind: 'failed', detail: error });
    }
    // On success, passwordPromptPending flips off and App renders past this gate.
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
      {configured && (
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: 'var(--muted)',
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 12,
            padding: '8px 14px',
            maxWidth: 320,
          }}
        >
          {isRtlLang(lang) ? isolateBidiRuns(t('auth_pricing_note')) : t('auth_pricing_note')}
        </p>
      )}

      {!configured ? (
        <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 320 }}>{t('auth_not_configured')}</p>
      ) : passwordPromptPending ? (
        <form key="set-password-step" onSubmit={handleSetPassword} noValidate style={formStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{t('auth_set_password_title')}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_set_password_subtitle')}</p>
          <PasswordField name="password" autoComplete="new-password" placeholder={t('auth_password_placeholder')} />
          <PasswordField name="confirm" autoComplete="new-password" placeholder={t('auth_password_confirm_placeholder')} />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
              {t(ERROR_MESSAGE_KEY[error.kind])}
              {error.detail ? ` (${error.detail})` : ''}
            </p>
          )}
          <button type="submit" disabled={loading} style={buttonStyle}>
            {t('auth_set_password_button')}
          </button>
          <button
            type="button"
            onClick={() => {
              skipPasswordPrompt();
              setError(null);
            }}
            style={linkStyle}
          >
            {t('auth_skip_password')}
          </button>
        </form>
      ) : mode === 'code' ? (
        sentTo ? (
          <form key="code-step" onSubmit={handleVerifyCode} noValidate style={formStyle}>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_enter_code').replace('{email}', sentTo)}</p>
            <input
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t('auth_code_placeholder')}
              dir="ltr"
              style={codeInputStyle}
            />
            {error && (
              <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
                {t(error.kind === 'missing' ? 'auth_code_required' : ERROR_MESSAGE_KEY[error.kind])}
                {error.detail ? ` (${error.detail})` : ''}
              </p>
            )}
            <button type="submit" disabled={loading} style={buttonStyle}>
              {t('auth_verify_code')}
            </button>
            <button
              type="button"
              onClick={() => {
                setSentTo(null);
                setError(null);
              }}
              style={linkStyle}
            >
              {t('auth_use_different_email')}
            </button>
          </form>
        ) : (
          <form key="email-code-step" onSubmit={handleSendCode} noValidate style={formStyle}>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_intro')}</p>
            <input
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={lastEmail}
              placeholder={t('auth_email_placeholder')}
              dir="ltr"
              style={inputStyle}
            />
            {error && (
              <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
                {t(error.kind === 'missing' ? 'auth_email_required' : 'auth_error')}
                {error.detail ? ` (${error.detail})` : ''}
              </p>
            )}
            <button type="submit" disabled={loading} style={buttonStyle}>
              {t('auth_send_link')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('password');
                setError(null);
              }}
              style={linkStyle}
            >
              {t('auth_back_to_password_link')}
            </button>
          </form>
        )
      ) : (
        <form key="password-step" onSubmit={handlePasswordLogin} noValidate style={formStyle}>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_intro_password')}</p>
          <input
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={lastEmail}
            placeholder={t('auth_email_placeholder')}
            dir="ltr"
            style={inputStyle}
          />
          <PasswordField name="password" autoComplete="current-password" placeholder={t('auth_password_placeholder')} />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12.5 }}>
              {t(ERROR_MESSAGE_KEY[error.kind])}
              {error.detail ? ` (${error.detail})` : ''}
            </p>
          )}
          <button type="submit" disabled={loading} style={buttonStyle}>
            {t('auth_login_password_button')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('code');
              setError(null);
            }}
            style={linkStyle}
          >
            {t('auth_use_code_link')}
          </button>
        </form>
      )}
    </div>
  );
}
