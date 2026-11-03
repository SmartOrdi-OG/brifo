/** The privacy policy (v6) and the claims it makes about the code.
 *
 * The v5 text promised that letter photos were "never stored", that Anthropic
 * did not keep them, and that Vercel held the server data in the EU — none of
 * it matched the code. These tests pin the corrected statements and, for the
 * two that are about code (what goes to Anthropic, what goes to the logs),
 * check the code itself. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  PRIVACY_POLICY_VERSION,
  privacyPolicyDe,
  privacyPolicyAr,
  privacyPolicyTr,
  privacyPolicyFa,
  privacyPolicyEn,
  privacyPolicyUk,
} from '../src/data/privacyPolicy';
import { translations } from '../src/context/translations';

const text = (sections: { heading: string; body: string }[]) => sections.map((s) => `${s.heading}\n${s.body}`).join('\n');
const TRANSLATED = { ar: privacyPolicyAr, tr: privacyPolicyTr, fa: privacyPolicyFa, en: privacyPolicyEn, uk: privacyPolicyUk };

describe('the policy text', () => {
  it('is version 6, so everyone is asked to agree again', () => {
    expect(PRIVACY_POLICY_VERSION).toBe(6);
  });

  it('says in German what the code does', () => {
    const de = text(privacyPolicyDe);
    for (const fact of [
      'Steingasse 6a, 4020 Linz',
      'team@smartordi.eu',
      'innerhalb von 30 Tagen',
      'Zero Data Retention',
      'nicht zum Training',
      'auf Ihrem Gerät zusammen mit dem Brief gespeichert',
      'Art. 9 Abs. 2 lit. a',
      'Art. 22',
      'Barichgasse 40–42, 1030 Wien',
      'Upstash',
      'Resend',
      'Stripe',
      'Supabase',
      'Frankfurt (fra1)',
      'höchstens 24 Monate',
      'Konto löschen',
    ]) {
      expect(de, fact).toContain(fact);
    }
  });

  it('no longer claims, in any language, that the photo is never stored or that Vercel keeps the data in the EU', () => {
    const banned = [
      /nie(mals)? gespeichert/i,
      /never stored/i,
      /not permanently stored/i,
      /ما بتتخزن، لا عندنا ولا عند Anthropic/,
      /ne bizde ne de Anthropic/,
      /نه پیش ما و نه پیش Anthropic/,
      /ні нами, ні Anthropic/,
      /on servers within the European Union/,
      /innerhalb der Europäischen Union/,
    ];
    const all = [text(privacyPolicyDe), ...Object.values(TRANSLATED).map(text)];
    for (const policy of all) for (const pattern of banned) expect(policy).not.toMatch(pattern);
  });

  it('opens every not-yet-updated translation with a pointer to the German version', () => {
    for (const [lang, sections] of Object.entries(TRANSLATED)) {
      expect(sections[0].body, lang).toMatch(/6|٦|۶/);
      expect(sections[0].body, lang).not.toContain('Brifo helps Arabic-speaking');
    }
  });
});

describe('the consent screens', () => {
  it('no longer promise, in any language, that photos are never stored', () => {
    const banned = /never stored|niemals gespeichert|nie gespeichert|ما بتنخزن أبداً|hiç saklanmaz|hiçbir zaman saklanmaz|هرگز ذخیره نمی|ніколи не зберігаються|ніколи не зберігається/;
    for (const [lang, table] of Object.entries(translations)) {
      expect(table.privacy_gate_point1_body, lang).not.toMatch(banned);
      expect(table.child_consent_label, lang).not.toMatch(banned);
    }
  });
});

// ---------------------------------------------------------------------------
// What /api/analyze sends to Anthropic, and what it logs
// ---------------------------------------------------------------------------

vi.mock('../src/server/entitlement.js', () => ({
  checkEntitlement: async () => ({
    ok: true,
    user: { id: 'user-123', email: 'parent@example.com', createdAt: null },
  }),
}));

let anthropicStatus = 200;
let anthropicBody: unknown = { content: [{ text: '{"summary":"Befund: Diabetes"}' }] };
const sent: { url: string; body: string; headers: Record<string, string> }[] = [];
vi.stubGlobal('fetch', async (url: string, init: { body: string; headers: Record<string, string> }) => {
  sent.push({ url, body: init.body, headers: init.headers });
  return { ok: anthropicStatus === 200, status: anthropicStatus, json: async () => anthropicBody } as Response;
});
process.env.ANTHROPIC_API_KEY = 'sk-test';

const { default: analyze } = await import('../api/analyze.js');

function fakeRes() {
  const res = {
    statusCode: 0,
    payload: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.payload = body;
    },
  };
  return res;
}

async function callAnalyze() {
  const req = { method: 'POST', headers: { authorization: 'Bearer t' }, body: { image: 'QUJD', mediaType: 'image/jpeg', lang: 'de' } };
  const res = fakeRes();
  await analyze(req as never, res as never);
  return res;
}

describe('/api/analyze', () => {
  beforeEach(() => {
    sent.length = 0;
    anthropicStatus = 200;
    anthropicBody = { content: [{ text: '{"summary":"Befund: Diabetes"}' }] };
  });

  it('sends Anthropic only the image and the output language — no account id or email', async () => {
    await callAnalyze();
    expect(sent).toHaveLength(1);
    const body = JSON.parse(sent[0].body) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(['max_tokens', 'messages', 'model', 'system']);
    expect(sent[0].body).not.toContain('user-123');
    expect(sent[0].body).not.toContain('parent@example.com');
    expect(JSON.stringify(sent[0].headers)).not.toContain('user-123');
  });

  it('does not write an Anthropic error body to the logs', async () => {
    anthropicStatus = 400;
    anthropicBody = { error: { type: 'invalid_request_error', message: 'the letter said: Befund Diabetes' } };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await callAnalyze();
    const logged = JSON.stringify(spy.mock.calls);
    spy.mockRestore();
    expect(logged).toContain('invalid_request_error');
    expect(logged).not.toContain('Diabetes');
  });

  it('does not log the model text when it is not valid JSON', async () => {
    anthropicBody = { content: [{ text: 'Befund: Diabetes (not json)' }] };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await callAnalyze();
    const logged = JSON.stringify(spy.mock.calls);
    spy.mockRestore();
    expect(res.statusCode).toBe(502);
    expect(logged).not.toContain('Diabetes');
  });
});

describe('logging a failed model call (src/server/reply.ts, api/reply.ts)', () => {
  it('keeps the error kind and status, never the message', async () => {
    const { describeError } = await import('../src/server/errors.js');
    const err = Object.assign(new Error('Failed to parse: "Sehr geehrte Frau Dr., mein Sohn hat Asthma"'), { status: 400 });
    expect(describeError(err)).toBe('Error (status 400)');
    expect(describeError(new SyntaxError('Unexpected token in "Asthma"'))).toBe('SyntaxError');
  });
});
