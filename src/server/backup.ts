/** Cloud copy of a signed-in user's app data, keyed by their Supabase
 * account id — this is what lets the same data follow the user across
 * devices, since the account (not anything stored on a single device) is
 * now the durable identity. Kept dependency-free of src/lib (client code)
 * for the same cold-start reason push.ts avoids it — see errors.ts. */
import { kvGet, kvSet } from './kv.js';

const backupKey = (userId: string) => `cloudbackup:${userId}`;

export interface CloudBackupPayload {
  updatedAt: string;
  data: unknown;
}

export async function saveCloudBackup(userId: string, data: unknown): Promise<void> {
  await kvSet(backupKey(userId), { updatedAt: new Date().toISOString(), data } satisfies CloudBackupPayload);
}

export async function loadCloudBackup(userId: string): Promise<CloudBackupPayload | null> {
  return kvGet<CloudBackupPayload>(backupKey(userId));
}
