/** The guide: 22 articles in six languages, plus a feminine Arabic variant.
 *
 * All of it is hand-written data, which is to say the place where mistakes
 * actually happened. A missing icon rendered `<undefined />` and took the
 * whole screen blank. A regex that matched too much wrote two feminine
 * overrides into the wrong article. An article added in one language and
 * forgotten in another leaves a reader with nothing at all on that page, and
 * nothing would have failed.
 *
 * So this walks the tables the way a reader does, in every language, and
 * checks the things a reader would notice. */
import { describe, it, expect } from 'vitest';
import { GUIDE_ARTICLE_IDS, getGuideArticles, type GuideArticle } from '../src/data/guideArticles';
import { GUIDE_ARTICLE_ICONS } from '../src/data/guideIcons';
import { BOT_LANGS } from '../src/server/telegramText.js';
import type { Lang } from '../src/context/translations';

const LANGS = BOT_LANGS as readonly Lang[];

/** Every rendered variant: the six languages, plus Arabic as a woman reads it
 * (getGuideArticles applies arFeminineOverrides only for gender 'f'). */
const variants: { name: string; articles: GuideArticle[] }[] = [
  ...LANGS.map((lang) => ({ name: lang, articles: getGuideArticles(lang) })),
  { name: 'ar (feminine)', articles: getGuideArticles('ar', 'f') },
];

describe('the article list', () => {
  it('has no duplicate ids', () => {
    expect(new Set(GUIDE_ARTICLE_IDS).size).toBe(GUIDE_ARTICLE_IDS.length);
  });

  it('has an icon for every id', () => {
    // Typed as Record<GuideArticleId, LucideIcon>, so this is belt and braces
    // — but the failure mode it guards is a blank screen, not a missing label.
    for (const id of GUIDE_ARTICLE_IDS) {
      expect(GUIDE_ARTICLE_ICONS[id], `no icon for ${id}`).toBeTruthy();
    }
  });

  it('carries no icon for an article that no longer exists', () => {
    expect(Object.keys(GUIDE_ARTICLE_ICONS).sort()).toEqual([...GUIDE_ARTICLE_IDS].sort());
  });

  for (const { name, articles } of variants) {
    it(`is complete and in the same order in ${name}`, () => {
      expect(articles.map((a) => a.id)).toEqual([...GUIDE_ARTICLE_IDS]);
    });
  }
});

describe('every article in every language', () => {
  for (const { name, articles } of variants) {
    for (const article of articles) {
      const where = `${name}/${article.id}`;

      it(`${where} reads as a finished article`, () => {
        expect(article.title.trim(), `${where}: empty title`).not.toBe('');
        expect(article.teaser.trim(), `${where}: empty teaser`).not.toBe('');
        expect(article.paragraphs.length, `${where}: no paragraphs`).toBeGreaterThan(0);
        for (const [i, p] of article.paragraphs.entries()) {
          expect(p.trim(), `${where}: paragraph ${i} is empty`).not.toBe('');
        }
      });

      it(`${where} closes every bold marker`, () => {
        // GuideArticle.tsx renders emphasis by splitting on '**' and bolding
        // the odd-numbered pieces. An unpaired marker therefore does not show
        // as a stray '**' — it bolds everything after it to the end of the
        // paragraph, which is easy to write and hard to spot.
        for (const [i, text] of [article.title, article.teaser, ...article.paragraphs].entries()) {
          const markers = text.split('**').length - 1;
          expect(markers % 2, `${where}: unbalanced ** in field ${i}: ${text.slice(0, 60)}`).toBe(0);
        }
      });
    }
  }
});

describe('the official sources', () => {
  const withSource = (articles: GuideArticle[]) => articles.filter((a) => a.source).map((a) => a.id);

  it('are https URLs', () => {
    for (const { name, articles } of variants) {
      for (const article of articles) {
        if (!article.source) continue;
        expect(() => new URL(article.source!), `${name}/${article.id}: ${article.source}`).not.toThrow();
        expect(article.source, `${name}/${article.id}`).toMatch(/^https:\/\//);
      }
    }
  });

  it('cite the same article in every language', () => {
    // A source shown to a German reader but not an Arabic one would mean the
    // two were checked against different things, or one was checked and the
    // other guessed.
    const reference = withSource(getGuideArticles('ar'));
    for (const { name, articles } of variants) {
      expect(withSource(articles), `${name} cites a different set`).toEqual(reference);
    }
  });

  it('point at the same URL in every language', () => {
    const byId = new Map(getGuideArticles('ar').map((a) => [a.id, a.source]));
    for (const { name, articles } of variants) {
      for (const article of articles) {
        expect(article.source, `${name}/${article.id}`).toBe(byId.get(article.id));
      }
    }
  });
});

describe('the feminine Arabic variant', () => {
  const masculine = getGuideArticles('ar');
  const feminine = getGuideArticles('ar', 'f');

  it('keeps every article the same shape', () => {
    for (const [i, article] of feminine.entries()) {
      expect(article.id).toBe(masculine[i].id);
      expect(article.paragraphs.length, `${article.id}: paragraph count changed`).toBe(
        masculine[i].paragraphs.length,
      );
    }
  });

  it('actually differs somewhere', () => {
    // If the overrides stopped being applied — a renamed id, a changed
    // accessor — every string would quietly fall back to the masculine form
    // and the setting would do nothing at all.
    const changed = feminine.filter((a, i) => JSON.stringify(a) !== JSON.stringify(masculine[i]));
    expect(changed.length).toBeGreaterThan(5);
  });

  it('is what gender null does not get', () => {
    expect(getGuideArticles('ar', null)).toEqual(masculine);
  });
});
