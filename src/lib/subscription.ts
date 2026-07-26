import { supabase } from './supabaseClient';

export interface SubscriptionStatus {
  active: boolean;
  currentPeriodEnd: string | null;
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  try {
    const res = await fetch('/api/subscription-status', { method: 'POST', headers: await authHeader() });
    if (!res.ok) return null;
    return (await res.json()) as SubscriptionStatus;
  } catch (err) {
    console.error('[subscription] status fetch failed:', err);
    return null;
  }
}

/** Starts a Stripe Checkout session and returns its URL to redirect to, or
 * null on failure (network error, not signed in, server misconfigured). */
export async function startCheckout(): Promise<string | null> {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { ...(await authHeader()), 'content-type': 'application/json' },
      body: JSON.stringify({ origin: window.location.origin }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch (err) {
    console.error('[subscription] checkout start failed:', err);
    return null;
  }
}
