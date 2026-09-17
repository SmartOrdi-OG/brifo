/** Brifo as a Telegram bot: photograph a German letter, get it explained in
 * your own language, get the dates saved, and get a formal German reply
 * written for you — the same four things the app does, without installing
 * anything.
 *
 * Why a bot and not a Mini App: reminders. On the web the app needs an
 * installed PWA and a granted notification permission before a reminder can
 * ever reach a closed phone, and on iOS most people never get that far. A bot
 * just sends a message. That is also why the daily cron (api/cron/
 * send-reminders.ts) now drives both paths.
 *
 * Trust boundary: everything on a Telegram update is attacker-controlled —
 * anyone can message a public bot. Nothing here is interpolated into a shell,
 * a query or a prompt without escaping, and the model's own output is HTML-
 * escaped before it goes back out (see escapeHtml). */

import { ConfigError } from './errors.js';
import { kvGet, kvSet, kvDel, kvSadd, kvSrem, kvSmembers, kvMarkSentOnce } from './kv.js';
import { eventAnchorUtcMs, viennaToday, reminderBody, type ReminderEvent } from './push.js';
import { generateReplyLetter, ReplyError, type ReplyIntent } from './reply.js';
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

/** Thrown when Telegram itself rejects a call. `code` is its HTTP status —
 * 403 specifically means the user blocked the bot or deleted the chat, which
 * is the signal to stop sending them reminders. */
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

/** Telegram rejects anything over 4096 characters, and a long letter plus its
 * translation goes past that easily. Split on paragraph boundaries where
 * possible so a message never breaks mid-sentence. */
const MAX_MESSAGE = 3500;

function splitForTelegram(text: string): string[] {
  if (text.length <= MAX_MESSAGE) return [text];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > MAX_MESSAGE) {
    const window = rest.slice(0, MAX_MESSAGE);
    const cut = Math.max(window.lastIndexOf('\n\n'), window.lastIndexOf('\n'));
    const at = cut > MAX_MESSAGE / 2 ? cut : MAX_MESSAGE;
    chunks.push(rest.slice(0, at).trimEnd());
    rest = rest.slice(at).trimStart();
  }
  if (rest) chunks.push(rest);
  return chunks;
}

/** A `web_app` button launches the Mini App (the full Brifo web app) inside
 * Telegram; a `callback_data` one comes back to this webhook. */
type InlineButton = { text: string } & ({ callback_data: string } | { web_app: { url: string } });

interface InlineKeyboard {
  inline_keyboard: InlineButton[][];
}

async function send(chatId: number, html: string, keyboard?: InlineKeyboard): Promise<void> {
  const chunks = splitForTelegram(html);
  for (let i = 0; i < chunks.length; i++) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: chunks[i],
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true },
      // Buttons belong on the last chunk only, or they scroll away mid-letter.
      ...(keyboard && i === chunks.length - 1 ? { reply_markup: keyboard } : {}),
    });
  }
}

/** Best-effort send: used where failing to deliver a status line must not
 * abort the work that follows (or, for reminders, the other recipients). */
async function trySend(chatId: number, html: string, keyboard?: InlineKeyboard): Promise<void> {
  try {
    await send(chatId, html, keyboard);
  } catch (err) {
    console.error(`[telegram] send to ${chatId} failed:`, err);
  }
}

/** Telegram's HTML parse mode. Model output and letter text both reach the
 * user through here, and either can legitimately contain `<`, `>` or `&`. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// Per-chat state
// ---------------------------------------------------------------------------

const CHATS_SET = 'tg:chats';
const chatKey = (chatId: number) => `tg:chat:${chatId}`;
const sentKey = (chatId: number, eventId: string, offsetMin: number) => `tg:sent:${chatId}:${eventId}:${offsetMin}`;

/** What the bot remembers about the last letter, so a reply can be written
 * against it without asking the user to retype anything. Only the fields the
 * reply prompt actually consumes are kept — not the photo, and not the full
 * analysis. */
interface StoredLetter {
  summary: string;
  sender: string | null;
  childName: string | null;
  childClass: string | null;
}

interface ChatState {
  lang: BotLang;
  events: ReminderEvent[];
  lastLetter?: StoredLetter;
  /** Set while the bot is waiting for the user to type the details of a reply;
   * the next plain-text message is those details. */
  awaitingReplyIntent?: ReplyIntent;
  /** Scans used today (Vienna date), for the abuse ceiling below. */
  usage?: { date: string; scans: number };
  /** "Send it as a file for better quality" is worth saying once. Repeating it
   * under every single photo would just train people to ignore it. */
  toldAboutFileQuality?: boolean;
}

