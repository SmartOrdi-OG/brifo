import type { IncomingMessage, ServerResponse } from 'node:http';
import { generateReplyLetter, ReplyError } from '../src/server/reply.js';
import { checkEntitlement } from '../src/server/entitlement.js';
import { ConfigError } from '../src/server/errors.js';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  // Same gate as /api/analyze, and for the same reason: this route spends
  // money at Anthropic on every call, and PremiumGate only governs the screen.
  const entitlement = await checkEntitlement(req, 'reply');
  if (!entitlement.ok) {
    res.status(entitlement.failure.status).json({ error: entitlement.failure.error });
    return;
  }

  try {
    const result = await generateReplyLetter(req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error('[api/reply] config error:', err.message);
      res.status(500).json({ error: `server misconfigured: ${err.message}` });
      return;
    }
    if (err instanceof ReplyError) {
      res.status(400).json({ error: err.message });
      return;
    }
    // No `detail` in the response: it echoed the upstream error message to
    // the caller, which is server internals leaking through a public route.
    console.error('[api/reply] reply generation failed:', err);
    res.status(500).json({ error: 'reply generation failed' });
  }
}
