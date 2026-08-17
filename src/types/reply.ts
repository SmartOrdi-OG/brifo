export type ReplyIntent = 'entschuldigung' | 'termin' | 'zustimmung' | 'frage';

export interface ReplyLetter {
  german: string;
  /** The same letter translated into the user's chosen app language. */
  translation: string;
}
