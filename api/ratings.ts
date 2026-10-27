import type { IncomingMessage, ServerResponse } from 'node:http';
import { submitRating, listRatings } from '../src/server/ratings.js';
import { authorizeAdmin, adminAuthStatus } from '../src/server/adminAuth.js';

// Consolidates rating-submit/admin-ratings into one function — see push.ts
// for why (Vercel's Hobby plan caps a deployment at 12 serverless functions).
interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

const MAX_COMMENT_LENGTH = 2000;

// The password check, the attempt ceiling and the constant-time comparison
// live in src/server/adminAuth.ts, shared with api/errors.ts.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (action === 'submit') {
    const { stars, comment, lang } = (req.body ?? {}) as { stars?: unknown; comment?: unknown; lang?: unknown };
    if (typeof stars !== 'number' || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      res.status(400).json({ error: 'invalid stars' });
      return;
    }
    const safeComment = typeof comment === 'string' ? comment.slice(0, MAX_COMMENT_LENGTH) : '';
    try {
      await submitRating(stars, safeComment, lang === 'de' ? 'de' : lang === 'tr' ? 'tr' : lang === 'fa' ? 'fa' : lang === 'en' ? 'en' : lang === 'uk' ? 'uk' : 'ar');
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[api/ratings:submit] failed:', err);
      res.status(500).json({ error: 'failed to submit rating' });
    }
    return;
  }

  if (action === 'list') {
    // The password travels in the body, not a query string, so it doesn't
    // end up in server logs or browser history.
    const { secret } = (req.body ?? {}) as { secret?: unknown };
    const auth = await authorizeAdmin(secret, req.headers);
    if (auth !== 'ok') {
      res.status(adminAuthStatus(auth)).json({
        error: auth === 'rate-limited' ? 'too many attempts' : 'unauthorized',
      });
      return;
    }
    try {
      const ratings = await listRatings();
      res.status(200).json({ ratings });
    } catch (err) {
      console.error('[api/ratings:list] failed:', err);
      res.status(500).json({ error: 'failed to load ratings' });
    }
    return;
  }

  res.status(400).json({ error: 'unknown action' });
}