/** A public bot is an open door to a paid model API, so there is a ceiling per
 * chat per day. It is a cost guard, not a price: generous enough that a parent
 * working through a stack of post never notices it. */
function dailyScanLimit(): number {
  const raw = Number(process.env.TELEGRAM_DAILY_SCAN_LIMIT);
  return Number.isFinite(raw) && raw > 0 ? raw : 10;
}

/** Keeps a runaway chat from growing its KV entry without bound. */
const MAX_STORED_EVENTS = 60;

async function loadChat(chatId: number): Promise<ChatState | null> {
  return kvGet<ChatState>(chatKey(chatId));
}

async function saveChat(chatId: number, state: ChatState): Promise<void> {
  await kvSet(chatKey(chatId), state);
  await kvSadd(CHATS_SET, String(chatId));
}

async function forgetChat(chatId: number): Promise<void> {
  await kvDel(chatKey(chatId));
  await kvSrem(CHATS_SET, String(chatId));
}

// ---------------------------------------------------------------------------
// Letter analysis
// ---------------------------------------------------------------------------

interface LetterDeadline {
  date: string;
  what: string;
}

interface LetterPayment {
  amount: number;
  currency: string;
  reason: string;
  due_date: string;
}

interface LetterAnalysis {
  summary: string;
  sender: string | null;
  action_required: boolean;
  actions: string[];
  deadlines: LetterDeadline[];
  needs_reply: boolean;
  urgency: 'high' | 'medium' | 'low';
  detected_child_name: string | null;
  detected_child_class: string | null;
  payments: LetterPayment[];
}

/** Where /api/analyze lives. Set PUBLIC_BASE_URL to the real domain in
 * production: VERCEL_URL points at the deployment-specific hostname, which is
 * behind Vercel's deployment protection on some accounts. */
function appBaseUrl(): string {
  const explicit = process.env.PUBLIC_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:5173';
}

class AnalysisFailed extends Error {}

/** Calls the app's own /api/analyze over HTTP rather than re-implementing it.
 *
 * That route is deliberately self-contained — CommonJS, no imports from src/,
 * no SDK — because importing shared modules there caused cold-start crashes,
 * so its prompt cannot simply be imported from here. Copying the prompt into
 * this file is the alternative, and prompt drift between two copies is exactly
 * the bug that had the reply assistant still writing to schools after the
 * analyzer had been taught about doctors and offices. One HTTP hop buys the
 * guarantee that the bot and the app always read a letter the same way. */
async function analyzeLetter(imageBase64: string, mediaType: string, lang: BotLang): Promise<LetterAnalysis> {
  let res: Response;
  try {
    res = await fetch(`${appBaseUrl()}/api/analyze`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, mediaType, lang }),
      signal: AbortSignal.timeout(45000),
    });
  } catch (err) {
    console.error('[telegram] /api/analyze unreachable:', err);
    throw new AnalysisFailed('unreachable');
  }
  if (!res.ok) {
    console.error(`[telegram] /api/analyze returned ${res.status}:`, await res.text().catch(() => ''));
    // 502 is the route's own "the model did not return usable JSON", which in
    // practice means the photo was not readable — worth saying so specifically.
    throw new AnalysisFailed(res.status === 502 ? 'unreadable' : 'generic');
  }
  return (await res.json()) as LetterAnalysis;
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------

/** 26 hours, matching REMINDER_LEAD_MINUTES in src/lib/reminders.ts — and for
 * the same reason: the cron runs once a day at 08:00 Vienna, letters carry
 * dates without times (so they anchor to 08:00 too), and a 24h lead would put
 * the due moment on the cron's own clock minute, where one early run collapses
 * a day's notice into none. The constant is repeated rather than imported
 * because src/lib is ESM browser code and this tree compiles as CommonJS;
 * changing one means changing the other. */
const REMINDER_LEAD_MINUTES = 26 * 60;

/** Stable across re-scans of the same letter, so sending a photo twice does
 * not produce two reminders for one appointment. */
