/** Must stay in step with INTENT_LABELS and the request schema in
 * src/server/reply.ts — the server rejects anything it doesn't list. */
export type ReplyIntent =
  | 'entschuldigung'
  | 'termin'
  | 'absage'
  | 'zustimmung'
  | 'ratenzahlung'
  | 'einspruch'
  | 'frage';

export interface ReplyLetter {
  german: string;
  /** The same letter translated into the user's chosen app language. */
  translation: string;
}
