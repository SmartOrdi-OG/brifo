import type { IncomingMessage, ServerResponse } from 'node:http';
import { saveCloudBackup, loadCloudBackup } from '../src/server/backup.js';
import { saveConsentRecord, saveSensitiveConsent } from '../src/server/consent.js';
import { getUserFromRequest } from '../src/server/auth.js';
import { eraseAccountData } from '../src/server/eraseAccount.js';

// Consolidates backup-sync/backup-restore/consent-accept into one function —
// see push.ts for why (Vercel's Hobby plan caps a deployment at 12
// serverless functions).
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

  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'not signed in' });
    return;
  }

  if (action === 'sync') {
    const { data } = (req.body ?? {}) as { data?: unknown };
    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'invalid data' });
      return;
    }
    if (JSON.stringify(data).length > MAX_PAYLOAD_CHARS) {
      res.status(413).json({ error: 'payload too large' });
      return;
    }
    try {
      await saveCloudBackup(user.id, data);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/backup:sync] failed:', err);
      res.status(500).json({ error: 'failed to save backup' });
    }
    return;
  }

  if (action === 'restore') {
    try {
      const backup = await loadCloudBackup(user.id);
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

  if (action === 'consent') {
    const body = (req.body ?? {}) as { kind?: unknown; version?: unknown; acceptedAt?: unknown; granted?: unknown; decidedAt?: unknown };

    // The separate Art. 9 consent (health and other sensitive data) and its
    // withdrawal travel on the same route as the policy acceptance — one more
    // function would cross the Hobby plan's function cap (see push.ts).
    if (body.kind === 'sensitive') {
      const { version, granted, decidedAt } = body;
      if (
        typeof version !== 'number' ||
        typeof granted !== 'boolean' ||
        typeof decidedAt !== 'string' ||
        Number.isNaN(Date.parse(decidedAt))
      ) {
        res.status(400).json({ error: 'invalid consent record' });
        return;
      }
      try {
        await saveSensitiveConsent(user.id, { email: user.email, version, granted, decidedAt, recordedAt: new Date().toISOString() });
        res.status(200).json({ ok: true });
      } catch (err) {
        console.error('[api/backup:consent] sensitive consent save failed:', err);
        res.status(500).json({ error: 'failed to save consent record' });
      }
      return;
    }

    const { version, acceptedAt } = body;
    if (typeof version !== 'number' || typeof acceptedAt !== 'string' || Number.isNaN(Date.parse(acceptedAt))) {
      res.status(400).json({ error: 'invalid consent record' });
      return;
    }
    try {
      await saveConsentRecord(user.id, { email: user.email, version, acceptedAt, recordedAt: new Date().toISOString() });
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/backup:consent] failed:', err);
      res.status(500).json({ error: 'failed to save consent record' });
    }
    return;
  }

  if (action === 'erase') {
    try {
      const result = await eraseAccountData(user.id);
      if (!result.ok && result.reason === 'not-configured') {
        console.error('[api/backup:erase] SUPABASE_SERVICE_ROLE_KEY is not set — refusing, nothing deleted');
        res.status(500).json({ error: 'server misconfigured' });
        return;
      }
      if (!result.ok) {
        // 409, not 403: nothing is wrong with the request or the caller — the
        // account is simply in a state that has to be resolved first, and the
        // screen turns this into "cancel your subscription, then come back".
        res.status(409).json({ error: result.reason });
        return;
      }
      console.log(`[api/backup:erase] removed ${result.deleted.length} keys and the login for a user on request`);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/backup:erase] failed:', err);
      res.status(500).json({ error: 'failed to erase data' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
