import type { IncomingMessage, ServerResponse } from 'node:http';
import { ConfigError } from '../src/server/errors.js';
import { claimUpdate, handleUpdate, telegramConfigured, type TelegramUpdate } from '../src/server/telegram.js';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

/** Telegram echoes the `secret_token` given to setWebhook back on every
 * delivery. Without checking it, anyone who guesses this URL — and it is not
 * a secret one — could make the bot analyse images and send messages on the
 * owner's API budget. Fails closed: an unset secret means the deployment was
 * never finished, and open is the wrong way to be wrong here. */
function isFromTelegram(req: VercelRequest): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    console.error('[api/telegram] TELEGRAM_WEBHOOK_SECRET is not set — refusing every update');
    return false;
  }
  return req.headers['x-telegram-bot-api-secret-token'] === expected;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // A plain browser visit, for checking a fresh deployment from a phone.
  // Booleans only — never the values.
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      hasBotToken: telegramConfigured(),
      hasWebhookSecret: !!process.env.TELEGRAM_WEBHOOK_SECRET,
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (!isFromTelegram(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const update = (req.body ?? {}) as TelegramUpdate;

  // Telegram retries any update it did not get a timely 200 for, and reading a
  // letter can take longer than it waits. Claiming the id first means a retry
  // is dropped here instead of paying for a second analysis.
  if (typeof update.update_id === 'number') {
    try {
      if (!(await claimUpdate(update.update_id))) {
        res.status(200).json({ ok: true, duplicate: true });
        return;
      }
    } catch (err) {
      // KV being unreachable must not take the bot down; the cost of a rare
      // double-analysis is lower than the cost of answering nobody.
      console.error('[api/telegram] could not claim update:', err);
    }
  }

  try {
    await handleUpdate(update);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[api/telegram] config error:', err.message);
    } else {
      console.error('[api/telegram] update handling failed:', err);
    }
  }

  // Always 200, even after a failure. The update id is already claimed, so a
  // Telegram retry would be dropped anyway — reporting an error would only buy
  // a burst of pointless redeliveries.
  res.status(200).json({ ok: true });
}
