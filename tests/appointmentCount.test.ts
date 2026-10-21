/** "3 appointments", in six languages.
 *
 * The badge on a child's photo used to read "1 مواعيد" — a number next to a
 * fixed plural noun. That is wrong in most of the six languages and glaringly
 * wrong in Arabic, which has six plural categories and does not take the
 * numeral at all in the dual: "موعدين", never "2 موعدين".
 *
 * Intl.PluralRules supplies the category, so what is left to get wrong is the
 * table of forms — a missing category silently falls back to `other` and
 * reads as a grammatical mistake rather than as a bug. These pin the
 * boundaries that each language actually distinguishes. */
import { describe, it, expect } from 'vitest';
import { appointmentCount, translations, type Lang } from '../src/context/translations';

const LANGS = Object.keys(translations) as Lang[];

describe('Arabic, which needs all of them', () => {
  it('uses the singular for one, with no numeral', () => {
    expect(appointmentCount('ar', 1)).toBe('موعد واحد');
  });

  it('uses the dual for two, with no numeral', () => {
    // The bug this file exists for: "2 موعدين" is not Arabic.
    expect(appointmentCount('ar', 2)).toBe('موعدين');
    expect(appointmentCount('ar', 2)).not.toMatch(/\d/);
  });

  it('uses the plural with the numeral for three to ten', () => {
    expect(appointmentCount('ar', 3)).toBe('3 مواعيد');
    expect(appointmentCount('ar', 10)).toBe('10 مواعيد');
  });

  it('switches form again past ten', () => {
    expect(appointmentCount('ar', 11)).toBe('11 موعداً');
    expect(appointmentCount('ar', 99)).toBe('99 موعداً');
  });

  it('has a form for a hundred and beyond', () => {
    expect(appointmentCount('ar', 100)).toBe('100 موعد');
  });
});

describe('Ukrainian, which needs three', () => {
  it('distinguishes one, few and many', () => {
    expect(appointmentCount('uk', 1)).toBe('1 зустріч');
    expect(appointmentCount('uk', 3)).toBe('3 зустрічі');
    expect(appointmentCount('uk', 5)).toBe('5 зустрічей');
  });

  it('follows the rule past twenty, where it is not simply "many"', () => {
    // 21 is `one` in Ukrainian, 22 is `few` — a two-form table gets both wrong.
    expect(appointmentCount('uk', 21)).toBe('21 зустріч');
    expect(appointmentCount('uk', 22)).toBe('22 зустрічі');
    expect(appointmentCount('uk', 25)).toBe('25 зустрічей');
  });
});

describe('the languages that need fewer forms', () => {
  it('German and English switch once', () => {
    expect(appointmentCount('de', 1)).toBe('einen Termin');
    expect(appointmentCount('de', 2)).toBe('2 Termine');
    expect(appointmentCount('en', 1)).toBe('one appointment');
    expect(appointmentCount('en', 2)).toBe('2 appointments');
  });

  it('Turkish and Persian keep the singular after any number', () => {
    expect(appointmentCount('tr', 1)).toBe('bir randevu');
    expect(appointmentCount('tr', 7)).toBe('7 randevu');
    expect(appointmentCount('fa', 1)).toBe('یک قرار');
    expect(appointmentCount('fa', 7)).toBe('7 قرار');
  });
});

describe('every language, at every count the app can show', () => {
  it('produces something, and never leaves a placeholder behind', () => {
    for (const lang of LANGS) {
      for (const n of [1, 2, 3, 5, 7, 10, 11, 21, 22, 25, 99, 100, 101]) {
        const phrase = appointmentCount(lang, n);
        expect(phrase.trim(), `${lang}/${n} is empty`).not.toBe('');
        expect(phrase, `${lang}/${n} kept {count}`).not.toContain('{count}');
      }
    }
  });

  it('writes the number whenever it writes one at all', () => {
    // Every form either spells the count out in words (one, two) or includes
    // the digits — what must never happen is a number silently dropped.
    for (const lang of LANGS) {
      for (const n of [3, 5, 11, 25, 100]) {
        expect(appointmentCount(lang, n), `${lang}/${n}`).toContain(String(n));
      }
    }
  });
});

describe('the greeting that uses it', () => {
  it('has a {phrase} slot in every language', () => {
    for (const lang of LANGS) {
      expect(translations[lang].greeting_subtitle_count, lang).toContain('{phrase}');
    }
  });

  it('says "this week" in the empty case too, matching what the code counts', () => {
    // Home counts the next seven days. The empty line used to say "no
    // appointments soon" with no week in it, directly above a list showing
    // one two months out — which read as a contradiction.
    for (const lang of LANGS) {
      expect(translations[lang].greeting_subtitle_clear.trim(), lang).not.toBe('');
    }
    expect(translations.ar.greeting_subtitle_clear).toContain('هالأسبوع');
    expect(translations.en.greeting_subtitle_clear).toContain('this week');
    expect(translations.de.greeting_subtitle_clear).toContain('Diese Woche');
  });
});
