// Deliberately self-contained: no imports from src/, no @anthropic-ai/sdk.
// Isolates this route from the project's ESM module graph and the SDK's
// subpath resolution, both implicated in prior cold-start crashes. Talks to
// the Anthropic API directly via the global fetch (Node 18+).

const MODEL = 'claude-opus-4-8';

// Kept in sync with src/lib/aiLanguage.ts on the client side.
const OUTPUT_LANGUAGE = {
  ar: 'simple Levantine-influenced Modern Standard Arabic',
  de: 'simple, clear German',
  tr: 'simple, clear Turkish',
  fa: 'simple, clear Persian (Farsi)',
  en: 'simple, clear English',
  uk: 'simple, clear Ukrainian',
};

function buildSystemPrompt(lang) {
  const target = OUTPUT_LANGUAGE[lang] || OUTPUT_LANGUAGE.ar;
  return (
    'You are a helpful assistant for immigrant families in Austria who may not read German well. ' +
    'The letter may be from a school, a doctor or clinic, an insurer, a government office, a landlord, ' +
    'a utility or any other sender — handle all of them the same way. ' +
    'Read this letter and respond with ONLY a JSON object (no markdown fences, no prose) ' +
    'shaped exactly like: {"summary": string, "action_required": boolean, "actions": string[], ' +
    '"deadlines": [{"date": "YYYY-MM-DD", "what": string}], "needs_reply": boolean, ' +
    '"urgency": "high" | "medium" | "low", "detected_child_name": string | null, ' +
    '"detected_child_class": string | null, "payments": [{"amount": number, "currency": string, ' +
    '"reason": string, "due_date": "YYYY-MM-DD"}]}. ' +
    'Capture EVERY appointment, deadline or due date you find in "deadlines" (for a medical or office ' +
    'appointment, "what" should say what the appointment is for and, if stated, with whom and where), ' +
    'and EVERY amount of money requested in "payments", in addition to listing them in "actions". ' +
    'If the letter mentions a specific child\'s name and/or class, extract them into ' +
    'detected_child_name/detected_child_class, otherwise use null. ' +
    `Write the summary and all text fields in ${target}.`
  );
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, hasKey: !!process.env.ANTHROPIC_API_KEY });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'server misconfigured: ANTHROPIC_API_KEY is not set' });
    return;
  }

  const { image, mediaType, lang } = req.body || {};
  if (!image || !mediaType) {
    res.status(400).json({ error: 'missing image or mediaType' });
    return;
  }
  if (mediaType !== 'image/jpeg' && mediaType !== 'image/png') {
    res.status(400).json({ error: 'unsupported media type' });
    return;
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: buildSystemPrompt(lang),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
              { type: 'text', text: 'Analyse this letter and return the result as JSON only.' },
            ],
          },
        ],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('[api/analyze] Anthropic API error:', anthropicRes.status, data);
      res.status(502).json({ error: 'anthropic api error', detail: data });
      return;
    }

    const text = (data.content && data.content[0] && data.content[0].text) || '';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      res.status(502).json({ error: 'model did not return valid JSON', raw: text });
      return;
    }

    // Normalize against LetterAnalysis's shape (src/types/analysis.ts) so a
    // field the model omits can't crash the frontend downstream (that's
    // exactly what happened when this route's response was missing `payments`).
    res.status(200).json({
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      action_required: !!parsed.action_required,
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : [],
      needs_reply: !!parsed.needs_reply,
      urgency: ['high', 'medium', 'low'].includes(parsed.urgency) ? parsed.urgency : 'low',
      detected_child_name: parsed.detected_child_name ?? null,
      detected_child_class: parsed.detected_child_class ?? null,
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
    });
  } catch (err) {
    console.error('[api/analyze] request failed:', err);
    res.status(500).json({ error: 'analysis failed', detail: err instanceof Error ? err.message : String(err) });
  }
};
