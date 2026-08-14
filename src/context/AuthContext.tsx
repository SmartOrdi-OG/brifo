import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { getStashedReferralCode, clearStashedReferralCode } from '../lib/referral';
import { redeemReferral } from '../lib/subscription';

const NEWLY_CREATED_WINDOW_MS = 5 * 60 * 1000;

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  /** False when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY aren't set. */
  configured: boolean;
  /** True right after a code-based sign-in, until the user sets or skips a password. */
  passwordPromptPending: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  setPassword: (password: string) => Promise<{ error: string | null }>;
  skipPasswordPrompt: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordPromptPending, setPasswordPromptPending] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  async function signInWithEmail(email: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'not configured' };
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    return { error: error?.message ?? null };
  }

  // Signing in by tapping the emailed link opens whatever browser handles
  // links on the device (often the mail app's own in-app browser) — not the
  // installed home-screen icon, which has its own isolated storage and so
  // never actually sees the session that link created. The 6-digit code
  // Supabase sends in the same email lets the user finish signing in
  // without ever leaving the app they started from.
  async function verifyEmailCode(email: string, code: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'not configured' };
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (!error) {
      setPasswordPromptPending(true);
      await maybeRedeemReferral(data.user?.id, data.user?.created_at);
    }
    return { error: error?.message ?? null };
  }

  // Existing users also use the code path (it doubles as "forgot password"),
  // so redeeming unconditionally here would let a returning user who happens
  // to have an old stashed ?ref= code claim a reward they were never meant
  // to get. created_at is set the instant signInWithOtp auto-creates a new
  // account, so "very recently created" is a reliable enough signal that
  // this really is a first-time sign-up, not a password-recovery code entry.
  async function maybeRedeemReferral(userId: string | undefined, createdAt: string | undefined): Promise<void> {
    const referrerId = getStashedReferralCode();
    if (!referrerId || !userId || !createdAt) return;
    const isNewAccount = Date.now() - new Date(createdAt).getTime() < NEWLY_CREATED_WINDOW_MS;
    if (isNewAccount) await redeemReferral(referrerId);
    clearStashedReferralCode();
  }

  async function signInWithPassword(email: string, password: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'not configured' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function setPassword(password: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'not configured' };
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setPasswordPromptPending(false);
    return { error: error?.message ?? null };
  }

  function skipPasswordPrompt(): void {
    setPasswordPromptPending(false);
  }

  async function signOut(): Promise<void> {
    await supabase?.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        configured: !!supabase,
        passwordPromptPending,
        signInWithEmail,
        verifyEmailCode,
        signInWithPassword,
        setPassword,
        skipPasswordPrompt,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
