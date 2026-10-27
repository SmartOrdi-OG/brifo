/** What the Telegram bot says, in six languages.
 *
 * The bot is the front door: for a lot of people the first thing they ever see
 * of Brifo is its welcome message, and nobody on the team reads Ukrainian or
 * Persian. The limits it has to respect are Telegram's, not ours — a message
 * over 4096 characters is rejected outright, and a button label past about
 * forty characters is cut off mid-word on a phone — and both fail at the far
 * end, in a language nobody here is checking. */
import { describe, it, expect } from 'vitest';
import { BOT_LANGS, BOT_TEXT, t } from '../src/server/telegramText.js';

/** Telegram's own ceiling for sendMessage. */
const TELEGRAM_MAX_MESSAGE = 4096;
/** No hard limit, but an inline button wider than this wraps or truncates. */
const SENSIBLE_BUTTON_LENGTH = 40;

const KEYS = Object.keys(BOT_TEXT.ar) as (keyof (typeof BOT_TEXT)['ar'])[];

describe('every language', () => {
  for (const lang of BOT_LANGS) {
    it(`${lang} says all of it`, () => {
      expect(Object.keys(BOT_TEXT[lang]).sort()).toEqual([...KEYS].sort());
      for (const key of KEYS) {
        expect(t(lang, key).trim(), `${lang}.${key} is empty`).not.toBe('');
      }
    });

    it(`${lang} stays inside Telegram's message limit`, () => {
      for (const key of KEYS) {
        expect(t(lang, key).length, `${lang}.${key} is too long to send`).toBeLessThanOrEqual(
          TELEGRAM_MAX_MESSAGE,
        );
      }
    });

    it(`${lang} has button labels that fit on a phone`, () => {
      for (const key of ['btn_open_app', 'btn_website'] as const) {
        expect(t(lang, key).length, `${lang}.${key}`).toBeLessThanOrEqual(SENSIBLE_BUTTON_LENGTH);
        expect(t(lang, key), `${lang}.${key} should be one line`).not.toContain('\n');
      }
    });

    it(`${lang} is actually translated, not left in Arabic`, () => {
      if (lang === 'ar') return;
      for (const key of KEYS) {
        expect(t(lang, key), `${lang}.${key} is still the Arabic string`).not.toBe(t('ar', key));
      }
    });
  }
});

describe('the welcome message', () => {
  it('tells every reader the letters are read in the app, not in the chat', () => {
    // The whole point of the rewrite: the bot is a doorway. A translation that
    // loses that sentence invites people to send photos into a chat that will
    // not read them.
    for (const lang of BOT_LANGS) {
      const body = t(lang, 'welcome_body') + t(lang, 'nudge_open_app');
      expect(body.length, `${lang} says too little to carry the point`).toBeGreaterThan(80);
    }
  });
});
