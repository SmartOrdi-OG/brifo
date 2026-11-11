/** Keeping the error log readable.
 *
 * Every stack below is copied verbatim out of the production log, because the
 * question these rules answer is not hypothetical: 128 of the 179 reports in
 * it were one non-fault, and the single genuine crash sat underneath them.
 */
import { describe, it, expect } from 'vitest';
import {
  isFromOurCode,
  isServiceWorkerRegistrationFailure,
  isWorthReporting,
} from '../src/lib/errorRelevance';

/** Googlebot's renderer (note `wrsParams` — Google's Web Rendering Service)
 * refusing the service worker. 128 reports over two weeks, every one with
 * lang: null, on the three pages Google crawls. */
const GOOGLEBOT_SW =
  'Error: Rejected\n' +
  '    at wrsParams.serviceWorkers.navigator.serviceWorker.register (<anonymous>:12:648)\n' +
  '    at https://mybrifo.com/registerSW.js:1:98';

/** The same non-fault from a browser that blocks service workers outright. */
const BLOCKED_SW =
  'Error: Rejected\n' +
  '    at ServiceWorkerContainer.<anonymous> (<anonymous>:669:449)\n' +
  '    at ServiceWorkerContainer.register (<anonymous>:463:195)\n' +
  '    at https://mybrifo.com/registerSW.js:1:98';

/** The injected script that recursed on /datenschutz. Its frames name the
 * document at lines the document does not have; ours never look like this. */
const INJECTED_RECURSION =
  '@https://mybrifo.com/datenschutz:192:249\n' +
  '@https://mybrifo.com/datenschutz:195:39\n' +
  'Bk@https://mybrifo.com/:231:392\n' +
  'zk@https://mybrifo.com/:231:70\n' +
  'Bk@https://mybrifo.com/:231:418\n' +
  'zk@https://mybrifo.com/:231:70';

/** The real crash — a payment with no dueDate taking the home screen out.
 * This is the one the log exists for, and it must always get through. */
const REAL_CRASH =
  '@https://mybrifo.com/assets/index-DpIAoccE.js:23:538\n' +
  'filter@[native code]\n' +
  'Q@https://mybrifo.com/assets/index-DpIAoccE.js:23:516\n' +
  'Eo@https://mybrifo.com/assets/index-DpIAoccE.js:8:47526';

describe('the service worker being refused is not a fault', () => {
  it("drops Googlebot's daily report", () => {
    expect(isServiceWorkerRegistrationFailure('unhandledrejection: Error: Rejected', GOOGLEBOT_SW)).toBe(true);
    expect(isWorthReporting('unhandledrejection: Error: Rejected', GOOGLEBOT_SW)).toBe(false);
  });

  it('drops it from a browser that blocks service workers', () => {
    expect(isWorthReporting('unhandledrejection: Error: Rejected', BLOCKED_SW)).toBe(false);
  });

  it('drops it when only the message says so, whatever the engine called it', () => {
    // Safari words this one differently and gives no useful stack.
    const message =
      'unhandledrejection: SecurityError: Failed to register a ServiceWorker: The provided script failed to load.';
    expect(isWorthReporting(message, null)).toBe(false);
  });
});

describe("somebody else's script is not our fault", () => {
  it('drops the recursion injected into the privacy page', () => {
    expect(isFromOurCode(INJECTED_RECURSION)).toBe(false);
    expect(isWorthReporting('window.onerror: RangeError: Maximum call stack size exceeded.', INJECTED_RECURSION)).toBe(
      false,
    );
  });

  it('drops a throw from a third-party host', () => {
    expect(isFromOurCode('at thing (https://plugin.example.com/inject.js:4:11)')).toBe(false);
  });
});

describe('what must always get through', () => {
  it('keeps the crash the log exists for', () => {
    expect(isFromOurCode(REAL_CRASH)).toBe(true);
    expect(isWorthReporting("window.onerror: TypeError: null is not an object (evaluating 'e.dueDate.startsWith')", REAL_CRASH)).toBe(
      true,
    );
  });

  it('keeps a fault with no stack at all', () => {
    // Cross-origin errors arrive as a bare "Script error." with nothing on
    // them. We cannot place it, so we do not get to dismiss it.
    expect(isFromOurCode(null)).toBe(true);
    expect(isFromOurCode(undefined)).toBe(true);
    expect(isWorthReporting('window.onerror: Script error.', null)).toBe(true);
  });

  it('keeps a stack whose frames are all anonymous or native', () => {
    expect(isFromOurCode('TypeError: x is not a function\n    at <anonymous>\n    at Array.map (<anonymous>)')).toBe(
      true,
    );
  });

  it('keeps our service worker failing at something other than registration', () => {
    // A fault inside sw.ts is ours and is worth hearing about; only the
    // register() call is excused.
    const stack = 'Error: boom\n    at https://mybrifo.com/sw.js:40:12';
    expect(isServiceWorkerRegistrationFailure('Error: boom', stack)).toBe(false);
    expect(isWorthReporting('Error: boom', stack)).toBe(true);
  });

  it('keeps a fault in the dev server bundle', () => {
    expect(isFromOurCode('at Home (http://localhost:5173/src/screens/Home.tsx:31:9)')).toBe(true);
  });

  it('keeps a React error whose message is itself a component stack', () => {
    // How the error boundary reports on Safari: no message, stack only.
    expect(isWorthReporting(REAL_CRASH, REAL_CRASH)).toBe(true);
  });
});
