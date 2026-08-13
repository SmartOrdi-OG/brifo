import type { ReactNode } from 'react';
import { Paywall } from '../screens/Paywall';
import { useSubscription } from '../context/SubscriptionContext';

/** Gates the AI-powered features (letter scanning, reply drafting) behind an
 * active subscription or a still-running trial — the rest of the app (guide,
 * calendar, todos, family profiles, viewing already-scanned letters) stays
 * free even after the trial ends, since scanning and reply-drafting are the
 * only features with a real per-use cost (Anthropic API calls). */
export function PremiumGate({ children }: { children: ReactNode }) {
  const { loading, active, trialExpired } = useSubscription();
  if (loading) return null;
  if (!active && trialExpired) return <Paywall />;
  return <>{children}</>;
}
