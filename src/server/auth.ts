/** Verifies a Supabase access token server-side by asking Supabase's own
 * Auth API to resolve it — avoids needing the JWT signing secret here, just
 * the same public URL + anon key the client already uses. */
export interface AuthedUser {
  id: string;
  email: string | null;
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
    const data = (await res.json()) as { id?: string; email?: string };
    if (!data.id) return null;
    return { id: data.id, email: data.email ?? null };
  } catch {
    return null;
  }
}
