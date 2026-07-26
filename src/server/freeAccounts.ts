/** Emails that skip the trial/subscription gate entirely — for the app
 * owner's own accounts, not a general-purpose comp mechanism. */
export function isComplimentaryEmail(email: string | null): boolean {
  if (!email) return false;
  const list = (process.env.FREE_ACCOUNT_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
