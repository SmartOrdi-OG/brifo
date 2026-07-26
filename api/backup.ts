import type { IncomingMessage, ServerResponse } from 'node:http';
import { saveCloudBackup, loadCloudBackup, isValidRecoveryCode } from '../src/server/backup.js';

// Consolidates backup-sync/backup-restore into one function — see push.ts
// for why (Vercel's Hobby plan caps a deployment at 12 serverless functions).
interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

// Family data (children, letters, payments, events, todos) stays well under
// this — it's just a guard against an abusive/malformed payload.
const MAX_PAYLOAD_CHARS = 2_000_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (action === 'sync') {
    const { code, data } = (req.body ?? {}) as { code?: unknown; data?: unknown };
    if (!isValidRecoveryCode(code)) {
      res.status(400).json({ error: 'invalid code' });
      return;
    }
    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'invalid data' });
      return;
    }
    if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) {
      res.status(413).json({ error: 'payload too large' });
      return;
    }
    try {
      await saveCloudBackup(code, data);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/backup:sync] failed:', err);
      res.status(500).json({ error: 'failed to save backup' });
    }
    return;
  }

  if (action === 'restore') {
    // The code is a bearer secret (whoever has it gets the family's data), so
    // it travels in the body rather than a query string / URL.
    const { code } = (req.body ?? {}) as { code?: unknown };
    if (!isValidRecoveryCode(code)) {
      res.status(400).json({ error: 'invalid code' });
      return;
    }
    try {
      const backup = await loadCloudBackup(code);
      if (!backup) {
        res.status(404).json({ error: 'not found' });
        return;
      }
      res.status(200).json(backup);
    } catch (err) {
      console.error('[api/backup:restore] failed:', err);
      res.status(500).json({ error: 'failed to load backup' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
