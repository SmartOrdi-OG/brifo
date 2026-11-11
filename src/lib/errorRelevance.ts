/** Which faults are worth reporting, and which are somebody else's.
 *
 * The error log exists so a fault that hits a parent reaches us without her
 * having to give up and mention it. That only works while the log is readable.
 * When this was written, 128 of the 179 reports in it — 72% — were a single
 * non-fault: Googlebot's renderer failing to register the service worker,
 * every day, on each of the three public pages it crawls. Every one carried
 * `lang: null`, i.e. nobody who had ever opened the app. The one genuine crash
 * in there was two entries below them.
 *
 * A log nobody can read is the same as no log, so the next real fault would
 * have hidden in that pile. Hence the two rules here. Both are deliberately
 * narrow: the cost of dropping one real fault is far higher than the cost of
 * keeping some noise, so anything uncertain is kept.
 *
 * Kept separate from reportError.ts, and free of any browser API, so the rules
 * can be tested directly rather than through a mocked window.
 */

/** A frame from code we actually shipped.
 *
 * Our bundle is served from /assets/, and the service worker from /sw.js, so
 * our own frames always name one of those files. An inline script injected
 * into the page by an extension, a crawler's renderer or an in-app browser is
 * attributed to the *document* URL instead ("https://mybrifo.com/datenschutz:
 * 192:249"), which is why the document itself is not on this list. Our own
 * inline scripts in index.html share that attribution, but they are two small
 * try/catch wrappers that read localStorage — they have nothing to throw.
 *
 * `/src/` covers the dev server, where modules are served unbundled. */
const OWN_SCRIPT = /\/(assets|src)\/|\/sw\.js|\/registerSW\.js/;

/** URLs appearing anywhere in a stack, in any engine's format — V8 writes
 * "at fn (url:1:2)", JavaScriptCore writes "fn@url:1:2". */
function stackUrls(stack: string): string[] {
  return stack.match(/\bhttps?:\/\/[^\s)'"]+/g) ?? [];
}

/** Did this come from our own code?
 *
 * Only answers no when the stack names scripts and none of them is ours — that
 * is, when some other script on the page threw. An error with no stack, or one
 * whose frames are all anonymous or native, is kept: we cannot tell, and a
 * fault we cannot place is still a fault.
 *
 * What this caught: `RangeError: Maximum call stack size exceeded` on
 * /datenschutz, a mutual recursion between two functions in a script injected
 * into the page. The page it ran on is 116 elements deep by 7 and contains no
 * recursion of ours; the frames pointed at the document, at lines the document
 * does not have. Not our code, not ours to fix, and it never touched the app —
 * which carried on running, because the throw was not in a render. */
export function isFromOurCode(stack: string | null | undefined): boolean {
  if (!stack) return true;
  const urls = stackUrls(stack);
  if (urls.length === 0) return true;
  return urls.some((url) => OWN_SCRIPT.test(url));
}

/** Is this just the service worker being refused?
 *
 * Browsers refuse `serviceWorker.register` in more ordinary situations than
 * one expects: Googlebot's renderer disables service workers outright, and so
 * do private windows, blocked site data, insecure contexts and a number of
 * in-app browsers. In every one of them the app itself works — the only thing
 * lost is offline caching, which no parent reading a letter notices.
 *
 * So this is a fact about the visitor's browser, not a fault in Brifo, and it
 * does not belong in a log meant for faults. Matched on the registration call
 * in the stack rather than on the message, because the message is only ever
 * the browser's own wording ("Error: Rejected", "SecurityError: Failed to
 * register a ServiceWorker: ...") and differs per engine and per locale. */
export function isServiceWorkerRegistrationFailure(message: string, stack: string | null | undefined): boolean {
  const text = `${message}\n${stack ?? ''}`;
  return /serviceWorker\s*\.\s*register|registerSW\.js|register a ServiceWorker|ServiceWorkerContainer/i.test(text);
}

/** The one decision reportError.ts asks for. */
export function isWorthReporting(message: string, stack: string | null | undefined): boolean {
  if (isServiceWorkerRegistrationFailure(message, stack)) return false;
  return isFromOurCode(stack);
}
