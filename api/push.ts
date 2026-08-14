import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  getVapidPublicKey,
  saveSubscription,
  removeSubscription,
  syncReminders,
  type PushSubscriptionInput,
  type ReminderEvent,
} from '../src/server/push.js';
import { ConfigError } from '../src/server/errors.js';

// Consolidates push-public-key/subscribe/unsubscribe/sync into one function —
// Vercel's Hobby plan caps a deployment at 12 serverless functions, and each
// file under api/ counts as one. vercel.json rewrites the old paths here
// with ?action=..., so no client code had to change.
interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

const MAX_EVENTS = 300;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidSubscription(value: unknown): value is PushSubscriptionInput {
  if (!value || typeof value !== 'object') return false;
  const sub = value as Record<string, unknown>;
  if (typeof sub.endpoint !== 'string' || !sub.keys || typeof sub.keys !== 'object') return false;
  const keys = sub.keys as Record<string, unknown>;
  return typeof keys.p256dh === 'string' && typeof keys.auth === 'string';
}

function isValidEvent(value: unknown): value is ReminderEvent {
  if (!value || typeof value !== 'object') return false;
  const ev = value as Record<string, unknown>;
  if (typeof ev.id !== 'string' || typeof ev.title !== 'string' || typeof ev.date !== 'string' || !DATE_RE.test(ev.date)) {
    return false;
  }
  return ev.time === undefined || (typeof ev.time === 'string' && TIME_RE.test(ev.time));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;

  if (action === 'public-key') {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'method not allowed' });
      return;
    }
    try {
      res.status(200).json({ publicKey: getVapidPublicKey() });
    } catch (err) {
      if (err instanceof ConfigError) {
        res.status(500).json({ error: `server misconfigured: ${err.message}` });
        return;
      }
      res.status(500).json({ error: 'unexpected error' });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (action === 'subscribe') {
    const { deviceId, subscription } = (req.body ?? {}) as { deviceId?: string; subscription?: unknown };
    if (!deviceId || typeof deviceId !== 'string') {
      res.status(400).json({ error: 'missing deviceId' });
      return;
    }
    if (!isValidSubscription(subscription)) {
      res.status(400).json({ error: 'invalid subscription' });
      return;
    }
    try {
      await saveSubscription(deviceId, subscription);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/push:subscribe] failed:', err);
      res.status(500).json({ error: 'failed to save subscription' });
    }
    return;
  }

  if (action === 'unsubscribe') {
    const { deviceId } = (req.body ?? {}) as { deviceId?: string };
    if (!deviceId || typeof deviceId !== 'string') {
      res.status(400).json({ error: 'missing deviceId' });
      return;
    }
    try {
      await removeSubscription(deviceId);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/push:unsubscribe] failed:', err);
      res.status(500).json({ error: 'failed to remove subscription' });
    }
    return;
  }

  if (action === 'sync') {
    const { deviceId, events, offsets, lang } = (req.body ?? {}) as {
      deviceId?: string;
      events?: unknown;
      offsets?: unknown;
      lang?: unknown;
    };
    if (!deviceId || typeof deviceId !== 'string') {
      res.status(400).json({ error: 'missing deviceId' });
      return;
    }
    if (!Array.isArray(events) || events.length > MAX_EVENTS || !events.every(isValidEvent)) {
      res.status(400).json({ error: 'invalid events' });
      return;
    }
    if (!Array.isArray(offsets) || !offsets.every((n) => typeof n === 'number' && n >= 0 && n <= 10080)) {
      res.status(400).json({ error: 'invalid offsets' });
      return;
    }
    try {
      await syncReminders(deviceId, events, offsets, lang === 'de' ? 'de' : lang === 'tr' ? 'tr' : 'ar');
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/push:sync] failed:', err);
      res.status(500).json({ error: 'failed to sync reminders' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
