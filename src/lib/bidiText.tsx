import type { ReactNode } from 'react';

/**
 * Matches a run of Latin letters/digits/currency symbols, allowing internal
 * separators (. , : / -) and single spaces, as long as each side of the
 * separator is itself a Latin/numeric character. This groups "6,50", "13:30",
 * "2026-07-04" and "Volksschule 23" into one run each, without swallowing the
 * Arabic text around them.
 *
 * The range past ASCII (U+00C0–U+024F, Latin-1 Supplement and Latin Extended
 * A/B) is what keeps German words whole. Without it "Meldebestätigung" was two
 * runs either side of a stray "ä", and the bidi algorithm reordered them into
 * "tigungäMeldebest" on screen — a word the reader cannot even search for.
 * Every umlaut word in the guide had this: Frühwarnung, Deutschförderklasse,
 * Behörde, Gebühr.
 */
const LATIN_LETTER = 'A-Za-z0-9€$%\\u00C0-\\u024F';
const LATIN_NUMERIC_RUN = new RegExp(
  `[${LATIN_LETTER}]+(?:(?:[.,:/-]|\\s+(?=[${LATIN_LETTER}]))[${LATIN_LETTER}]+)*`,
  'g',
);

/**
 * The Unicode bidi algorithm reorders "weak"/"neutral" runs (digits, decimal
 * separators, Latin words) relative to surrounding Arabic text, which visually
 * scrambles amounts, times and names like "Brifo" when they sit inside an RTL
 * sentence. Isolating each Latin/numeric run in its own dir="ltr" span with
 * unicode-bidi: isolate pins it as a single opaque unit at that position in
 * the logical text, regardless of the surrounding direction.
 */
export function isolateBidiRuns(text: string | null | undefined): ReactNode {
  if (!text) return text ?? '';

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;
  const regex = new RegExp(LATIN_NUMERIC_RUN);
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={index++} dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline-block' }}>
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
