/** The Brifo bot: a doorway to the app, not a second copy of it.
 *
 * It greets people in their language, says what Brifo is, and opens it — the
 * Mini App runs the real app inside Telegram's webview (src/lib/
 * telegramWebApp.ts), where letters and appointments are saved to the user's
 * own account.
 *
 * It deliberately does NOT read letters in the chat. An earlier version did,
 * and it was the wrong shape twice over: it gave away the app's two paid
 * features for free, and anything it read was stranded — the bot knows a
 * Telegram chat id, not a Brifo account, so a letter it analysed could never
 * reach the child's file the reader expected it in. Restoring that is a real
 * feature (link a chat to an account first), not an undeletion; see the git
 * history for the analysis code if it comes back.
 *
 * Trust boundary: everything on an update is attacker-controlled — anyone can
 * message a public bot. Nothing here is interpolated unescaped, and the bot
 * makes no model calls at all, so there is no budget to run up. */

import { ConfigError } from './errors.js';
import { kvGet, kvSet, kvSadd, kvMarkSentOnce } from './kv.js';
import { BOT_LANGS, LANG_NAMES, isBotLang, langFromTelegramCode, t, type BotLang } from './telegramText.js';

// ---------------------------------------------------------------------------
// Telegram API
// ---------------------------------------------------------------------------

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new ConfigError('TELEGRAM_BOT_TOKEN is not set');
  return token;
}

export function telegramConfigured(): boolean {
  return !!process.env.TELEGRAM_BOT_TOKEN;
}

/** Thrown when Telegram itself rejects a call. `code` is its HTTP status. */
export class TelegramApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

async function tg<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${botToken()}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(20000),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; result?: T; description?: string } | null;
  if (!res.ok || !data?.ok) {
    throw new TelegramApiError(data?.description ?? `${method} failed with ${res.status}`, res.status);
  }
  return data.result as T;
}

/** Telegram's HTML parse mode. Nothing the bot says contains user input today,
 * but escaping at the boundary is what keeps that true if it ever does. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The bot's copy uses **bold** in a couple of places; Telegram's HTML mode
 * wants tags. Runs after escaping, so a literal asterisk in user input could
 * never turn into markup. */
