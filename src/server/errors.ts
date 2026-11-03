/** Thrown for server misconfiguration (e.g. a missing required env var), as
 * opposed to feature-specific errors that signal bad/invalid request input.
 * Kept dependency-free and separate from analyze.ts: importing ConfigError
 * from a module that also pulls in @anthropic-ai/sdk at load time crashes
 * unrelated serverless functions at cold start (the exact bug this file
 * fixes for the push-notification routes — see api/analyze.ts's own note
 * on why it avoids importing from src/ for the same reason). */
export class ConfigError extends Error {}

/** What may be logged about a failed model call: the kind of error and the
 * HTTP status, never the error's message or body. Model errors can carry the
 * text being processed — a structured-output parse failure quotes the model's
 * answer, i.e. the letter's content — and Vercel's logs are not where
 * health data from a letter may end up. */
export function describeError(err: unknown): string {
  if (!(err instanceof Error)) return typeof err;
  const status = (err as { status?: unknown }).status;
  return typeof status === 'number' ? `${err.name} (status ${status})` : err.name;
}
