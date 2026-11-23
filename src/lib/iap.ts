/** Apple In-App Purchase for the iOS build, through RevenueCat.
 *
 * Only the native iOS app touches this; the web, the Android TWA and Telegram
 * keep Stripe. RevenueCat is logged in with the Supabase user id, so the
 * server can look the same account up (src/server/revenuecat.ts) and unlock
 * the AI features no matter where the subscription was bought.
 *
 * VITE_REVENUECAT_IOS_KEY is RevenueCat's *public* Apple SDK key (appl_…). It
 * is meant to ship inside the app; the secret key stays on the server. */

import { INTRO_ELIGIBILITY_STATUS, Purchases, PURCHASES_ERROR_CODE, type PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { isNativeIos } from './native';

export const ENTITLEMENT_ID = 'brifo_premium';
const API_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY as string | undefined;

/** Whether in-app purchase can be offered at all in this build. */
export const iapAvailable = isNativeIos && !!API_KEY;

let configured: Promise<void> | null = null;
let currentUser: string | null = null;

/** Configures the SDK once and switches it to the signed-in account. Safe to
 * call on every session change. */
export async function iapLogIn(userId: string): Promise<void> {
  if (!iapAvailable) return;
  if (!configured) configured = Purchases.configure({ apiKey: API_KEY!, appUserID: userId });
  await configured;
  if (currentUser !== userId) {
    if (currentUser !== null) await Purchases.logIn({ appUserID: userId });
    currentUser = userId;
  }
}

export async function iapLogOut(): Promise<void> {
  if (!iapAvailable || !configured || currentUser === null) return;
  try {
    await Purchases.logOut();
  } catch {
    // Already anonymous — nothing to undo.
  }
  currentUser = null;
}

export interface MonthlyOffer {
  pkg: PurchasesPackage;
  /** Localised price from the App Store, e.g. "2,90 €". */
  price: string;
  /** Free-trial length in days when the account is still eligible, else 0. */
  trialDays: number;
}

/** Why the last loadMonthlyOffer() came back empty — shown in small print on
 * the paywall while the App Store product is being set up, so a failure can
 * be traced to RevenueCat or StoreKit without a debugger. */
export let offerDiagnostic: string | null = null;

/** The paywall can mount before SubscriptionContext has logged in to
 * RevenueCat; wait briefly for that instead of calling an unconfigured SDK. */
async function waitUntilConfigured(timeoutMs = 8000): Promise<boolean> {
  const start = Date.now();
  while (!configured && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!configured) return false;
  await configured;
  return true;
}

export async function loadMonthlyOffer(): Promise<MonthlyOffer | null> {
  offerDiagnostic = null;
  if (!iapAvailable) {
    offerDiagnostic = 'iap-unavailable';
    return null;
  }
  if (!(await waitUntilConfigured())) {
    offerDiagnostic = 'not-configured';
    return null;
  }
  let offerings;
  try {
    offerings = await Purchases.getOfferings();
  } catch (err) {
    const e = err as { code?: string | number; message?: string; underlyingErrorMessage?: string; readableErrorCode?: string };
    offerDiagnostic = ['getOfferings', e.code, e.readableErrorCode, e.message, e.underlyingErrorMessage].filter(Boolean).join(' · ');
    throw err;
  }
  const current = offerings.current;
  const pkg = current?.monthly ?? current?.availablePackages[0] ?? null;
  if (!pkg) {
    offerDiagnostic = current
      ? `offering ${current.identifier}: 0 packages from StoreKit`
      : `no current offering (${Object.keys(offerings.all ?? {}).length} offerings)`;
    return null;
  }
  const intro = pkg.product.introPrice;
  let trialDays = 0;
  if (intro && intro.price === 0) {
    const unit = intro.periodUnit.toUpperCase();
    trialDays = intro.periodNumberOfUnits * (unit === 'WEEK' ? 7 : unit === 'MONTH' ? 30 : unit === 'YEAR' ? 365 : 1);
    // Apple grants an introductory offer once per subscription group; the
    // store decides, so ask rather than promise a trial that won't apply.
    try {
      const elig = await Purchases.checkTrialOrIntroductoryPriceEligibility({ productIdentifiers: [pkg.product.identifier] });
      if (elig[pkg.product.identifier]?.status === INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_INELIGIBLE) trialDays = 0;
    } catch {
      // Unknown eligibility: keep showing the store's offer.
    }
  }
  return { pkg, price: pkg.product.priceString, trialDays };
}

export type PurchaseOutcome = 'subscribed' | 'cancelled' | 'failed';

export async function purchase(pkg: PurchasesPackage): Promise<PurchaseOutcome> {
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    return customerInfo.entitlements.active[ENTITLEMENT_ID] ? 'subscribed' : 'failed';
  } catch (err) {
    const e = err as { code?: string; userCancelled?: boolean | null };
    if (e.userCancelled || e.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return 'cancelled';
    console.error('[iap] purchase failed:', err);
    return 'failed';
  }
}

/** "Käufe wiederherstellen" — required by App Review for subscriptions. */
export async function restore(): Promise<boolean> {
  if (!iapAvailable) return false;
  try {
    await configured;
    const { customerInfo } = await Purchases.restorePurchases();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (err) {
    console.error('[iap] restore failed:', err);
    return false;
  }
}

/** Opens the App Store's own subscription management (cancel, change). */
export function manageSubscription(): void {
  window.open('https://apps.apple.com/account/subscriptions', '_blank');
}
