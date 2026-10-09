/** Latin and numeric runs inside Arabic text.
 *
 * Arabic runs right to left, and the Unicode bidi algorithm reorders "weak"
 * runs — digits, Latin words, decimal separators — relative to the text around
 * them. On screen that scrambles exactly the parts a reader needs to copy
 * exactly: an amount, a time, a German word off a letter. isolateBidiRuns
 * wraps each such run so it stays put, and getting the run boundaries wrong is
 * not a crash — it is a word rendered as "tigungäMeldebest", which the reader
 * cannot even search for. That happened to every umlaut word in the guide.
 *
 * The function builds React elements; these tests read the pieces it produced
 * rather than rendering them, which needs no DOM. */
import { describe, it, expect } from 'vitest';
import { isValidElement, type ReactNode } from 'react';
import { isolateBidiRuns } from '../src/lib/bidiText';

/** The runs the function decided to isolate, in order. */
function isolated(text: string): string[] {
  const parts = isolateBidiRuns(text);
  if (!Array.isArray(parts)) return [];
  return parts
    .filter((p): p is React.ReactElement<{ children: ReactNode }> => isValidElement(p))
    .map((p) => String(p.props.children));
}

/** Everything the function produced, flattened back to text — must equal the
 * input, or the renderer is dropping or duplicating characters. */
function flattened(text: string): string {
  const parts = isolateBidiRuns(text);
  if (typeof parts === 'string') return parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) =>
      isValidElement(p) ? String((p.props as { children: ReactNode }).children) : String(p ?? ''),
    )
    .join('');
}

describe('keeping German words whole', () => {
  it('holds an umlaut word together', () => {
    // Two runs either side of a stray "ä" is what produced "tigungäMeldebest".
    expect(isolated('الرسالة اسمها Meldebestätigung ولازم تجيبها')).toEqual(['Meldebestätigung']);
  });

  it('holds the other words that broke', () => {
    for (const word of ['Frühwarnung', 'Deutschförderklasse', 'Behörde', 'Gebühr', 'Österreich']) {
      expect(isolated(`نص عربي ${word} نص عربي`), word).toEqual([word]);
    }
  });

  it('keeps a word with a following number as one run', () => {
    expect(isolated('بتروح لـ Volksschule 23 بكرا')).toEqual(['Volksschule 23']);
  });
});

describe('keeping numbers readable', () => {
  it('holds an amount with a decimal comma together', () => {
    expect(isolated('لازم تدفع 6,50 يورو')).toEqual(['6,50']);
  });

  it('holds a time together', () => {
    expect(isolated('الموعد الساعة 13:30 بالمدرسة')).toEqual(['13:30']);
  });

  it('holds a date together', () => {
    expect(isolated('آخر موعد 2026-07-04 لا تتأخر')).toEqual(['2026-07-04']);
  });

  it('holds a currency symbol with its amount', () => {
    expect(isolated('الاشتراك 2.90€ بالشهر')).toEqual(['2.90€']);
  });
});

describe('what it leaves alone', () => {
  it('does not isolate anything in pure Arabic', () => {
    expect(isolated('هاد نص عربي بالكامل بدون أي رقم')).toEqual([]);
  });

  it('returns empty text unchanged', () => {
    expect(isolateBidiRuns('')).toBe('');
    expect(isolateBidiRuns(null)).toBe('');
    expect(isolateBidiRuns(undefined)).toBe('');
  });

  it('does not swallow the Arabic either side of a run', () => {
    for (const text of [
      'الموعد 13:30 بالمدرسة',
      'Meldebestätigung لازم',
      'لازم Meldebestätigung',
      '6,50 يورو و 13:30 الساعة',
      'نص',
      '2026-07-04',
    ]) {
      expect(flattened(text), `lost or duplicated characters in: ${text}`).toBe(text);
    }
  });

  it('separates two runs that are only joined by Arabic', () => {
    expect(isolated('من 08:00 لحد 16:00')).toEqual(['08:00', '16:00']);
  });

  it('does not join across a line break', () => {
    expect(isolated('Montag\nDienstag')).toEqual(['Montag', 'Dienstag']);
  });
});
