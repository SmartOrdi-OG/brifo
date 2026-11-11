import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportAppError } from '../lib/reportError';
import { clearAccountData } from '../lib/accountSwitch';

/** What the user sees when something throws.
 *
 * Until now: nothing. React unmounts the whole tree when a render throws, so
 * `#root` emptied and the screen went white — no message, no button, no way
 * back. A parent then has only the app icon to look at and no idea whether
 * her letters are gone. The one report that reached us was "الحقني بريفو وقف"
 * with a photograph of a blank screen, which is all the app had given her.
 *
 * It is deliberately not localised. The language comes from a context that
 * sits inside this boundary, so by the time this renders that context may be
 * the very thing that threw; reading it here would throw again and take the
 * screen blank a second time. English plus Arabic, both hard-coded, always
 * render.
 *
 * The second button is the one that actually rescues the common case. A fault
 * caused by malformed data on the device repeats on every launch, and nothing
 * the user can reach from a blank screen clears it. "Start fresh" removes
 * this device's copy — never the server's, which is restored at the next
 * sign-in — so the loop can be broken without deleting the account.
 */
interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportAppError(error, info.componentStack ?? undefined);
  }

  private reload = () => {
    window.location.reload();
  };

  private startFresh = () => {
    // Only this device's copy of the account data. The cloud backup is
    // untouched and comes back on the next sign-in.
    clearAccountData();
    window.location.replace('/');
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        dir="auto"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          padding: 24,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#F5F6FD',
          color: '#1C1D3A',
        }}
      >
        <img src="/icons/icon-192-v3.png" alt="" width={64} height={64} style={{ borderRadius: 16 }} />

        <h1 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>حدث خطأ غير متوقع</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
          بياناتك محفوظة. أعد فتح التطبيق، وإذا تكرّر الخطأ اضغط «ابدأ من جديد» — تُحذف النسخة المحفوظة على هذا
          الجهاز فقط، وتعود من الخادم عند تسجيل الدخول.
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0, maxWidth: 320, color: '#5A5C7A' }}>
          Something went wrong. Your data is safe — reopen the app, or start fresh to clear this device&rsquo;s copy
          only.
        </p>

        <button
          onClick={this.reload}
          style={{
            marginTop: 6,
            width: '100%',
            maxWidth: 320,
            padding: '14px 18px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            color: '#fff',
            fontSize: 15.5,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          أعد المحاولة · Try again
        </button>

        <button
          onClick={this.startFresh}
          style={{
            width: '100%',
            maxWidth: 320,
            padding: '13px 18px',
            borderRadius: 14,
            border: '1px solid #D6D8EC',
            background: '#fff',
            color: '#1C1D3A',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ابدأ من جديد · Start fresh
        </button>
      </div>
    );
  }
}
