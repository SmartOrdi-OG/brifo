/** What the Telegram bot keeps about a chat (privacy policy § 3.13 / § 8):
 * only the language, for twelve months after the last message, and nothing
 * once the user stops or blocks the bot. */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = new Map<string, unknown>();
const ttls = new Map<string, number | undefined>();
const sets = new Map<string, Set<string>>();

vi.mock('../src/server/kv.js', () => ({
  kvGet: async (key: string) => store.get(key) ?? null,
  kvSet: async (key: string, value: unknown, ttlSeconds?: number) => {
    store.set(key, value);
    ttls.set(key, ttlSeconds);
  },
  kvDel: async (key: string) => void store.delete(key),
  kvSrem: async (setKey: string, member: string) => void sets.get(setKey)?.delete(member),
  kvMarkSentOnce: async () => true,
}));

const sent: unknown[] = [];
beforeEach(() => {
  store.clear();
  ttls.clear();
  sets.clear();
  sent.length = 0;
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  process.env.PUBLIC_BASE_URL = 'https://example.test';
  vi.stubGlobal('fetch', async (_url: string, init: { body: string }) => {
    sent.push(JSON.parse(init.body));
    return new Response(JSON.stringify({ ok: true, result: {} }), { status: 200 });
  });
});

describe('the Telegram chat record', () => {
  it('keeps only the language, with a twelve-month expiry', async () => {
    const { handleUpdate, CHAT_TTL_SECONDS } = await import('../src/server/telegram.js');
    await handleUpdate({ message: { chat: { id: 7, type: 'private' }, from: { language_code: 'ar' }, text: '/start' } });
    expect(store.get('tg:chat:7')).toEqual({ lang: 'ar' });
    expect(ttls.get('tg:chat:7')).toBe(CHAT_TTL_SECONDS);
    expect(CHAT_TTL_SECONDS).toBe(365 * 24 * 60 * 60);
  });

  it('is deleted when the user blocks or stops the bot', async () => {
    const { handleUpdate } = await import('../src/server/telegram.js');
    store.set('tg:chat:7', { lang: 'de' });
    sets.set('tg:chats', new Set(['7']));
    await handleUpdate({ my_chat_member: { chat: { id: 7, type: 'private' }, new_chat_member: { status: 'kicked' } } });
    expect(store.has('tg:chat:7')).toBe(false);
    expect(sets.get('tg:chats')!.has('7')).toBe(false);
    expect(sent).toHaveLength(0);
  });

  it('renews the expiry on every message from a known chat', async () => {
    const { handleUpdate } = await import('../src/server/telegram.js');
    store.set('tg:chat:7', { lang: 'de' });
    await handleUpdate({ message: { chat: { id: 7, type: 'private' }, text: 'hallo' } });
    expect(ttls.get('tg:chat:7')).toBeGreaterThan(0);
  });
});
