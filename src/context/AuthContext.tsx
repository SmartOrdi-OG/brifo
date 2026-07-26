import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  /** False when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY aren't set. */
  configured: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    return { error: error?.message ?? null };
  }

  async function signOut(): Promise<void> {
    await supabase?.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, loading, configured: !!supabase, signInWithEmail, verifyEmailCode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
