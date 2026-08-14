const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isTrialExpired(accountCreatedAt: string, bonusDays = 0): boolean {
  return Date.now() - new Date(accountCreatedAt).getTime() > (TRIAL_DAYS + bonusDays) * DAY_MS;
}

export function trialDaysLeft(accountCreatedAt: string, bonusDays = 0): number {
  const elapsedDays = (Date.now() - new Date(accountCreatedAt).getTime()) / DAY_MS;
  return Math.max(0, Math.ceil(TRIAL_DAYS + bonusDays - elapsedDays));
}
