/** Invite-a-friend: capturing the inviter's code from a shared link survives
 * across the whole sign-up flow (privacy consent, email, code entry, set
 * password) by living in localStorage rather than component state. */
const STORAGE_KEY = 'brifo_referral_code';

/** Display-only copy of src/server/referral.ts's REFERRAL_BONUS_DAYS — kept
 * separate (rather than imported) so this client bundle never pulls in the
 * server module's KV dependency. Keep the two numbers in sync by hand. */
export const REFERRAL_BONUS_DAYS = 7;

/** Call once on app boot. If the URL carries ?ref=<code> and none is stashed
 * yet, stash it — first-touch wins, so opening the app again later (without
 * the param) doesn't erase an already-captured invite. */
export function captureReferralCodeFromUrl(): void {
  const code = new URLSearchParams(window.location.search).get('ref');
  if (code && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, code);
  }
}

export function getStashedReferralCode(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearStashedReferralCode(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** A referral "code" is just the inviting account's own user id — no
 * separate code-generation/lookup table needed, since redeemReferral
 * resolves it directly. */
export function referralLinkFor(userId: string): string {
  return `${window.location.origin}/?ref=${userId}`;
}
