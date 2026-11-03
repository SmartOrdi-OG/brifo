/** Keeping one account's data on this device away from the next account.
 *
 * Everything the app stores locally (brifo_data and the consent records) used
 * to belong to "whoever is signed in". Sign out, sign in as someone else on the
 * same phone, and DataContext read the first person's letters from storage,
 * merged them with the second person's cloud copy and synced the result up —
 * so the second account showed, and kept, the first person's data.
 *
 * Now the device remembers whose data it holds (OWNER_KEY). On sign-in:
 * - same account   → nothing changes;
 * - no owner yet   → the signed-in account takes it (devices from before this
 *                    change, and fresh installs, where the data is theirs);
 * - another account → the previous account's data is removed from this device
 *                    before anything can be shown or synced, and the app
 *                    reloads so no screen keeps it in memory.
 * Signing out removes it as well. Nothing on the server is touched: each
 * account's cloud copy stays where it is and comes back on its next sign-in. */

export const OWNER_KEY = 'brifo_data_owner';

/** The keys that belong to one account. Device settings (language, theme,
 * form of address, the push device id) stay: they are the device's, not the
 * person's. */
export const PER_ACCOUNT_KEYS = [
  'brifo_data',
  'brifo_privacy_consent',
  'brifo_privacy_consent_synced',
  'brifo_sensitive_consent',
  'brifo_reminders_notified',
] as const;

type KeyStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type ClaimResult = 'same' | 'adopted' | 'switched';

function defaultStore(): KeyStore | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** Removes the previous account's data from this device. */
export function clearAccountData(store: KeyStore | null = defaultStore()): void {
  if (!store) return;
  for (const key of PER_ACCOUNT_KEYS) store.removeItem(key);
  store.removeItem(OWNER_KEY);
}

/** Called with the signed-in user's id before the session reaches the rest of
 * the app. On 'switched' the caller must reload instead of using the session. */
export function claimDeviceData(userId: string, store: KeyStore | null = defaultStore()): ClaimResult {
  if (!store) return 'same';
  const owner = store.getItem(OWNER_KEY);
  if (owner === userId) return 'same';
  if (owner === null) {
    store.setItem(OWNER_KEY, userId);
    return 'adopted';
  }
  clearAccountData(store);
  store.setItem(OWNER_KEY, userId);
  return 'switched';
}
