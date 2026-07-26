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
  /** Re-fetches status — call after returning from Stripe Checkout. */
  refresh: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!session) {
      setActive(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchSubscriptionStatus().then((status) => {
      if (cancelled) return;
      setActive(status?.active ?? false);
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
        trialExpired: createdAt ? isTrialExpired(createdAt) : false,
        trialDaysLeft: createdAt ? trialDaysLeft(createdAt) : 0,
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
