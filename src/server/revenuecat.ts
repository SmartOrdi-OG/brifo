/** App Store subscriptions, as RevenueCat reports them.
 *
 * The iOS app sells the subscription through Apple In-App Purchase; RevenueCat
 * validates the receipts and keeps the entitlement per account. The app logs
 * in to RevenueCat with the Supabase user id (src/lib/iap.ts), so the same id
 * works here. Stripe stays the source for web subscriptions — an account is
 * subscribed when either says so.
 *
 * Needs REVENUECAT_SECRET_KEY (a project secret key, server-side only). Without
 * it, or when RevenueCat cannot be reached, this answers "not subscribed": the
 * Stripe path and the free trial keep working, and nobody gets paid access by
 * accident. */

const ENTITLEMENT_ID = 'brifo_premium';
const API = 'https://api.revenuecat.com/v1/subscribers/';

export interface AppStoreEntitlement {
  active: boolean;
  /** ISO date the current period ends, null for a lifetime grant or unknown. */
  expiresAt: string | null;
}

interface SubscriberResponse {
  subscriber?: {
    entitlements?: Record<string, { expires_date?: string | null } | undefined>;
  };
}

/** Pure part, separated so it can be tested without the network. */
export function entitlementFromSubscriber(body: SubscriberResponse, now = Date.now()): AppStoreEntitlement {
  const ent = body.subscriber?.entitlements?.[ENTITLEMENT_ID];
  if (!ent) return { active: false, expiresAt: null };
  const expires = ent.expires_date ?? null;
  if (expires === null) return { active: true, expiresAt: null };
  const t = Date.parse(expires);
  return { active: Number.isFinite(t) && t > now, expiresAt: expires };
}

export async function getAppStoreEntitlement(userId: string): Promise<AppStoreEntitlement> {
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) return { active: false, expiresAt: null };
  try {
    const res = await fetch(API + encodeURIComponent(userId), {
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
    });
    // 404: RevenueCat has never seen this account, i.e. it never bought in the app.
    if (!res.ok) return { active: false, expiresAt: null };
    return entitlementFromSubscriber((await res.json()) as SubscriberResponse);
  } catch (err) {
    console.error('[revenuecat] subscriber lookup failed:', err);
    return { active: false, expiresAt: null };
  }
}
