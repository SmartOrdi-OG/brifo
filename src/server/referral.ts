/** Invite-a-friend: both sides get extra trial days once the invited friend
 * creates an account — no Stripe involvement, so nothing here ever touches
 * real billing. Kept dependency-free of src/lib (client code), same reason
 * as push.ts (see errors.ts). */
import { kvGet, kvSet } from './kv.js';

// Also copied (display-only) in src/lib/referral.ts — keep both in sync.
export const REFERRAL_BONUS_DAYS = 7;
const MAX_BONUS_DAYS = 90;

const bonusKey = (userId: string) => `referral:bonus:${userId}`;
const redeemedKey = (userId: string) => `referral:redeemed:${userId}`;

export async function getBonusTrialDays(userId: string): Promise<number> {
  return (await kvGet<number>(bonusKey(userId))) ?? 0;
}

async function addBonusDays(userId: string, days: number): Promise<void> {
  const current = await getBonusTrialDays(userId);
  await kvSet(bonusKey(userId), Math.min(MAX_BONUS_DAYS, current + days));
}

/** Idempotent — a given account can only ever trigger the reward once, no
 * matter how many times this is called (retried request, replayed code, a
 * referral link opened again after already signing up). */
export async function redeemReferral(newUserId: string, referrerId: string): Promise<{ redeemed: boolean }> {
  if (!referrerId || referrerId === newUserId) return { redeemed: false };
  if (await kvGet<boolean>(redeemedKey(newUserId))) return { redeemed: false };

  await kvSet(redeemedKey(newUserId), true);
  await Promise.all([addBonusDays(newUserId, REFERRAL_BONUS_DAYS), addBonusDays(referrerId, REFERRAL_BONUS_DAYS)]);
  return { redeemed: true };
}
