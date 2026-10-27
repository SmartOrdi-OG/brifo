/** "Is this deployment actually wired up?" — one answer, from the deployment
 * itself.
 *
 * Every integration Brifo depends on is configured outside the repository, in
 * Vercel's environment variables, and most of them fail *quietly*. kv.ts falls
 * back to an in-process Map when KV_REST_API_* are unset, so reminders,
 * subscription records, ratings and the error log all appear to work and are
 * silently discarded between invocations. A STRIPE_SECRET_KEY left in test
 * mode takes real card details and charges nobody. A missing VAPID key breaks
 * reminders only at the moment one was due to be sent, hours later, on a phone
 * nobody is watching.
 *
 * None of that shows up on the screen, so this reports it on demand instead:
 * what is set, what round-trips, and which Stripe mode is live. It never
 * returns a secret's value — only whether one is present, what shape it has,
 * and what the service said when asked. The checks run behind ADMIN_SECRET
 * (see api/errors.ts), because even the shape of a key is worth keeping in. */
import Stripe from 'stripe';
import { kvGet, kvSet, kvDel, kvIsLive } from './kv.js';
import { stripeMode } from './stripeKeys.js';

/** ok: nothing to do. warn: works, but not the way production wants it.
 * fail: broken or missing — something a user can hit. */
export type CheckStatus = 'ok' | 'warn' | 'fail';

export interface ConfigCheck {
  /** Stable id; the UI holds the human-readable label per language. */
  id: string;
  status: CheckStatus;
  /** Short, machine-written English: a mode, a shape, an error. Never a value. */
  detail: string;
}

const has = (name: string): boolean => !!process.env[name]?.trim();

/** Describes a secret without revealing it: enough to tell a truncated paste
 * or a swapped key from a healthy one, not enough to use. */
function shape(value: string): string {
  return `${value.length} chars`;
}

async function checkKv(): Promise<ConfigCheck> {
  if (!kvIsLive()) {
    return {
      id: 'kv',
      status: 'fail',
      detail: 'KV_REST_API_URL / KV_REST_API_TOKEN not set — storage falls back to memory and every write is lost',
    };
  }
  // A real round-trip, not just presence: the token can be present and wrong,
  // or belong to a store that was deleted, and both read as "configured".
  const probeKey = 'config-check:probe';
  try {
    const stamp = String(Date.now());
    await kvSet(probeKey, stamp, 60);
    const read = await kvGet<string>(probeKey);
    await kvDel(probeKey);
    if (read !== stamp) {
      return { id: 'kv', status: 'fail', detail: 'wrote a probe key but read back something else' };
    }
    return { id: 'kv', status: 'ok', detail: 'write and read back succeeded' };
  } catch (err) {
    return { id: 'kv', status: 'fail', detail: `request failed: ${errText(err)}` };
  }
}

async function checkSupabase(): Promise<ConfigCheck> {
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    const missing = [!url && 'VITE_SUPABASE_URL', !anonKey && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean);
    // Sign-in is the first screen: without these nobody gets into the app.
    return { id: 'supabase', status: 'fail', detail: `not set: ${missing.join(', ')}` };
  }
  try {
    // The apikey header is required: hosted Supabase puts every /auth/v1/*
    // route behind a gateway that rejects a request without one, so calling
    // this bare returns 401 on a perfectly healthy project — which it did,
    // and reported a working sign-in as broken.
    //
    // Sending the anon key makes each outcome mean something distinct: 200 is
    // healthy, 401 now really is a rejected key, and a connection error is a
    // wrong URL. The key is public by design — it ships in the client bundle
    // — so this reveals nothing the app does not already hand every visitor.
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      headers: { apikey: anonKey },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 401) {
      return { id: 'supabase', status: 'fail', detail: 'project is up but rejected VITE_SUPABASE_ANON_KEY' };
    }
    if (!res.ok) {
      return { id: 'supabase', status: 'fail', detail: `auth health returned ${res.status}` };
    }
    return { id: 'supabase', status: 'ok', detail: 'auth service reachable, anon key accepted' };
  } catch (err) {
    // Never reached the project at all: a typo in the URL, or a paused or
    // deleted project.
    return { id: 'supabase', status: 'fail', detail: `unreachable: ${errText(err)}` };
  }
}

/** A P-256 public key is 65 bytes and a private key 32, base64url-encoded to
 * 87-88 and 43-44 characters. web-push only validates them when it sends,
 * which is hours after anyone could have noticed a truncated paste. */
function checkVapid(): ConfigCheck {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim();

  const missing = [
    !publicKey && 'VAPID_PUBLIC_KEY',
    !privateKey && 'VAPID_PRIVATE_KEY',
    !subject && 'VAPID_SUBJECT',
  ].filter(Boolean);
  if (missing.length > 0) {
    return { id: 'vapid', status: 'fail', detail: `not set: ${missing.join(', ')}` };
  }

  const problems: string[] = [];
  if (publicKey!.length < 87 || publicKey!.length > 88) {
    problems.push(`public key is ${publicKey!.length} chars, expected 87-88`);
  }
  if (privateKey!.length < 43 || privateKey!.length > 44) {
    problems.push(`private key is ${privateKey!.length} chars, expected 43-44`);
  }
  // web-push rejects a subject that is neither a mailto: nor an https: URL.
  if (!/^(mailto:|https:\/\/)/.test(subject!)) {
    problems.push('subject must start with mailto: or https://');
  }
  if (problems.length > 0) {
    return { id: 'vapid', status: 'fail', detail: problems.join('; ') };
  }
  return { id: 'vapid', status: 'ok', detail: 'all three set, key lengths correct' };
}

