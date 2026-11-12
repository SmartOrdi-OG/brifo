/** The analyze route's own wiring, not just the schema beside it.
 *
 * tests/analysisSchema.test.ts proves checkAnalysis salvages what it should.
 * This proves the route actually calls it. The two are separate on purpose:
 * the production outage before this one was a wiring mismatch between two
 * halves that were each correct and each tested on their own, so a schema
 * nobody calls is exactly the failure worth pinning.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../src/server/entitlement.js', () => ({
  checkEntitlement: async () => ({ ok: true, user: { id: 'u1', email: 'parent@example.com' } }),
}));

const { default: handler } = await import('../api/analyze.js');

/** What the model returned on the letter that bricked the home screen: a real
 * amount with no day to pay it by, next to a deadline that is only prose. */
const modelOutput = {
  summary: 'رسالة من المدرسة',
  sender: 'Volksschule Linz',
  action_required: true,
  actions: ['ادفعي الرسم'],
  deadlines: [
    { date: 'نهاية الفصل', what: 'الدفع' },
    { date: '2026-11-18', what: 'لقاء الأهل' },
  ],
  needs_reply: false,
  urgency: 'medium',
  detected_child_name: 'سارة',
  detected_child_class: '3b',
  payments: [{ amount: 12.5, currency: 'EUR', reason: 'رسم الرحلة' }],
};

function fakeRes() {
  const sent: { code?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      sent.code = code;
      return res;
    },
    json(body: unknown) {
      sent.body = body;
    },
  };
  return { res, sent };
}

function respondWith(payload: unknown) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({ content: [{ text: JSON.stringify(payload) }] }),
  }));
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the client a payment with due_date null instead of no payment', async () => {
    vi.stubGlobal('fetch', respondWith(modelOutput));
    const { res, sent } = fakeRes();

    await handler(
      { method: 'POST', body: { image: 'aGk=', mediaType: 'image/jpeg', lang: 'ar' } } as never,
      res as never,
    );

    expect(sent.code).toBe(200);
    const body = sent.body as { payments: { amount: number; due_date: string | null }[] };
    expect(body.payments).toHaveLength(1);
    expect(body.payments[0].amount).toBe(12.5);
    expect(body.payments[0].due_date).toBeNull();
  });

  it('drops the unusable deadline and keeps the real one', async () => {
    vi.stubGlobal('fetch', respondWith(modelOutput));
    const { res, sent } = fakeRes();

    await handler(
      { method: 'POST', body: { image: 'aGk=', mediaType: 'image/jpeg', lang: 'ar' } } as never,
      res as never,
    );

    const body = sent.body as { deadlines: { date: string; what: string }[] };
    expect(body.deadlines).toEqual([{ date: '2026-11-18', what: 'لقاء الأهل' }]);
  });

  it('tells the model to leave names in the alphabet they were printed in', async () => {
    // A customer's name, Alaa, came back as "علاء" — a different, male name.
    // The prompt had asked for "all text fields" in the reader's language and
    // said nothing about proper nouns, so transliterating one was the
    // instruction working as written. It also breaks findMatchingChild, which
    // compares the detected name against the one the parent typed in Latin
    // letters, so every letter looked like it belonged to a new child.
    const fetchMock = respondWith(modelOutput);
    vi.stubGlobal('fetch', fetchMock);
    const { res } = fakeRes();

    await handler(
      { method: 'POST', body: { image: 'aGk=', mediaType: 'image/jpeg', lang: 'ar' } } as never,
      res as never,
    );

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string }];
    const body = JSON.parse(init.body) as { system: string };
    expect(body.system).toMatch(/never translate or transliterate/i);
    expect(body.system).toMatch(/proper noun/i);
  });

  it('answers 200 with an empty analysis rather than letting junk through', async () => {
    // The model is not deterministic; one bad run must not reach the device.
    vi.stubGlobal('fetch', respondWith({ summary: 7, payments: 'none', deadlines: [{}] }));
    const { res, sent } = fakeRes();

    await handler(
      { method: 'POST', body: { image: 'aGk=', mediaType: 'image/jpeg', lang: 'ar' } } as never,
      res as never,
    );

    expect(sent.code).toBe(200);
    expect(sent.body).toMatchObject({ summary: '', payments: [], deadlines: [], urgency: 'low' });
  });
});
