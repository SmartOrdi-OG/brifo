/** Cloud copy of the signed-in user's app data — keyed by their Supabase
 * account (see server/backup.ts), so signing in on any device is what
 * recovers the data, with nothing device-local to lose or write down. */
import { normalizeState, type RestorableState } from './backup';
import { supabase } from './supabaseClient';

async function authHeader(): Promise<Record<string, string> | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export async function syncToCloud(state: RestorableState): Promise<void> {
  const headers = await authHeader();
  if (!headers) return;
  try {
    await fetch('/api/backup-sync', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ data: state }),
    });
  } catch (err) {
    console.error('[cloudBackup] sync failed:', err);
  }
}

/** Pulls this account's cloud copy — used to periodically catch up on edits
 * made from another device signed into the same account (see DataContext's
 * pull-and-merge effect). */
export async function fetchCloudBackup(): Promise<RestorableState | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch('/api/backup-restore', { method: 'POST', headers });
    if (!res.ok) return null;
    const payload = (await res.json()) as { data?: Record<string, unknown> };
    if (!payload.data) return null;
    return normalizeState(payload.data);
  } catch (err) {
    console.error('[cloudBackup] fetch failed:', err);
    return null;
  }
}
