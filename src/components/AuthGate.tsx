import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function AuthGate() {
  const { t } = useLanguage();
  const { signInWithEmail, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError(false);
    const { error } = await signInWithEmail(email.trim());
    setLoading(false);
    if (error) {
      setError(true);
      return;
    }
    setSent(true);
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
      ) : sent ? (
        <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 320 }}>{t('auth_check_email')}</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{t('auth_intro')}</p>
          <input
            type="email"
            required
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
          {error && <p style={{ color: 'var(--red)', fontSize: 12.5 }}>{t('auth_error')}</p>}
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
