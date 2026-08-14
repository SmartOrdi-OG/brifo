import { supabase } from './supabaseClient';

export interface SubscriptionStatus {
  active: boolean;
  currentPeriodEnd: string | null;
  bonusTrialDays: number;
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
export async function startCheckout(plan: 'monthly' | 'annual' = 'monthly'): Promise<string | null> {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { ...(await authHeader()), 'content-type': 'application/json' },
      body: JSON.stringify({ origin: window.location.origin, plan }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch (err) {
    console.error('[subscription] checkout start failed:', err);
    return null;
  }
}

/** Opens Stripe's hosted billing portal, where the user can update payment
 * details or cancel their subscription. Returns the URL to redirect to, or
 * null on failure. */
export async function startBillingPortal(): Promise<string | null> {
  try {
    const res = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { ...(await authHeader()), 'content-type': 'application/json' },
      body: JSON.stringify({ origin: window.location.origin }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch (err) {
    console.error('[subscription] portal start failed:', err);
    return null;
  }
}

/** Grants bonus trial days to both this (brand-new) account and the referrer
 * — safe to call more than once, the server only ever honors it the first
 * time per account. Best-effort: failures are swallowed since there's
 * nothing useful to show the user if it doesn't go through. */
export async function redeemReferral(referrerId: string): Promise<void> {
  try {
    await fetch('/api/redeem-referral', {
      method: 'POST',
      headers: { ...(await authHeader()), 'content-type': 'application/json' },
      body: JSON.stringify({ referrerId }),
    });
  } catch (err) {
    console.error('[subscription] referral redeem failed:', err);
  }
}
