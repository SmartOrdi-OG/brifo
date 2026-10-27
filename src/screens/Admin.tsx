import { useState } from 'react';
import { FlowLayout } from '../components/FlowLayout';
import { useLanguage } from '../context/LanguageContext';
import { useBidiText } from '../lib/bidiText';

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

/** Mirrors ConfigCheck in src/server/configCheck.ts. */
interface ConfigCheck {
  id: string;
  status: 'ok' | 'warn' | 'fail';
  detail: string;
}

type Tab = 'ratings' | 'errors' | 'config';

const STATUS_COLOR: Record<ConfigCheck['status'], string> = {
  ok: 'var(--green)',
  warn: 'var(--amber)',
  fail: 'var(--red)',
};

const STATUS_MARK: Record<ConfigCheck['status'], string> = { ok: '✓', warn: '!', fail: '✕' };

export function Admin() {
  const { t } = useLanguage();
  const bidi = useBidiText();
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('ratings');
  const [ratings, setRatings] = useState<StoredRating[] | null>(null);
  const [errors, setErrors] = useState<StoredAppError[] | null>(null);
  const [config, setConfig] = useState<ConfigCheck[] | null>(null);
  // 'wrong' and 'rate-limited' read very differently to someone standing in
  // front of the screen: one says try again, the other says stop trying.
  const [failed, setFailed] = useState<'wrong' | 'rate-limited' | null>(null);
  const [loading, setLoading] = useState(false);

  /** One password, every list. Fetching whichever tab is open means switching
   * tabs after unlocking does not ask for it again. */
  async function load(which: Tab) {
    setLoading(true);
    setFailed(null);
    const url =
      which === 'ratings' ? '/api/admin/ratings' : which === 'errors' ? '/api/admin/errors' : '/api/admin/config';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ secret: password }),
      });
      if (!res.ok) {
        // 429 is the attempt ceiling in src/server/adminAuth.ts, not a wrong
        // password — telling them apart is the difference between "try
        // again" and "waiting is the only thing that helps".
        setFailed(res.status === 429 ? 'rate-limited' : 'wrong');
        if (which === 'ratings') setRatings(null);
        else if (which === 'errors') setErrors(null);
        else setConfig(null);
        return;
      }
      const payload = (await res.json()) as {
        ratings?: StoredRating[];
        errors?: StoredAppError[];
        checks?: ConfigCheck[];
      };
      if (which === 'ratings') setRatings(payload.ratings ?? []);
      else if (which === 'errors') setErrors(payload.errors ?? []);
      else setConfig(payload.checks ?? []);
    } catch {
      setFailed('wrong');
    } finally {
      setLoading(false);
    }
  }

  function openTab(which: Tab) {
    setTab(which);
    const alreadyLoaded = which === 'ratings' ? ratings : which === 'errors' ? errors : config;
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
      else setFailed(res.status === 429 ? 'rate-limited' : 'wrong');
    } catch {
      setFailed('wrong');
    } finally {
      setLoading(false);
    }
  }

  const average = ratings && ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length : null;

  // warn counts: a Stripe key stuck in test mode is not an error anywhere in
  // the app, and is still the thing that stops the money arriving.
  const brokenCount = config?.filter((c) => c.status !== 'ok').length ?? 0;

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
        {failed && (
          <p style={{ fontSize: 12.5, color: 'var(--red)', marginTop: 8, lineHeight: 1.5 }}>
            {t(failed === 'rate-limited' ? 'admin_rate_limited' : 'admin_unauthorized')}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {tabButton('ratings', t('admin_tab_ratings'))}
        {tabButton('errors', t('admin_tab_errors'))}
        {tabButton('config', t('admin_tab_config'))}
      </div>

      {tab === 'config' && config && (
        <>
          {/* The headline first, because the point of the screen is the one
            * question "is anything wrong?" — not the nine rows below it. */}
          <p style={{ fontSize: 14, fontWeight: 800, margin: '16px 2px', color: brokenCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {brokenCount > 0
              ? t('admin_config_problems').replace('{count}', String(brokenCount))
              : t('admin_config_all_ok')}
          </p>
          <button className="scan-btn" onClick={() => load('config')} disabled={loading} style={{ width: '100%' }}>
            {t('admin_fetch_button')}
          </button>
          {config.map((c) => (
            <div key={c.id} className="card" style={{ padding: 14, marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    background: STATUS_COLOR[c.status],
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {STATUS_MARK[c.status]}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>
                  {bidi(t(`admin_config_${c.id}` as Parameters<typeof t>[0]))}
                </span>
              </div>
              {/* The detail is machine-written English — a Stripe mode, a key
                * length, an error from the service. Left-to-right whatever the
                * app's language is, for the same reason a stack trace is. */}
              <p dir="ltr" style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6, wordBreak: 'break-word' }}>
                {c.detail}
              </p>
            </div>
          ))}
        </>
      )}

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
              {r.comment && <p style={{ fontSize: 13.5 }}>{bidi(r.comment)}</p>}
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