function boldMarkers(value: string): string {
  return value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

function format(text: string): string {
  return boldMarkers(escapeHtml(text));
}

/** A `web_app` button opens the Mini App inside Telegram; `url` opens the
 * phone's browser; `callback_data` comes back to this webhook. */
type InlineButton = { text: string } & (
  | { callback_data: string }
  | { web_app: { url: string } }
  | { url: string }
);

interface InlineKeyboard {
  inline_keyboard: InlineButton[][];
}

async function send(chatId: number, text: string, keyboard?: InlineKeyboard): Promise<void> {
  await tg('sendMessage', {
    chat_id: chatId,
    text: format(text),
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
    ...(keyboard ? { reply_markup: keyboard } : {}),
  });
}

// ---------------------------------------------------------------------------
// Per-chat state — just the chosen language
// ---------------------------------------------------------------------------

const CHATS_SET = 'tg:chats';
const chatKey = (chatId: number) => `tg:chat:${chatId}`;

interface ChatState {
  lang: BotLang;
}

async function loadChat(chatId: number): Promise<ChatState | null> {
  return kvGet<ChatState>(chatKey(chatId));
}

async function saveChat(chatId: number, state: ChatState): Promise<void> {
  await kvSet(chatKey(chatId), state);
  await kvSadd(CHATS_SET, String(chatId));
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

/** Where the app lives. PUBLIC_BASE_URL should be the real domain in
 * production: VERCEL_URL is the deployment-specific hostname, which sits
 * behind Vercel's deployment protection on some accounts. */
function appBaseUrl(): string {
  const explicit = process.env.PUBLIC_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:5173';
}

/** The whole point of the bot. Telegram only accepts an https URL for a
 * `web_app` button, so a local or unset base URL yields no buttons rather than
 * ones that error when tapped. */
function openAppKeyboard(lang: BotLang): InlineKeyboard | undefined {
  const url = appBaseUrl();
  if (!url.startsWith('https://')) return undefined;
  return {
    inline_keyboard: [
      [{ text: t(lang, 'btn_open_app'), web_app: { url } }],
      // The browser is worth offering too: it is where the app can be
      // installed to the home screen, where notifications work, and — because
      // of Apple's rules — the only place a subscription can be bought.
      [{ text: t(lang, 'btn_website'), url }],
    ],
  };
}

function languageKeyboard(): InlineKeyboard {
  return {
    inline_keyboard: BOT_LANGS.map((code) => [{ text: LANG_NAMES[code], callback_data: `l:${code}` }]),
  };
}

// ---------------------------------------------------------------------------
// Update handling
// ---------------------------------------------------------------------------

interface TelegramMessage {
  chat?: { id?: number; type?: string };
  from?: { language_code?: string };
  text?: string;
}

export interface TelegramUpdate {
  update_id?: number;
  message?: TelegramMessage;
  callback_query?: {
    id?: string;
    data?: string;
    message?: TelegramMessage;
    from?: { language_code?: string };
  };
}

function newChatState(languageCode: unknown): ChatState {
  return { lang: langFromTelegramCode(languageCode) };
}

async function handleCommand(chatId: number, state: ChatState, command: string): Promise<void> {
  const lang = state.lang;

  switch (command) {
    case '/start':
      await saveChat(chatId, state);
      // Language picker first, app button under the welcome: someone who
      // cannot read the current language needs the picker to be the thing
      // they see, and the six rows sit right above the message they follow.
      await send(chatId, `**${t(lang, 'welcome_title')}**\n\n${t(lang, 'welcome_body')}`, openAppKeyboard(lang));
      await send(chatId, t(lang, 'lang_prompt'), languageKeyboard());
      return;

    case '/help':
      await send(chatId, t(lang, 'help'), openAppKeyboard(lang));
      return;

    case '/lang':
      await send(chatId, t(lang, 'lang_prompt'), languageKeyboard());
      return;

    case '/app':
      await send(chatId, t(lang, 'open_app_body'), openAppKeyboard(lang));
      return;

    default:
      // An unknown command is not worth a correction — it is one more chance
      // to point at the app.
      await send(chatId, t(lang, 'nudge_open_app'), openAppKeyboard(lang));
  }
}

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat?.id;
  if (typeof chatId !== 'number') return;
  // Private chats only. In a group the bot would answer every stray message.
  if (message.chat?.type !== 'private') return;

  const state = (await loadChat(chatId)) ?? newChatState(message.from?.language_code);
  const text = message.text?.trim();

  if (text?.startsWith('/')) {
    // "/start@BrifoAustriaBot" is what a command looks like in a group.
    await handleCommand(chatId, state, text.split(/\s+/)[0].split('@')[0].toLowerCase());
    return;
  }

  // Anything else — a photo, a question, a hello — gets the same answer: the
  // app is where Brifo works, and here is the button. Photos especially: this
  // is the one message where someone has actively tried to use the bot as the
  // app, and it has to send them somewhere rather than go quiet.
  await send(chatId, t(state.lang, 'nudge_open_app'), openAppKeyboard(state.lang));
}

async function handleCallback(query: NonNullable<TelegramUpdate['callback_query']>): Promise<void> {
  const chatId = query.message?.chat?.id;
  const data = query.data;
  // Always answered, even when ignored: an unanswered callback leaves a
  // spinner turning on the button forever.
  if (query.id) await tg('answerCallbackQuery', { callback_query_id: query.id }).catch(() => {});
  if (typeof chatId !== 'number' || !data?.startsWith('l:')) return;

  const code = data.slice(2);
  if (!isBotLang(code)) return;
  await saveChat(chatId, { lang: code });
  await send(chatId, t(code, 'lang_done'), openAppKeyboard(code));
}

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }
  if (update.message) await handleMessage(update.message);
}

/** True the first time this update_id is seen. Telegram re-delivers an update
 * it got no timely 200 for, which would otherwise double every reply. */
export async function claimUpdate(updateId: number): Promise<boolean> {
  return kvMarkSentOnce(`tg:update:${updateId}`, 60 * 60 * 6);
}
