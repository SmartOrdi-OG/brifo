/** Constants that exist twice, and the one language list they all answer to.
 *
 * The app is split across three module scopes: the browser bundle (ESM), and
 * api/ plus src/server/ (both CommonJS, because that is what Vercel's
 * functions want). CommonJS cannot import the ESM side, so a handful of values
 * are deliberately written out twice with a comment telling the next person to
 * keep them in sync by hand. Comments do not fail builds.
 *
 * Tests can, and this file is the only place in the project that can see both
 * sides at once — a test is ESM and so may import either. Everything here is a
 * single equality that a copy-paste drift breaks. */
import { describe, it, expect } from 'vitest';

import { BOT_LANGS, BOT_TEXT, LANG_NAMES, langFromTelegramCode, isBotLang } from '../src/server/telegramText.js';
import { REFERRAL_BONUS_DAYS as SERVER_BONUS_DAYS } from '../src/server/referral.js';
import { OUTPUT_LANGUAGE as REPLY_LANGUAGES } from '../src/server/reply.js';
import { OUTPUT_LANGUAGE as ANALYZE_LANGUAGES } from '../api/analyze.js';

import { translations } from '../src/context/translations';
import { REFERRAL_BONUS_DAYS as CLIENT_BONUS_DAYS } from '../src/lib/referral';
import { isTrialExpired } from '../src/lib/trial';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('the list of languages', () => {
  // BOT_LANGS is the only runtime array of the six; everywhere else they are
  // object keys or a type union. Treating it as the canonical list means one
  // place to add a seventh, and these tests then name everywhere that must
  // follow.
  it('is the same on the server as in the app', () => {
    expect([...BOT_LANGS].sort()).toEqual(Object.keys(translations).sort());
  });

  it('is covered by the scan prompt', () => {
    expect(Object.keys(ANALYZE_LANGUAGES).sort()).toEqual([...BOT_LANGS].sort());
  });

  it('is covered by the reply prompt', () => {
    expect(Object.keys(REPLY_LANGUAGES).sort()).toEqual([...BOT_LANGS].sort());
  });

  it('is covered by the bot text and the language names it offers', () => {
    expect(Object.keys(BOT_TEXT).sort()).toEqual([...BOT_LANGS].sort());
    expect(Object.keys(LANG_NAMES).sort()).toEqual([...BOT_LANGS].sort());
  });

  it('names a real language for every entry, not a placeholder', () => {
    for (const lang of BOT_LANGS) {
      expect(ANALYZE_LANGUAGES[lang]?.length, `analyze: ${lang}`).toBeGreaterThan(2);
      expect(REPLY_LANGUAGES[lang]?.length, `reply: ${lang}`).toBeGreaterThan(2);
      expect(LANG_NAMES[lang]?.length, `name: ${lang}`).toBeGreaterThan(1);
    }
  });
});

describe("Telegram's language code", () => {
  it('maps the codes Telegram actually sends', () => {
    expect(langFromTelegramCode('de')).toBe('de');
    expect(langFromTelegramCode('de-AT')).toBe('de');
    expect(langFromTelegramCode('ar')).toBe('ar');
    expect(langFromTelegramCode('uk')).toBe('uk');
  });

  it('falls back rather than throwing on anything else', () => {
    for (const code of [undefined, null, '', 'zz', 42, {}]) {
      expect(isBotLang(langFromTelegramCode(code)), `code ${JSON.stringify(code)}`).toBe(true);
    }
  });
});

describe('the referral bonus', () => {
  it('is the same number the app shows and the server grants', () => {
    // A mismatch would promise the user one thing on the invite screen and
    // give them another in their trial.
    expect(CLIENT_BONUS_DAYS).toBe(SERVER_BONUS_DAYS);
  });
});

describe('the trial length', () => {
  // src/server/entitlement.ts holds its own copy of TRIAL_DAYS. Comparing the
  // numbers is not possible (it does not export it), but comparing behaviour
  // is: tests/entitlement.test.ts pins the server at seven days, and this pins
  // the client to the same boundary. Both must move together or the app offers
  // a scan the server then refuses.
  const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();

  it('is seven days on the client side', () => {
    expect(isTrialExpired(daysAgo(6.9))).toBe(false);
    expect(isTrialExpired(daysAgo(7.1))).toBe(true);
  });

  it('is extended by the bonus days on the client side too', () => {
    expect(isTrialExpired(daysAgo(10), 7)).toBe(false);
    expect(isTrialExpired(daysAgo(15), 7)).toBe(true);
  });
});
