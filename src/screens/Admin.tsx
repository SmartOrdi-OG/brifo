import { useState } from 'react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { isolateBidiRuns } from '../lib/bidiText';

interface StoredRating {
  id: string;
  stars: number;
  comment: string;
  lang: 'ar' | 'de' | 'tr' | 'fa' | 'en' | 'uk';
  createdAt: string;
}

/** Mirrors StoredAppError in src/server/appErrors.ts. */
interface StoredAppError {
  id: string;
  message: string;
  stack: string | null;
  route: string | null;
  lang: string | null;
  platform: string | null;
  appVersion: string | null;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

type Tab = 'ratings' | 'errors';

export function Admin() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('ratings');
  const [ratings, setRatings] = useState<StoredRating[] | null>(null);
  const [errors, setErrors] = useState<StoredAppError[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  /** One password, both lists. Fetching whichever tab is open means switching
   * tabs after unlocking does not ask for it again. */
  async function load(which: Tab) {
    setLoading(true);
    setFailed(false);
    const url = which === 'ratings' ? '/api/admin/ratings' : '/api/admin/errors';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ secret: password }),
      });
      if (!res.ok) {
        setFailed(true);
        if (which === 'ratings') setRatings(null);
        else setErrors(null);
        return;
      }
      const payload = (await res.json()) as { ratings?: StoredRating[]; errors?: StoredAppError[] };
      if (which === 'ratings') setRatings(payload.ratings ?? []);
      else setErrors(payload.errors ?? []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function openTab(which: Tab) {
    setTab(which);
    const alreadyLoaded = which === 'ratings' ? ratings : errors;
    if (password && !alreadyLoaded) void load(which);
  }

  async function clearErrors() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/errors-clear', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ secret: password }),
      });
      if (res.ok) setErrors([]);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const average = ratings && ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length : null;

  const tabButton = (which: Tab, label: string) => (
    <button
      className={`scan-btn${tab === which ? ' primary' : ''}`}
      onClick={() => openTab(which)}
      style={{ flex: 1 }}
    >
      {label}
    </button>
  );

  return (
    <FlowLayout title={t('screen_admin')}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(tab)}
            placeholder={t('admin_password_placeholder')}
            dir="ltr"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid var(--card-border)',
              background: 'var(--card)',
              color: 'var(--text)',
              fontSize: 14,
            }}
          />
          <button className="scan-btn primary" onClick={() => load(tab)} disabled={loading}>
            {t('admin_fetch_button')}
          </button>
        </div>
        {failed && <p style={{ fontSize: 12.5, color: 'var(--red)', marginTop: 8 }}>{t('admin_unauthorized')}</p>}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {tabButton('ratings', t('admin_tab_ratings'))}
        {tabButton('errors', t('admin_tab_errors'))}
      </div>

      {tab === 'ratings' && ratings && (
        <>
          {average !== null && (
            <p style={{ fontSize: 14, fontWeight: 800, margin: '16px 2px' }}>
              {t('admin_average_label').replace('{avg}', average.toFixed(1)).replace('{count}', String(ratings.length))}
            </p>
          )}
          {ratings.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>{t('admin_empty')}</p>}
          {ratings.map((r) => (
            <div key={r.id} className="card" style={{ padding: 14, marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: 'var(--amber)', fontWeight: 800 }}>
                  {'★'.repeat(r.stars)}
                  {'☆'.repeat(5 - r.stars)}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.comment && <p style={{ fontSize: 13.5 }}>{isolateBidiRuns(r.comment)}</p>}
            </div>
          ))}
        </>
      )}

      {tab === 'errors' && errors && (
        <>
          {errors.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>{t('admin_errors_empty')}</p>
          )}
          {errors.length > 0 && (
            <button className="scan-btn" onClick={clearErrors} disabled={loading} style={{ marginTop: 14, width: '100%' }}>
              {t('admin_errors_clear')}
            </button>
          )}
          {errors.map((e) => (
            // Every field here is machine-written English, so it is laid out
            // left-to-right whatever the app's language is — a stack trace
            // mirrored into RTL is unreadable.
            <div key={e.id} className="card" style={{ padding: 14, marginTop: 10 }} dir="ltr">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--red)' }}>
                  {t('admin_errors_count').replace('{count}', String(e.count))}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{new Date(e.lastSeen).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, wordBreak: 'break-word' }}>{e.message}</p>
              <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
                {[e.route, e.platform, e.lang, e.appVersion].filter(Boolean).join(' · ')}
              </p>
              {e.stack && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ fontSize: 11.5, color: 'var(--muted)', cursor: 'pointer' }}>stack</summary>
                  <pre
                    style={{
                      fontSize: 10.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      marginTop: 6,
                      color: 'var(--muted)',
                    }}
                  >
                    {e.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </>
      )}
    </FlowLayout>
  );
}
