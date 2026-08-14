import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchSubscriptionStatus } from '../lib/subscription';
import { isTrialExpired, trialDaysLeft } from '../lib/trial';

interface SubscriptionContextValue {
  /** True while the first status fetch for the current session is in flight. */
  loading: boolean;
  active: boolean;
  trialExpired: boolean;
  trialDaysLeft: number;
  /** Bonus days earned from invite-a-friend, already folded into trialDaysLeft/trialExpired above — exposed separately so Settings can show it. */
  bonusTrialDays: number;
  /** Re-fetches status — call after returning from Stripe Checkout. */
  refresh: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [active, setActive] = useState(false);
  const [bonusDays, setBonusDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!session) {
      setActive(false);
      setBonusDays(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchSubscriptionStatus().then((status) => {
      if (cancelled) return;
      setActive(status?.active ?? false);
      setBonusDays(status?.bonusTrialDays ?? 0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [session, refreshKey]);

  const createdAt = session?.user.created_at;

  return (
    <SubscriptionContext.Provider
      value={{
        loading,
        active,
        trialExpired: createdAt ? isTrialExpired(createdAt, bonusDays) : false,
        trialDaysLeft: createdAt ? trialDaysLeft(createdAt, bonusDays) : 0,
        bonusTrialDays: bonusDays,
        refresh: () => setRefreshKey((k) => k + 1),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