function eventId(date: string, what: string): string {
  let hash = 0;
  const source = `${date}|${what}`;
  for (let i = 0; i < source.length; i++) hash = (Math.imul(hash, 31) + source.charCodeAt(i)) | 0;
  return `${date}-${(hash >>> 0).toString(36)}`;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Folds a letter's dates into the chat's reminder list: drops anything in the
 * past, de-duplicates by id, and caps the total. Returns how many are new. */
function mergeEvents(state: ChatState, incoming: ReminderEvent[], today: string): number {
  const byId = new Map(state.events.map((e) => [e.id, e]));
  let added = 0;
  for (const event of incoming) {
    if (byId.has(event.id)) continue;
    byId.set(event.id, event);
    added++;
  }
  state.events = [...byId.values()]
    .filter((e) => ISO_DATE.test(e.date) && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, MAX_STORED_EVENTS);
  return added;
}

function eventsFromAnalysis(analysis: LetterAnalysis): ReminderEvent[] {
  const fromDeadlines = analysis.deadlines
    .filter((d) => typeof d?.date === 'string' && ISO_DATE.test(d.date) && typeof d?.what === 'string')
    .map((d) => ({ id: eventId(d.date, d.what), title: d.what, date: d.date }));
  const fromPayments = analysis.payments
    .filter((p) => typeof p?.due_date === 'string' && ISO_DATE.test(p.due_date) && typeof p?.reason === 'string')
    .map((p) => ({ id: eventId(p.due_date, p.reason), title: p.reason, date: p.due_date }));
  return [...fromDeadlines, ...fromPayments];
}

export interface TelegramReminderResult {
  checked: number;
  sent: number;
  removed: number;
}

/** The Telegram half of the daily reminder run. Mirrors runDueReminders() in
 * push.ts — same due-window arithmetic, same claim-before-send dedupe, same
 * wording (reminderBody) — but delivers a chat message instead of a web push,
 * which is what makes it work on a phone that never installed anything. */
export async function runDueTelegramReminders(windowMinutes: number): Promise<TelegramReminderResult> {
  const chatIds = await kvSmembers(CHATS_SET);
  const now = Date.now();
  let checked = 0;
  let sent = 0;
  let removed = 0;

  for (const rawId of chatIds) {
    const chatId = Number(rawId);
    if (!Number.isFinite(chatId)) continue;
    const state = await loadChat(chatId);
    if (!state) {
      // Set membership outlived the state — tidy it up rather than re-reading
      // a missing key on every daily run from now on.
      await kvSrem(CHATS_SET, rawId);
      continue;
    }

    for (const event of state.events) {
      checked++;
      const anchor = eventAnchorUtcMs(event.date, event.time);
      const fireAt = anchor - REMINDER_LEAD_MINUTES * 60000;
      if (fireAt > now || fireAt < now - windowMinutes * 60000) continue;

      const claimKey = sentKey(chatId, event.id, REMINDER_LEAD_MINUTES);
      const claimed = await kvMarkSentOnce(claimKey, 60 * 60 * 24 * 14);
      if (!claimed) continue;

      const minutesLeft = Math.round((anchor - now) / 60000);
      if (minutesLeft < 0) continue; // already happened — sending now would only confuse

      const body = reminderBody(event.date, minutesLeft, state.lang, now);
      try {
        await send(chatId, `🔔 <b>${escapeHtml(body)}</b>\n\n${escapeHtml(event.title)}\n📅 ${event.date}`);
        sent++;
      } catch (err) {
        if (err instanceof TelegramApiError && err.code === 403) {
          // Blocked or chat deleted: stop for good, and stop claiming sends.
          await forgetChat(chatId);
          removed++;
          break;
        }
        // Transient: release the claim so tomorrow's run tries again rather
        // than treating it as delivered for the next fortnight.
        await kvDel(claimKey);
        console.error(`[telegram] reminder to ${chatId} failed:`, err);
      }
    }
  }

  return { checked, sent, removed };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function formatAnalysis(analysis: LetterAnalysis, lang: BotLang): string {
  const lines: string[] = [];
  lines.push(`<b>${escapeHtml(t(lang, `urgency_${analysis.urgency}`))}</b>`);
  lines.push('');
  lines.push(escapeHtml(analysis.summary));

  if (analysis.sender) {
    lines.push('');
    lines.push(`${t(lang, 'label_sender')}: ${escapeHtml(analysis.sender)}`);
  }

  if (analysis.actions.length > 0) {
    lines.push('');
    lines.push(`<b>${t(lang, 'label_actions')}</b>`);
    for (const action of analysis.actions) lines.push(`• ${escapeHtml(String(action))}`);
  }

  if (analysis.deadlines.length > 0) {
    lines.push('');
    lines.push(`<b>${t(lang, 'label_deadlines')}</b>`);
    for (const d of analysis.deadlines) lines.push(`• ${escapeHtml(d.date)} — ${escapeHtml(d.what)}`);
  }

  if (analysis.payments.length > 0) {
    lines.push('');
    lines.push(`<b>${t(lang, 'label_payments')}</b>`);
    for (const p of analysis.payments) {
      lines.push(`• ${escapeHtml(`${p.amount} ${p.currency}`)} — ${escapeHtml(p.reason)} (${escapeHtml(p.due_date)})`);
    }
  }

  return lines.join('\n');
}

const INTENTS: ReplyIntent[] = [
  'entschuldigung',
  'termin',
  'absage',
  'zustimmung',
  'ratenzahlung',
  'einspruch',
  'frage',
];

function intentKeyboard(lang: BotLang): InlineKeyboard {
  return {
    inline_keyboard: [
      ...INTENTS.map((intent) => [{ text: t(lang, `intent_${intent}`), callback_data: `i:${intent}` }]),
      [{ text: t(lang, 'btn_cancel'), callback_data: 'x' }],
    ],
  };
}

/** The Mini App button, when there is somewhere real to point it.
 *
 * Telegram only accepts an https URL here, so a local or unset base URL yields
 * no button rather than one that errors when tapped. */
function openAppButton(lang: BotLang): InlineButton[] | null {
  const url = appBaseUrl();
  if (!url.startsWith('https://')) return null;
  return [{ text: t(lang, 'btn_open_app'), web_app: { url } }];
}

function languageKeyboard(lang: BotLang): InlineKeyboard {
  const openApp = openAppButton(lang);
  return {
    inline_keyboard: [
      ...BOT_LANGS.map((code) => [{ text: LANG_NAMES[code], callback_data: `l:${code}` }]),
      ...(openApp ? [openApp] : []),
    ],
  };
}

function replyButton(lang: BotLang): InlineKeyboard {
  return { inline_keyboard: [[{ text: t(lang, 'btn_reply'), callback_data: 'r' }]] };
}

// ---------------------------------------------------------------------------
// Update handling
// ---------------------------------------------------------------------------

interface TelegramPhotoSize {
  file_id: string;
  file_size?: number;
  width?: number;
}

interface TelegramMessage {
  chat?: { id?: number; type?: string };
  from?: { language_code?: string };
  text?: string;
  photo?: TelegramPhotoSize[];
  document?: { file_id?: string; mime_type?: string; file_size?: number };
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

/** Anthropic caps an image at 5 MB, which is ~3.7 MB before base64. Telegram's
 * own compressed photos are far below this; only an uncompressed document
 * upload can hit it, and for those the honest fix is to send it as a photo. */
const MAX_IMAGE_BYTES = 3_500_000;

async function downloadTelegramFile(fileId: string): Promise<{ base64: string; mediaType: string }> {
  const file = await tg<{ file_path?: string; file_size?: number }>('getFile', { file_id: fileId });
  if (!file.file_path) throw new AnalysisFailed('generic');
  if (file.file_size && file.file_size > MAX_IMAGE_BYTES) throw new AnalysisFailed('too_big');

  const res = await fetch(`https://api.telegram.org/file/bot${botToken()}/${file.file_path}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new AnalysisFailed('generic');
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new AnalysisFailed('too_big');

  const mediaType = file.file_path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  return { base64: buffer.toString('base64'), mediaType };
}

function newChatState(languageCode: unknown): ChatState {
  return { lang: langFromTelegramCode(languageCode), events: [] };
}

async function handlePhoto(chatId: number, state: ChatState, fileId: string): Promise<void> {
  const lang = state.lang;
  const today = viennaToday(Date.now());

  const usage = state.usage?.date === today ? state.usage : { date: today, scans: 0 };
  if (usage.scans >= dailyScanLimit()) {
    await send(chatId, escapeHtml(t(lang, 'err_limit')));
    return;
  }

  await trySend(chatId, escapeHtml(t(lang, 'reading')));

  let analysis: LetterAnalysis;
  try {
    const { base64, mediaType } = await downloadTelegramFile(fileId);
    analysis = await analyzeLetter(base64, mediaType, lang);
  } catch (err) {
    if (err instanceof AnalysisFailed) {
      const key =
        err.message === 'too_big' ? 'err_too_big' : err.message === 'unreadable' ? 'err_unreadable' : 'err_generic';
      await send(chatId, escapeHtml(t(lang, key)));
      return;
    }
    console.error('[telegram] analysis failed:', err);
    await send(chatId, escapeHtml(t(lang, 'err_generic')));
    return;
  }

  // Counted only once the work actually happened — a failed read should not
  // burn someone's daily allowance.
  usage.scans++;
  state.usage = usage;
  state.lastLetter = {
    summary: analysis.summary.slice(0, 2000),
    sender: analysis.sender ?? null,
    childName: analysis.detected_child_name ?? null,
    childClass: analysis.detected_child_class ?? null,
  };
  const added = mergeEvents(state, eventsFromAnalysis(analysis), today);
  await saveChat(chatId, state);

  let body = formatAnalysis(analysis, lang);
  if (added > 0) body += `\n\n${escapeHtml(t(lang, 'saved_reminders'))}`;
  await send(chatId, body, replyButton(lang));
}

async function handleReplyDetails(chatId: number, state: ChatState, details: string): Promise<void> {
  const lang = state.lang;
  const intent = state.awaitingReplyIntent;
  if (!intent) return;

  // Too short for generateReplyLetter's own schema to accept. Re-ask instead of
  // reporting a failure, and stay in the flow so the next message is the retry.
  if (details.length < 3) {
    await send(chatId, escapeHtml(t(lang, 'reply_ask_details')));
    return;
  }

  // Cleared before the call, not after: if this invocation dies mid-flight
  // (timeout, cold-start kill), a stuck flag would turn the user's next
  // unrelated message into a letter.
  state.awaitingReplyIntent = undefined;
  await saveChat(chatId, state);

  await trySend(chatId, escapeHtml(t(lang, 'reply_writing')));

  let letter: { german: string; translation: string };
  try {
    letter = await generateReplyLetter({
      intent,
      recipient: state.lastLetter?.sender ?? undefined,
      letterContext: state.lastLetter?.summary ?? undefined,
      childName: state.lastLetter?.childName ?? undefined,
      childClass: state.lastLetter?.childClass ?? undefined,
      details: details.slice(0, 2000),
      lang,
    });
  } catch (err) {
    console.error('[telegram] reply generation failed:', err);
    if (err instanceof ReplyError) {
      // Bad input, not a broken server: re-open the flow so the re-worded
      // details the user sends next are still treated as this letter's.
      state.awaitingReplyIntent = intent;
      await saveChat(chatId, state);
      await send(chatId, escapeHtml(t(lang, 'reply_ask_details')));
      return;
    }
    await send(chatId, escapeHtml(t(lang, 'err_generic')));
    return;
  }

  await send(
    chatId,
    `<b>${t(lang, 'reply_german')}</b>\n\n<pre>${escapeHtml(letter.german)}</pre>`,
  );
  await send(chatId, `<b>${t(lang, 'reply_translation')}</b>\n\n${escapeHtml(letter.translation)}`);
}

async function handleCommand(chatId: number, state: ChatState, command: string): Promise<void> {
  const lang = state.lang;

  switch (command) {
    case '/start':
      await saveChat(chatId, state);
      await send(
        chatId,
        `<b>${escapeHtml(t(lang, 'welcome_title'))}</b>\n\n${escapeHtml(t(lang, 'welcome_body'))}`,
        languageKeyboard(lang),
      );
      return;

    case '/help':
      await send(chatId, escapeHtml(t(lang, 'help')));
      return;

    case '/lang':
      await send(chatId, escapeHtml(t(lang, 'lang_prompt')), languageKeyboard(lang));
      return;

    case '/app': {
      const openApp = openAppButton(lang);
      // No Mini App to open (unset or non-https base URL): say what the bot
      // can do instead of sending an empty message.
      if (!openApp) {
        await send(chatId, escapeHtml(t(lang, 'hint_send_photo')));
        return;
      }
      await send(chatId, escapeHtml(t(lang, 'open_app_body')), { inline_keyboard: [openApp] });
      return;
    }

    case '/cancel':
      state.awaitingReplyIntent = undefined;
      await saveChat(chatId, state);
      await send(chatId, escapeHtml(t(lang, 'reply_cancelled')));
      return;

    case '/mawaid': {
      const today = viennaToday(Date.now());
      const upcoming = state.events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
      if (upcoming.length === 0) {
        await send(chatId, escapeHtml(t(lang, 'appts_empty')));
        return;
      }
      const lines = upcoming.map((e) => `• ${escapeHtml(e.date)} — ${escapeHtml(e.title)}`);
      await send(chatId, `<b>${t(lang, 'appts_title')}</b>\n\n${lines.join('\n')}`);
      return;
    }

    case '/clear':
      state.events = [];
      await saveChat(chatId, state);
      await send(chatId, escapeHtml(t(lang, 'appts_cleared')));
      return;

    default:
      await send(chatId, escapeHtml(t(lang, 'hint_send_photo')));
  }
}

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat?.id;
  if (typeof chatId !== 'number') return;
  // Private chats only. In a group the bot would answer every photo anyone
  // posts, and a letter from the Magistrat is not group material.
  if (message.chat?.type !== 'private') return;

  const state = (await loadChat(chatId)) ?? newChatState(message.from?.language_code);

  const document = message.document;
  if (document?.file_id) {
    const mime = document.mime_type ?? '';
    if (mime !== 'image/jpeg' && mime !== 'image/png') {
      await send(chatId, escapeHtml(t(state.lang, 'err_unsupported')));
      return;
    }
    await handlePhoto(chatId, state, document.file_id);
    return;
  }

  if (message.photo && message.photo.length > 0) {
    // Telegram sends an ascending ladder of sizes; the last is the largest it
    // kept, and dense German print needs every pixel available.
    const largest = message.photo[message.photo.length - 1];
    await handlePhoto(chatId, state, largest.file_id);
    if (!state.toldAboutFileQuality) {
      state.toldAboutFileQuality = true;
      await saveChat(chatId, state);
      await trySend(chatId, escapeHtml(t(state.lang, 'hint_send_as_file')));
    }
    return;
  }

  const text = message.text?.trim();
  if (!text) return;

  if (text.startsWith('/')) {
    // "/start@BrifoBot" is what a command looks like when the bot is in a group.
    const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();
    await handleCommand(chatId, state, command);
    return;
  }

  if (state.awaitingReplyIntent) {
    await handleReplyDetails(chatId, state, text);
    return;
  }

  await send(chatId, escapeHtml(t(state.lang, 'hint_send_photo')));
}

async function handleCallback(query: NonNullable<TelegramUpdate['callback_query']>): Promise<void> {
  const chatId = query.message?.chat?.id;
  const data = query.data;
  // Always answered, even when ignored: an unanswered callback leaves a
  // spinner turning on the button forever.
  if (query.id) await tg('answerCallbackQuery', { callback_query_id: query.id }).catch(() => {});
  if (typeof chatId !== 'number' || !data) return;

  const state = (await loadChat(chatId)) ?? newChatState(query.from?.language_code);

  if (data.startsWith('l:')) {
    const code = data.slice(2);
    if (!isBotLang(code)) return;
    state.lang = code;
    await saveChat(chatId, state);
    await send(chatId, escapeHtml(t(code, 'lang_done')));
    return;
  }

  if (data === 'r') {
    if (!state.lastLetter) {
      await send(chatId, escapeHtml(t(state.lang, 'reply_no_letter')));
      return;
    }
    await send(chatId, escapeHtml(t(state.lang, 'reply_pick_intent')), intentKeyboard(state.lang));
    return;
  }

  if (data.startsWith('i:')) {
    const intent = data.slice(2) as ReplyIntent;
    if (!INTENTS.includes(intent)) return;
    state.awaitingReplyIntent = intent;
    await saveChat(chatId, state);
    await send(chatId, escapeHtml(t(state.lang, 'reply_ask_details')));
    return;
  }

  if (data === 'x') {
    state.awaitingReplyIntent = undefined;
    await saveChat(chatId, state);
    await send(chatId, escapeHtml(t(state.lang, 'reply_cancelled')));
  }
}

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return;
  }
  if (update.message) await handleMessage(update.message);
}

/** True the first time this update_id is seen. Telegram re-delivers an update
 * it got no timely 200 for, and reading a letter can outlast its patience —
 * without this, one slow photo becomes two analyses and two charges. */
export async function claimUpdate(updateId: number): Promise<boolean> {
  return kvMarkSentOnce(`tg:update:${updateId}`, 60 * 60 * 6);
}
