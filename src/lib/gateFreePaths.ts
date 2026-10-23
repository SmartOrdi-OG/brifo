/** The paths that render without the privacy-consent and sign-in gates.
 *
 * Four entries, each for a stated reason, and both kinds of mistake are
 * expensive: an app screen added here is readable by anyone with the URL, and
 * a page removed from here becomes unreachable in the case it exists for.
 *
 * - /datenschutz, /impressum: there is otherwise no way to read the privacy
 *   policy before agreeing to it, and Austrian law wants the Impressum
 *   reachable unconditionally.
 * - /agb: the paywall links there for the withdrawal-rights terms, which a
 *   user has to be able to read before paying.
 * - /admin: it is the screen that reports whether this deployment is wired
 *   up, Supabase sign-in included. Behind the auth gate it was unreachable in
 *   exactly the case it exists to diagnose — a broken sign-in locked the
 *   operator out of the page saying sign-in was broken. It carries its own
 *   ADMIN_SECRET prompt and every endpoint behind it verifies that secret
 *   server-side, so the gate added no protection, only a dependency on the
 *   thing under test.
 *
 * In its own module rather than in App.tsx so that file exports only its
 * component, and so tests/gateFreePaths.test.ts can pin the list — it is a
 * bare array of strings, and nothing else would keep it honest.
 */
export const GATE_FREE_PATHS = ['/datenschutz', '/impressum', '/agb', '/admin'];
