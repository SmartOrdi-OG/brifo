/** The six translation tables, and the placeholders inside them.
 *
 * Missing *keys* are already impossible: de/tr/fa/en/uk are each typed as
 * `Record<keyof typeof ar, string>`, so the build fails on a gap. What the
 * type cannot see is the inside of the strings — and that is where the
 * interesting breakage lives. `greeting_subtitle_many` reads "عندك {count}
 * مواعيد"; drop the {count} in one language and that reader is shown a
 * sentence with a hole in it, in the one place the app greets them. Nothing
 * fails, nothing logs, and only someone reading that language ever finds out.
 *
 * 290-odd keys across six languages is also well past the point where anyone
 * re-reads them all by hand. */
import { describe, it, expect } from 'vitest';
import { translations, arByGender, isRtlLang, type Lang, type TranslationKey } from '../src/context/translations';

const LANGS = Object.keys(translations) as Lang[];
const KEYS = Object.keys(translations.ar) as TranslationKey[];

/** Every {placeholder} in a string, as a sorted list so order never matters. */
function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

describe('the tables', () => {
  it('cover the same keys', () => {
    for (const lang of LANGS) {
      expect(Object.keys(translations[lang]).sort(), `${lang} differs`).toEqual([...KEYS].sort());
    }
  });

  it('have no empty or whitespace-only string', () => {
    for (const lang of LANGS) {
      for (const key of KEYS) {
        expect(translations[lang][key].trim(), `${lang}.${key} is empty`).not.toBe('');
      }
    }
  });
});

describe('placeholders', () => {
  for (const lang of LANGS) {
    it(`match the Arabic original in ${lang}`, () => {
      for (const key of KEYS) {
        const expected = placeholders(translations.ar[key]);
        expect(placeholders(translations[lang][key]), `${lang}.${key}`).toEqual(expected);
      }
    });
  }

  it('survive the gendered Arabic overrides', () => {
    // These replace individual Arabic strings wholesale, so a rewritten
    // sentence can easily lose the {name} it was built around.
    for (const gender of ['m', 'f'] as const) {
      for (const [key, value] of Object.entries(arByGender[gender])) {
        expect(placeholders(value!), `arByGender.${gender}.${key}`).toEqual(
          placeholders(translations.ar[key as TranslationKey]),
        );
      }
    }
  });
});

describe('the gendered overrides', () => {
  it('only name keys that exist', () => {
    for (const gender of ['m', 'f'] as const) {
      for (const key of Object.keys(arByGender[gender])) {
        expect(KEYS, `arByGender.${gender}.${key} is not a translation key`).toContain(key);
      }
    }
  });

  it('actually change the string they override', () => {
    for (const gender of ['m', 'f'] as const) {
      for (const [key, value] of Object.entries(arByGender[gender])) {
        expect(value, `arByGender.${gender}.${key} repeats the base string`).not.toBe(
          translations.ar[key as TranslationKey],
        );
      }
    }
  });
});

describe('text direction', () => {
  it('is right-to-left for exactly Arabic and Persian', () => {
    // Getting this wrong mirrors the entire layout, so it is worth pinning
    // rather than trusting a list to stay correct as languages are added.
    expect(LANGS.filter(isRtlLang).sort()).toEqual(['ar', 'fa']);
  });
});
