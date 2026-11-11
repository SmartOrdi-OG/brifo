/** What the server lets through from the model.
 *
 * The route used to check that `payments` and `deadlines` were arrays and
 * never look inside them. A payment the model returned without a due_date
 * therefore reached the device, was saved there, and crashed the home screen
 * at every launch — the blank screen a parent reported, and a loop she could
 * not get out of because the white screen offered nothing to clear it from.
 *
 * The fix is not stricter rejection. A letter's analysis is something a
 * parent paid for and waited on, so one malformed item must not cost her the
 * other nine. These pin both halves: the bad item goes, the rest stays.
 */
import { describe, it, expect } from 'vitest';
import { checkAnalysis } from '../src/server/analysisSchema';

const good = {
  summary: 'رسالة من المدرسة',
  sender: 'Volksschule Linz',
  action_required: true,
  actions: ['وقّعي الورقة'],
  deadlines: [{ date: '2026-11-18', what: 'لقاء الأهل' }],
  needs_reply: false,
  urgency: 'medium',
  detected_child_name: 'سارة',
  detected_child_class: '3b',
  payments: [{ amount: 12.5, currency: 'EUR', reason: 'رسم الرحلة', due_date: '2026-11-23' }],
};

describe('the payment that caused the crash', () => {
  it('is kept, with due_date null', () => {
    // "Pay at the school office" with no day on it. Ordinary, and the money
    // is still owed — dropping it would lose the parent real information.
    const out = checkAnalysis({ ...good, payments: [{ amount: 12.5, currency: 'EUR', reason: 'رسم' }] });
    expect(out.payments).toHaveLength(1);
    expect(out.payments[0].due_date).toBeNull();
  });

  it('is kept when the model says null outright', () => {
    const out = checkAnalysis({ ...good, payments: [{ amount: 5, currency: 'EUR', reason: 'r', due_date: null }] });
    expect(out.payments[0].due_date).toBeNull();
  });

  it('loses a date that is not a date, but keeps the payment', () => {
    const out = checkAnalysis({
      ...good,
      payments: [{ amount: 5, currency: 'EUR', reason: 'r', due_date: 'نهاية الفصل' }],
    });
    expect(out.payments).toHaveLength(1);
    expect(out.payments[0].due_date).toBeNull();
  });
});

describe('what is dropped, and what survives beside it', () => {
  it('drops a payment with no amount and keeps the rest', () => {
    const out = checkAnalysis({
      ...good,
      payments: [
        { currency: 'EUR', reason: 'no amount' },
        { amount: 12.5, currency: 'EUR', reason: 'real', due_date: '2026-11-23' },
      ],
    });
    expect(out.payments.map((p) => p.reason)).toEqual(['real']);
  });

  it('drops a deadline with no date and keeps the rest', () => {
    // A deadline with no date cannot be shown or reminded about; it is only
    // something for a sort to throw on later.
    const out = checkAnalysis({
      ...good,
      deadlines: [{ what: 'متى؟' }, { date: '2026-11-18', what: 'لقاء الأهل' }],
    });
    expect(out.deadlines.map((d) => d.what)).toEqual(['لقاء الأهل']);
  });

  it('drops a date that passes the pattern but is not a day', () => {
    // The model writes these from the letter's wording; 30 February turns up.
    const out = checkAnalysis({ ...good, deadlines: [{ date: '2026-02-30', what: 'x' }, { date: '2026-13-01', what: 'y' }] });
    expect(out.deadlines).toEqual([]);
  });

  it('drops a non-string action and keeps the strings', () => {
    const out = checkAnalysis({ ...good, actions: ['وقّعي الورقة', 42, null, '  ', 'ادفعي'] });
    expect(out.actions).toEqual(['وقّعي الورقة', 'ادفعي']);
  });
});

describe('it never throws, whatever arrives', () => {
  it('survives an empty object', () => {
    const out = checkAnalysis({});
    expect(out.summary).toBe('');
    expect(out.payments).toEqual([]);
    expect(out.deadlines).toEqual([]);
    expect(out.urgency).toBe('low');
  });

  it('survives fields of entirely the wrong type', () => {
    const out = checkAnalysis({ summary: 12, actions: 'not a list', payments: { nope: true }, urgency: 'URGENT' });
    expect(out.summary).toBe('');
    expect(out.actions).toEqual([]);
    expect(out.payments).toEqual([]);
    expect(out.urgency).toBe('low');
  });

  it('keeps a good analysis intact', () => {
    // The check must not quietly degrade the normal case.
    const out = checkAnalysis(good);
    expect(out).toMatchObject({
      sender: 'Volksschule Linz',
      urgency: 'medium',
      detected_child_class: '3b',
    });
    expect(out.deadlines).toHaveLength(1);
    expect(out.payments[0].due_date).toBe('2026-11-23');
  });

  it('defaults a missing currency rather than dropping the payment', () => {
    const out = checkAnalysis({ ...good, payments: [{ amount: 9, reason: 'رسم' }] });
    expect(out.payments[0].currency).toBe('EUR');
  });
});
