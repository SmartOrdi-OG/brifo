import type { IncomingMessage, ServerResponse } from 'node:http';
import { recordAppError, listAppErrors, clearAppErrors } from '../src/server/appErrors.js';
import { checkConfig } from '../src/server/configCheck.js';
import { authorizeAdmin, adminAuthStatus, type AdminAuthResult } from '../src/server/adminAuth.js';

// report/list/clear/config in one function — see push.ts for why (Vercel's
// Hobby plan caps a deployment at 12 serverless functions, and each file under
// api/ counts as one). vercel.json rewrites the four paths here with
// ?action=... The config check shares this function rather than taking a slot
// of its own: it is admin-gated diagnostics, same as the error log, and at 10
// of 12 functions a whole file for one read is not worth the headroom.
interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

// The password check, the attempt ceiling and the constant-time comparison
// all live in src/server/adminAuth.ts, shared with api/ratings.ts — two
// copies of a security check is one copy that gets updated.
async function refuse(res: VercelResponse, result: Exclude<AdminAuthResult, 'ok'>): Promise<void> {
  res.status(adminAuthStatus(result)).json({
    error: result === 'rate-limited' ? 'too many attempts' : 'unauthorized',
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (action === 'report') {
    // No token. A fault can happen before anyone is signed in — or because
    // signing in is what is broken — and a report that needs a session would
    // miss exactly the failures worth hearing about. The daily ceiling in
    // appErrors.ts is what bounds it instead.
    const { message, stack, route, lang, platform, appVersion } = (req.body ?? {}) as Record<string, unknown>;
    if (typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'missing message' });
      return;
    }
    try {
      const outcome = await recordAppError({
        message,
        stack: typeof stack === 'string' ? stack : null,
        route: typeof route === 'string' ? route : null,
        lang: typeof lang === 'string' ? lang : null,
        platform: typeof platform === 'string' ? platform : null,
        appVersion: typeof appVersion === 'string' ? appVersion : null,
      });
      res.status(200).json({ ok: true, outcome });
    } catch (err) {
      // Never surfaced to the user: the app is already in a bad state if it
      // got here, and a failed report must not become a second failure.
      console.error('[api/errors:report] failed:', err);
      res.status(200).json({ ok: false });
    }
    return;
  }

  // The password travels in the body, not the query string, so it stays out
  // of server logs and browser history.
  const { secret } = (req.body ?? {}) as { secret?: unknown };

  if (action === 'list') {
    const auth = await authorizeAdmin(secret, req.headers);
    if (auth !== 'ok') {
      await refuse(res, auth);
      return;
    }
    try {
      res.status(200).json({ errors: await listAppErrors() });
    } catch (err) {
      console.error('[api/errors:list] failed:', err);
      res.status(500).json({ error: 'failed to load errors' });
    }
    return;
  }

  if (action === 'config') {
    const auth = await authorizeAdmin(secret, req.headers);
    if (auth !== 'ok') {
      await refuse(res, auth);
      return;
    }
    try {
      res.status(200).json({ checks: await checkConfig() });
    } catch (err) {
      console.error('[api/errors:config] failed:', err);
      res.status(500).json({ error: 'failed to check config' });
    }
    return;
  }

  if (action === 'clear') {
    const auth = await authorizeAdmin(secret, req.headers);
    if (auth !== 'ok') {
      await refuse(res, auth);
      return;
    }
    try {
      res.status(200).json({ ok: true, cleared: await clearAppErrors() });
    } catch (err) {
      console.error('[api/errors:clear] failed:', err);
      res.status(500).json({ error: 'failed to clear errors' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
