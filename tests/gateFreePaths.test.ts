/** Which screens render without the privacy-consent and sign-in gates.
 *
 * A short list where both kinds of mistake are expensive. Adding an app
 * screen makes it readable by anyone with the URL. Removing a page makes it
 * unreachable in the one situation it exists for — which is how /admin got
 * here: the screen that reports whether Supabase sign-in works was sitting
 * behind Supabase sign-in, so a broken sign-in locked the operator out of the
 * page saying sign-in was broken.
 *
 * The list is a bare array of strings, so nothing but a test can keep it
 * honest. */
import { describe, it, expect } from 'vitest';
import { GATE_FREE_PATHS } from '../src/lib/gateFreePaths';

describe('the pages that must stay reachable', () => {
  it('keeps the two Austrian legal pages open', () => {
    // There is otherwise no way to read the privacy policy before agreeing to
    // it, and the Impressum has to be reachable unconditionally.
    expect(GATE_FREE_PATHS).toContain('/datenschutz');
    expect(GATE_FREE_PATHS).toContain('/impressum');
  });

  it('keeps the AGB open, because the paywall links to it', () => {
    expect(GATE_FREE_PATHS).toContain('/agb');
  });

  it('keeps /account-deletion open, since the reader may have uninstalled the app', () => {
    // The URL Google Play's listing points at. Requiring a sign-in to reach
    // the page about deleting your account defeats the one case it exists
    // for: someone who removed the app and still wants their data gone.
    expect(GATE_FREE_PATHS).toContain('/account-deletion');
  });

  it('keeps /admin open, so a broken sign-in is still diagnosable', () => {
    // The whole point of the config check. It carries its own ADMIN_SECRET
    // prompt and every endpoint behind it verifies that secret server-side,
    // so the gate added no protection — only a dependency on the thing the
    // page is there to test.
    expect(GATE_FREE_PATHS).toContain('/admin');
  });
});

describe('the pages that must stay closed', () => {
  it('gates every screen holding a family’s data', () => {
    // These read and write children, appointments, letters and tasks. None of
    // them may ever render without a session.
    const mustBeGated = [
      '/',
      '/onboarding',
      '/scan',
      '/result',
      '/reply',
      '/calendar',
      '/todo',
      '/search',
      '/settings',
      '/child/new',
      '/paywall',
    ];
    for (const path of mustBeGated) {
      expect(GATE_FREE_PATHS, `${path} must not bypass the gates`).not.toContain(path);
    }
  });

  it('is a short list, so a careless addition shows up here', () => {
    // Not a style rule: every entry is a page any visitor can read. If this
    // number has to go up, the entry needs a reason written next to it in
    // App.tsx first.
    expect(GATE_FREE_PATHS.length).toBe(5);
  });

  it('holds exact paths, since the check is an equality match', () => {
    // bypassesGate compares location.pathname against this list, so a
    // trailing slash, a wildcard or a query string here silently never
    // matches — the page would be gated while looking exempt.
    for (const path of GATE_FREE_PATHS) {
      expect(path, `${path} should start with a single slash`).toMatch(/^\/[a-z-]*$/);
    }
  });
});
