import { supabase } from './supabaseClient';

/** The signed-in user's bearer token, for routes that check who is calling.
 *
 * Every request that spends money or touches stored data carries this now:
 * /api/analyze and /api/reply refuse without it (see server/entitlement.ts),
 * and backup and subscription always did. One copy rather than one per caller,
 * because a route that is gated server-side and whose client forgets the
 * header fails as a flat 401 with nothing in the UI to explain it. */
export async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
