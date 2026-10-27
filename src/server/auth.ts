/** Verifies a Supabase access token server-side by asking Supabase's own
 * Auth API to resolve it — avoids needing the JWT signing secret here, just
 * the same public URL + anon key the client already uses. */
export interface AuthedUser {
  id: string;
  email: string | null;
  /** When the account was created, as Supabase reports it. The trial is
   * measured from here, so taking it from the verified token response rather
   * than from anything the client sends is what stops a trial being reset by
   * editing a request. */
  createdAt: string | null;
}

interface RequestLike {
  headers: { authorization?: string | string[] };
}

export async function getUserFromRequest(req: RequestLike): Promise<AuthedUser | null> {
  const header = req.headers.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith('Bearer ')) return null;
  const token = value.slice('Bearer '.length);

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string; email?: string; created_at?: string };
    if (!data.id) return null;
    return { id: data.id, email: data.email ?? null, createdAt: data.created_at ?? null };
  } catch {
    return null;
  }
}

/** True when the server can delete Supabase logins (account erasure). */
export function canDeleteAuthUsers(): boolean {
  return !!process.env.VITE_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** Deletes the Supabase login itself (email, password hash, sessions, user
 * metadata) through the Auth admin API. Needs SUPABASE_SERVICE_ROLE_KEY,
 * which bypasses every RLS rule — server-only, never VITE_-prefixed, never
 * logged. A 404 counts as done: a retry after a half-finished erasure must
 * not fail on the part that already worked. */
export async function deleteAuthUser(userId: string): Promise<void> {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  const res = await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
  });
  if (!res.ok && res.status !== 404) throw new Error(`Supabase admin delete failed: ${res.status}`);
}
