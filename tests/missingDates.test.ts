/** A letter that names money but no deadline.
 *
 * This is what actually took the app down. The error report said it exactly:
 *
 *   TypeError: null is not an object (evaluating 'e.dueDate.startsWith')
 *   route: /   count: 35
 *
 * Payment.dueDate was typed `string` and was not one. The model fills it from
 * the letter, and a bill that says "pay at the school office" with no date
 * gives it nothing to fill it with. Home multiplied the lie by calling
 * .startsWith on it to total the month, so one such payment blanked the home
 * screen — and because the record was saved, it blanked it again at every
 * launch, with no way out of the white screen to clear it.
 *
 * Three things are pinned here: a date that never arrives is stored as null
 * rather than undefined, a record already saved broken is healed on load, and
 * a deadline with no date does not become a calendar entry.
 */
import { describe, it, expect } from 'vitest';
import { normalizeState } from '../src/lib/backup';

const base = { createdAt: '2026-11-01T09:00:00Z', updatedAt: '2026-11-01T09:00:00Z', childId: 'c1' };

describe('a payment with no due date', () => {
  it('is kept, with the date settled to null', () => {
    // Keeping it matters: the money is still owed. It is the date that is
    // missing, not the debt.
    const state = normalizeState({
      payments: [{ id: 'p1', ...base, amount: 12.5, currency: 'EUR', reason: 'رسم الرحلة', paid: false }],
    });
    expect(state.payments).toHaveLength(1);
    expect(state.payments[0].dueDate).toBeNull();
  });

  it('settles every shape a missing date arrives in', () => {
    // undefined (absent), null (the model said so), and '' (it tried).
    const state = normalizeState({
      payments: [
        { id: 'a', ...base, amount: 1, currency: 'EUR', reason: 'a', paid: false, dueDate: undefined },
        { id: 'b', ...base, amount: 1, currency: 'EUR', reason: 'b', paid: false, dueDate: null },
        { id: 'c', ...base, amount: 1, currency: 'EUR', reason: 'c', paid: false, dueDate: '' },
      ],
    });
    expect(state.payments.map((p) => p.dueDate)).toEqual([null, null, null]);
  });

  it('leaves a real date alone', () => {
    const state = normalizeState({
      payments: [{ id: 'p1', ...base, amount: 1, currency: 'EUR', reason: 'r', paid: false, dueDate: '2026-11-23' }],
    });
    expect(state.payments[0].dueDate).toBe('2026-11-23');
  });

  it('survives the month total that crashed on it', () => {
    // Home's own expression, on the data that broke it.
    const { payments } = normalizeState({
      payments: [
        { id: 'p1', ...base, amount: 12.5, currency: 'EUR', reason: 'no date', paid: false, dueDate: null },
        { id: 'p2', ...base, amount: 30, currency: 'EUR', reason: 'this month', paid: false, dueDate: '2026-11-23' },
      ],
    });
    const total = payments.filter((p) => !p.paid && p.dueDate?.startsWith('2026-11')).reduce((s, p) => s + p.amount, 0);
    expect(total).toBe(30);
  });
});

describe('an event with no date', () => {
  it('is dropped, because nothing can be done with it', () => {
    // It cannot be placed in a calendar, reminded about, or sorted — and the
    // sort is where it would have crashed next.
    const state = normalizeState({
      events: [
        { id: 'e1', ...base, title: 'لقاء الأهل', date: '2026-11-18', source: 'letter' },
        { id: 'e2', ...base, title: 'بلا تاريخ', source: 'letter' },
        { id: 'e3', ...base, title: 'تاريخ فارغ', date: '', source: 'letter' },
      ],
    });
    expect(state.events.map((e) => e.id)).toEqual(['e1']);
  });

  it('leaves the sort that would have thrown with nothing to throw on', () => {
    const { events } = normalizeState({
      events: [
        { id: 'e1', ...base, title: 'b', date: '2026-12-01', source: 'letter' },
        { id: 'e2', ...base, title: 'a', source: 'letter' },
        { id: 'e3', ...base, title: 'c', date: '2026-11-18', source: 'letter' },
      ],
    });
    expect(() => events.slice().sort((a, b) => a.date.localeCompare(b.date))).not.toThrow();
  });
});

describe('a device already holding a broken record', () => {
  it('is healed by opening the app, not by clearing it', () => {
    // The record was written before the fix and is sitting in localStorage
    // right now. Normalising on load is what gets that phone working again
    // without the user having to find Safari's storage settings.
    const stored = {
      children: [{ id: 'c1', name: 'سارة', color: '#2563eb', createdAt: base.createdAt }],
      payments: [{ id: 'p1', ...base, amount: 12.5, currency: 'EUR', reason: 'رسم', paid: false, dueDate: null }],
      events: [{ id: 'e1', ...base, title: 'بلا تاريخ', source: 'letter' }],
    };
    const state = normalizeState(stored);
    expect(state.payments[0].dueDate).toBeNull();
    expect(state.events).toEqual([]);
    expect(state.children).toHaveLength(1);
  });
});