async function checkStripe(): Promise<ConfigCheck[]> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return [
      { id: 'stripe_key', status: 'fail', detail: 'STRIPE_SECRET_KEY not set — nobody can subscribe' },
      { id: 'stripe_webhook', status: 'fail', detail: 'no Stripe key to verify against' },
    ];
  }

  const mode = stripeMode();
  const checks: ConfigCheck[] = [];

  // Test mode is the one that looks fine and takes no money: a card number
  // typed into a test checkout is accepted and charged nothing.
  if (mode === 'test') {
    checks.push({
      id: 'stripe_key',
      status: 'warn',
      detail: 'key is in TEST mode — real cards will not be charged',
    });
  } else {
    try {
      // One cheap authenticated call. It proves the key works and, because
      // Stripe ids are mode-scoped, that it works in live mode.
      await new Stripe(key).prices.list({ limit: 1 });
      checks.push({ id: 'stripe_key', status: 'ok', detail: 'live mode, key authenticates' });
    } catch (err) {
      checks.push({ id: 'stripe_key', status: 'fail', detail: `live key rejected: ${errText(err)}` });
    }
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    // The failure this guards against is the worst one in the app: a paid
    // subscriber whose webhook never arrives stays locked out.
    checks.push({
      id: 'stripe_webhook',
      status: 'fail',
      detail: 'STRIPE_WEBHOOK_SECRET not set — paid subscriptions will not be recorded',
    });
  } else if (!webhookSecret.startsWith('whsec_')) {
    checks.push({
      id: 'stripe_webhook',
      status: 'fail',
      detail: 'does not start with whsec_ — this is not a webhook signing secret',
    });
  } else {
    checks.push({ id: 'stripe_webhook', status: 'ok', detail: `set, ${shape(webhookSecret)}` });
  }

  return checks;
}

function checkTelegram(): ConfigCheck {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!token && !secret) {
    // Optional surface: Brifo works without the bot.
    return { id: 'telegram', status: 'warn', detail: 'not configured — the Telegram bot is off' };
  }
  const missing = [!token && 'TELEGRAM_BOT_TOKEN', !secret && 'TELEGRAM_WEBHOOK_SECRET'].filter(Boolean);
  if (missing.length > 0) {
    return { id: 'telegram', status: 'fail', detail: `half configured, not set: ${missing.join(', ')}` };
  }
  return { id: 'telegram', status: 'ok', detail: 'bot token and webhook secret both set' };
}

function errText(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  // Stripe and fetch both put the key or URL in some error messages.
  return message.replace(/\b(sk|rk|whsec|pk)_[A-Za-z0-9_]+/g, '[redacted]').slice(0, 200);
}

/** Runs every check. The independent ones run together: this is one admin
 * request, and three sequential network round-trips make it feel broken. */
export async function checkConfig(): Promise<ConfigCheck[]> {
  const [kv, supabase, stripe] = await Promise.all([checkKv(), checkSupabase(), checkStripe()]);

  const anthropic: ConfigCheck = has('ANTHROPIC_API_KEY')
    ? // Deliberately not called: every call costs money, and a key that is
      // present but revoked surfaces in the error log the first time a letter
      // is scanned.
      { id: 'anthropic', status: 'ok', detail: 'set (not called — a test call costs credit)' }
    : { id: 'anthropic', status: 'fail', detail: 'ANTHROPIC_API_KEY not set — scanning a letter will fail' };

  // Without it the delete-account button deletes the data and leaves the
  // login behind — a half-deletion the person is told about but did not ask
  // for, and short of what Google Play requires from an app that creates
  // accounts. It fails silently in the sense that matters: the button works.
  const accountDeletion: ConfigCheck = has('SUPABASE_SERVICE_ROLE_KEY')
    ? { id: 'account_deletion', status: 'ok', detail: 'set — deleting an account removes the login too' }
    : {
        id: 'account_deletion',
        status: 'fail',
        detail: 'SUPABASE_SERVICE_ROLE_KEY not set — "delete account" erases the data but leaves the login',
      };

  const cron: ConfigCheck = has('CRON_SECRET')
    ? { id: 'cron', status: 'ok', detail: 'set' }
    : {
        id: 'cron',
        status: 'fail',
        detail: 'CRON_SECRET not set — the daily reminder run cannot authenticate',
      };

  return [
    ...stripe,
    kv,
    supabase,
    anthropic,
    checkVapid(),
    accountDeletion,
    cron,
    checkTelegram(),
    {
      id: 'version',
      status: 'ok',
      detail: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'unknown (not a Vercel build)',
    },
  ];
}
