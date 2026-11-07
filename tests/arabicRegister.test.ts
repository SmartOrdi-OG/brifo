/** The Arabic in the app is Modern Standard Arabic, not a dialect.
 *
 * It drifted once. The UI strings and the guide were written in MSA, but the
 * account-deletion page was Levantine ("شو بينحذف", "روح على الإعدادات"), the
 * zero-appointments label read "ما في مواعيد", and — the one that mattered
 * most — api/analyze.ts asked the model for "Levantine-influenced Modern
 * Standard Arabic", so every summary, action and deadline it wrote came back
 * in dialect. That is most of the Arabic anyone actually reads, and none of
 * it is in a file a translator would think to check.
 *
 * MSA is not a style preference here: Brifo's users are Syrian, Iraqi,
 * Egyptian, Afghan and Moroccan families. Levantine reads as warm to some of
 * them and as foreign to the rest. MSA is the register they share.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

/** Whole words with no Modern Standard Arabic reading.
 *
 * Matched as whole tokens, never as substrings. Substring matching looks
 * like it works and does not: «هاد» is inside شهادة, «هاي» inside نهاية,
 * «بدو» inside بدون, «شو» inside المنشورة, «فيك» inside يعفيك. The first
 * version of this file did exactly that and reported the guide, the privacy
 * policy and the Impressum as dialect, all of which are correct MSA. */
const DIALECT = new Set([
  'شو', 'شلون', // ما / ماذا / كيف
  'هيك', 'هيدا', 'هاد', 'هاي', 'هدول', // هكذا / هذا / هذه / هؤلاء
  'هلق', 'هلأ', // الآن
  'إيمتى', 'ايمتى', // متى
  'وين', // أين
  'ليش', // لماذا
  'منيح', 'منيحة', // جيد
  'كتير', // كثير
  'شوي', 'شوية', // قليلاً
  'نحنا', // نحن
  'كمان', // أيضًا
  'بدك', 'بدكي', 'بدها', 'بدو', 'بدي', 'بدنا', // تريد / أريد
  'عنّا', 'عنا', // لدينا
  'اللي', // الذي / التي
  'تاني', 'تانية', // آخر / أخرى
  'بيضل', 'بتضل', 'منضل', // يظل / تظل
  'بينحذف', 'منحذف', // يُحذف / نحذف
  'ابعت', 'ابعتلنا', 'ابعتي', // أرسل / راسلنا
  'جوّا', 'جوا', // داخل
  'بتبلّش', 'نخلّص', 'بلّش', // تبدأ / ننتهي
  'عالسيرفر', 'عالتطبيق', // على الخادم / على التطبيق
  'مو', // ليس
  'فيك', 'فيكي', 'فينا', // يمكنك / يمكننا
]);

/** Files whose Arabic a user reads. */
const ARABIC_FILES = [
  'src/context/locales/ar.ts',
  'src/context/translations.ts',
  'src/data/accountDeletion.ts',
  'src/data/privacyPolicy.ar.ts',
  'src/data/agb.ts',
  'src/data/impressum.ts',
  'src/data/guideArticles.ts',
];

/* Several of these files carry every language at once, and Persian shares
 * the script. Persian-only letters and the zero-width non-joiner mark a line
 * as Persian so its words are not read as Arabic dialect. */
const PERSIAN = /[پچژگکی‌]/;

/** Arabic letters, plus the two diacritics these strings actually use. */
const ARABIC_WORD = /[ء-يّْ]+/g;

/** A leading و or ف is a conjunction glued to the next word ("وشو", "فهيك"),
 * so strip one before looking the token up. */
const bare = (word: string) => (word.length > 2 && (word[0] === 'و' || word[0] === 'ف') ? word.slice(1) : word);

function dialectHitsIn(relativePath: string): string[] {
  const lines = readFileSync(join(ROOT, relativePath), 'utf8').split('\n');
  const hits: string[] = [];
  lines.forEach((line, index) => {
    if (PERSIAN.test(line)) return;
    for (const word of line.match(ARABIC_WORD) ?? []) {
      if (DIALECT.has(word) || DIALECT.has(bare(word))) {
        hits.push(`${relativePath}:${index + 1}  «${word}»  ${line.trim().slice(0, 80)}`);
      }
    }
  });
  return hits;
}

describe('the Arabic a user reads is MSA', () => {
  for (const file of ARABIC_FILES) {
    it(file, () => {
      const hits = dialectHitsIn(file);
      expect(hits, `dialect found:\n${hits.join('\n')}`).toEqual([]);
    });
  }
});

describe('the check itself', () => {
  it('matches whole words, not pieces of MSA ones', () => {
    // Every one of these is correct MSA that an earlier substring version of
    // this test reported as dialect.
    const innocent = ['شهادة', 'نهاية', 'بدون', 'المنشورة', 'يعفيك', 'معنا', 'تكوين', 'الثاني'];
    for (const word of innocent) {
      expect(DIALECT.has(word), word).toBe(false);
      expect(DIALECT.has(bare(word)), word).toBe(false);
    }
  });

  it('still catches the words that were actually there', () => {
    for (const word of ['شو', 'اللي', 'بينحذف', 'عنا', 'تانية']) {
      expect(DIALECT.has(word), word).toBe(true);
    }
  });
});

describe('and so is the Arabic the model is told to write', () => {
  // The prompt is the real source of most of it: whatever register this line
  // names is the register of every letter summary in the app.
  it('asks the scan prompt for Modern Standard Arabic, with no dialect named', () => {
    const source = readFileSync(join(ROOT, 'api/analyze.ts'), 'utf8');
    const value = source.match(/^\s*ar:\s*'([^']+)'/m)?.[1] ?? '';
    expect(value).toContain('Modern Standard Arabic');
    expect(value).not.toMatch(/Levantine|Egyptian|Gulf|Maghrebi|dialect/i);
  });

  it('names the same register in the reply prompt', () => {
    const source = readFileSync(join(ROOT, 'src/server/reply.ts'), 'utf8');
    const value = source.match(/^\s*ar:\s*'([^']+)'/m)?.[1] ?? '';
    expect(value).toContain('Modern Standard Arabic');
  });
});
