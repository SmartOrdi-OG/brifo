/** Minimal Redis client over the Upstash/Vercel KV REST API (path-style command
 * execution: POST {KV_REST_API_URL}/{cmd}/{arg1}/{arg2}...). Falls back to an
 * in-process Map when no KV env vars are configured, so `npm run dev` and the
 * type-checker work without provisioning a real database — production
 * (Vercel) must set KV_REST_API_URL / KV_REST_API_TOKEN for reminders to
 * survive across serverless invocations. */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function restCommand<T>(parts: (string | number)[]): Promise<T> {
  const url = `${KV_URL}/${parts.map((p) => encodeURIComponent(String(p))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
  if (!res.ok) throw new Error(`KV request failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { result: T };
  return data.result;
}

const memStrings = new Map<string, { value: string; expiresAt?: number }>();
const memSets = new Map<string, Set<string>>();

function memGet(key: string): string | null {
  const entry = memStrings.get(key);
  if (!entry) return null;
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    memStrings.delete(key);
    return null;
  }
  return entry.value;
}

function hasKv(): boolean {
  return !!KV_URL && !!KV_TOKEN;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const raw = hasKv() ? await restCommand<string | null>(['get', key]) : memGet(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function kvSet(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  const raw = JSON.stringify(value);
  if (hasKv()) {
    await restCommand(ttlSeconds ? ['set', key, raw, 'EX', ttlSeconds] : ['set', key, raw]);
    return;
  }
  memStrings.set(key, { value: raw, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
}

export async function kvDel(key: string): Promise<void> {
  if (hasKv()) {
    await restCommand(['del', key]);
    return;
  }
  memStrings.delete(key);
}

export async function kvSadd(setKey: string, member: string): Promise<void> {
  if (hasKv()) {
    await restCommand(['sadd', setKey, member]);
    return;
  }
  if (!memSets.has(setKey)) memSets.set(setKey, new Set());
  memSets.get(setKey)!.add(member);
}

export async function kvSrem(setKey: string, member: string): Promise<void> {
  if (hasKv()) {
    await restCommand(['srem', setKey, member]);
    return;
  }
  memSets.get(setKey)?.delete(member);
}

export async function kvSmembers(setKey: string): Promise<string[]> {
  if (hasKv()) {
    return restCommand<string[]>(['smembers', setKey]);
  }
  return [...(memSets.get(setKey) ?? [])];
}

/** "Have we already sent this exact reminder before?" — a short-lived
 * dedupe marker so overlapping/retried cron runs never double-notify. */
export async function kvMarkSentOnce(key: string, ttlSeconds: number): Promise<boolean> {
  if (hasKv()) {
    const result = await restCommand<string | null>(['set', key, '1', 'EX', ttlSeconds, 'NX']);
    return result === 'OK';
  }
  if (memGet(key) !== null) return false;
  memStrings.set(key, { value: '1', expiresAt: Date.now() + ttlSeconds * 1000 });
  return true;
}

/** Atomically increments a counter and returns its new value, setting the TTL
 * on the first increment so the window expires on its own.
 *
 * Atomic on purpose: this backs the per-user rate limit, and a read-modify-
 * write would let a burst of parallel requests all read the same low count and
 * sail past the ceiling together — which is exactly the shape of the abuse it
 * exists to stop. */
export async function kvIncr(key: string, ttlSeconds: number): Promise<number> {
  if (hasKv()) {
    const count = await restCommand<number>(['incr', key]);
    if (count === 1) await restCommand(['expire', key, ttlSeconds]);
    return count;
  }
  const current = Number(memGet(key) ?? 0) + 1;
  memStrings.set(key, { value: String(current), expiresAt: Date.now() + ttlSeconds * 1000 });
  return current;
}
