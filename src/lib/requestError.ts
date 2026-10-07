import type { TranslationKey } from '../context/translations';

/** Why a request to our own API didn't produce an answer.
 *
 * The distinction that matters isn't technical, it's what the reader should
 * do next: wait for signal, wait a minute, retake the photo, or just retry.
 * A single "something went wrong, try again" told someone with no signal to
 * do the one thing that cannot work, which is how an app earns a reputation
 * for being broken. */
export type RequestErrorKind = 'offline' | 'connection' | 'busy' | 'limit' | 'unreadable' | 'generic';

/** Cheap pre-flight check. `false` here is definitive — the browser knows it
 * has no network — so there's no point compressing an image and firing a
 * request that cannot arrive. `true` promises nothing: the phone may hold a
 * WiFi association that routes nowhere, which is what `connection` covers
 * after the attempt fails. */
export function isDefinitelyOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/**
 * @param status HTTP status if a response came back at all; `undefined` when
 *   fetch itself rejected, meaning nothing reached the server.
 */
export function classifyRequestError(status?: number): RequestErrorKind {
  if (isDefinitelyOffline()) return 'offline';
  if (status === undefined) return 'connection';
  // 429 now has one meaning on these routes: the per-account daily ceiling in
  // server/entitlement.ts, checked before anything upstream is called. It is
  // not "try again in a minute" — the answer is tomorrow — so it is separated
  // from 503, which really is a busy server.
  if (status === 429) return 'limit';
  if (status === 503) return 'busy';
  // 502 is this API's "the model failed or answered with something unusable"
  // (see api/analyze.ts) — the request was fine, the reading of it wasn't.
  if (status === 502) return 'unreadable';
  return 'generic';
}

/** Connectivity wording is identical wherever it happens; `unreadable` and
 * `generic` are not, because the useful advice depends on what was being
 * asked for. Screens pass their own two keys. */
export function requestErrorKey(
  kind: RequestErrorKind,
  unreadableKey: TranslationKey,
  genericKey: TranslationKey,
): TranslationKey {
  if (kind === 'offline') return 'error_offline';
  if (kind === 'connection') return 'error_connection';
  if (kind === 'busy') return 'error_busy';
  if (kind === 'limit') return 'error_daily_limit';
  if (kind === 'unreadable') return unreadableKey;
  return genericKey;
}
