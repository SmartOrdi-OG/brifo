/** The server-side half of the paywall.
 *
 * PremiumGate (src/components/PremiumGate.tsx) hides the scan and reply
 * screens from anyone whose trial has run out, and that is all it does: it is
 * a React component, so it governs what the app shows, not what the server
 * accepts. /api/analyze and /api/reply took anyone's POST — no account, no
 * subscription, no ceiling — and each one spends real money at Anthropic.
 * Someone with the URL and a loop could run up the bill without ever opening
 * the app, and nobody paying 2.90 EUR a month was getting anything the open
 * endpoint did not already give away.
 *
 * So the same two questions the UI asks are asked again here, where the
 * answer actually binds: who are you, and are you entitled? Plus a ceiling,
 * because a signed-in account is still an account someone can script.
 *
 * Deliberately dependency-free apart from kv/auth: this runs before every
 * scan, and the subscription read goes through stripeKeys.ts rather than
 * stripe.ts so it costs one KV lookup instead of loading a payment library. */

import { getUserFromRequest, type AuthedUser } from './auth.js';
import { kvGet, kvIncr } from './kv.js';
import { isComplimentaryEmail } from './freeAccounts.js';
import { getBonusTrialDays } from './referral.js';
import { subscriptionKey, isActiveStatus, type StoredSubscription } from './stripeKeys.js';

/** Must match TRIAL_DAYS in src/lib/trial.ts. Repeated rather than imported
 * because that file is browser-side ESM and this tree compiles as CommonJS;
 * changing one means changing the other. A mismatch would show as the app
 * offering a scan the server then refuses. */
const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Per-account daily ceiling, counted per feature.
 *
 * Not a price — the paywall is the price. This is the backstop for a
 * subscribed account being scripted, and for the trial week being farmed. A
 * parent working through a stack of post does perhaps ten letters in a day;
 * thirty leaves room for a heavy day without leaving the budget open. */
function dailyLimit(feature: Feature): number {
  const raw = Number(process.env[feature === 'analyze' ? 'ANALYZE_DAILY_LIMIT' : 'REPLY_DAILY_LIMIT']);
  return Number.isFinite(raw) && raw > 0 ? raw : 30;
}

export type Feature = 'analyze' | 'reply';

export interface EntitlementFailure {
  status: 401 | 402 | 429;
  error: string;
}

/** Resolves to the user when they may proceed, or to the response to send. */
export type EntitlementResult = { ok: true; user: AuthedUser } | { ok: false; failure: EntitlementFailure };

interface RequestLike {
  headers: { authorization?: string | string[] };
}

function trialRemains(createdAt: string | null, bonusDays: number): boolean {
  // No created_at from Supabase (an older token shape, say) is treated as
  // still in trial: the alternative is locking out a paying-eligible user
  // over a missing field, and the daily ceiling still applies either way.
  if (!createdAt) return true;
  const started = Date.parse(createdAt);
  if (Number.isNaN(started)) return true;
  return Date.now() - started <= (TRIAL_DAYS + bonusDays) * DAY_MS;
}

/** Today's date in Vienna — the window the ceiling resets on, chosen so it
 * turns over at a time that means something to the people using the app
 * rather than at 01:00 or 02:00 local depending on the season. */
function viennaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date());
}

async function withinDailyLimit(userId: string, feature: Feature): Promise<boolean> {
  const limit = dailyLimit(feature);
  try {
    // 36h TTL, not 24: the key is created at the first call of a Vienna day
    // and must outlive that day however late the day starts.
    const used = await kvIncr(`usage:${feature}:${userId}:${viennaToday()}`, 36 * 60 * 60);
    return used <= limit;
  } catch (err) {
    // KV unreachable. Refusing here would take the app down for everyone over
    // a counter; the account is still authenticated and entitled, which is the
    // part that matters most.
    console.error(`[entitlement] usage counter unavailable, allowing ${feature}:`, err);
    return true;
  }
}

/** Checks the three things in the order that costs least: who, then whether,
 * then how often. Each failure gets its own status so the client can tell
 * "sign in again" from "subscribe" from "come back tomorrow". */
export async function checkEntitlement(req: RequestLike, feature: Feature): Promise<EntitlementResult> {
  const user = await getUserFromRequest(req);
  if (!user) return { ok: false, failure: { status: 401, error: 'not signed in' } };

  if (isComplimentaryEmail(user.email)) {
    return (await withinDailyLimit(user.id, feature))
      ? { ok: true, user }
      : { ok: false, failure: { status: 429, error: 'daily limit reached' } };
  }

  const subscription = await kvGet<StoredSubscription>(subscriptionKey(user.id));
  const subscribed = !!subscription && isActiveStatus(subscription.status);

  if (!subscribed) {
    const bonusDays = await getBonusTrialDays(user.id);
    if (!trialRemains(user.createdAt, bonusDays)) {
      return { ok: false, failure: { status: 402, error: 'subscription required' } };
    }
  }

  if (!(await withinDailyLimit(user.id, feature))) {
    return { ok: false, failure: { status: 429, error: 'daily limit reached' } };
  }
  return { ok: true, user };
}
