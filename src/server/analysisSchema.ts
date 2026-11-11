/** What the model sent, checked before anyone acts on it.
 *
 * api/analyze.ts used to normalise only the outer shape:
 *
 *     payments: Array.isArray(parsed.payments) ? parsed.payments : [],
 *
 * It confirmed the field was a list and never looked inside it. So a payment
 * the model returned without a due_date went through untouched, was saved to
 * the device, and crashed the home screen at every launch from then on — the
 * fault behind the blank screen a parent reported. The comment above that
 * line says it exists so a missing field "can't crash the frontend
 * downstream", which was true of the fields and not of their contents.
 *
 * The rule here is salvage, not reject. A letter's analysis is something a
 * parent paid for and waited on; throwing all of it away because one of three
 * deadlines came back malformed would be a worse answer than the one bad
 * deadline. So each item is checked on its own and the ones that cannot be
 * used are dropped, leaving everything that can.
 *
 * What counts as unusable is deliberately narrow:
 * - a deadline with no date is not a deadline — nothing can show or remind it;
 * - a payment with no amount is not a payment;
 * - a payment with no *date* is perfectly ordinary ("pay at the office"), so
 *   it is kept with due_date null, which is what the app now expects.
 */
import { z } from 'zod';

/** A calendar date the app can actually use.
 *
 * Not just the shape: '2026-13-45' matches the pattern and is not a day. The
 * model writes these from the letter's own wording, so "end of term" and
 * "2026-02-30" both turn up. */
const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }, 'not a real calendar date');

const NonEmpty = z.string().trim().min(1);

const Deadline = z.object({
  date: IsoDate,
  what: NonEmpty,
});

const Payment = z.object({
  amount: z.number().finite().positive(),
  currency: NonEmpty.default('EUR'),
  reason: NonEmpty,
  /** Null whenever the letter names a sum without a usable day to pay it by —
   * either because it gives none ("pay at the office"), or because the model
   * wrote the letter's own wording instead of a date ("end of term"). Both are
   * ordinary, and neither is a reason to throw the payment away: the amount
   * owed is the part the parent needs. Unlike a deadline, which is nothing
   * without its date, a payment is still a payment without one. */
  // .optional() because in Zod 4 an unknown field is still a *required* key,
  // and the field being absent altogether is the commonest case of all.
  due_date: z.unknown().optional().transform((value) => {
    const parsed = IsoDate.safeParse(value);
    return parsed.success ? parsed.data : null;
  }),
});

/** Keeps the items that parse and drops the rest, instead of failing whole. */
function salvage<T>(items: unknown, item: z.ZodType<T>): T[] {
  if (!Array.isArray(items)) return [];
  const kept: T[] = [];
  for (const candidate of items) {
    const parsed = item.safeParse(candidate);
    if (parsed.success) kept.push(parsed.data);
  }
  return kept;
}

export interface CheckedAnalysis {
  summary: string;
  sender: string | null;
  action_required: boolean;
  actions: string[];
  deadlines: { date: string; what: string }[];
  needs_reply: boolean;
  urgency: 'high' | 'medium' | 'low';
  detected_child_name: string | null;
  detected_child_class: string | null;
  payments: { amount: number; currency: string; reason: string; due_date: string | null }[];
}

const nullableText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/** Never throws: whatever the model sent, this returns something the app can
 * render. An empty analysis is a poor answer; a crash is not an answer. */
export function checkAnalysis(parsed: Record<string, unknown>): CheckedAnalysis {
  return {
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    sender: nullableText(parsed.sender),
    action_required: !!parsed.action_required,
    actions: salvage(parsed.actions, NonEmpty),
    deadlines: salvage(parsed.deadlines, Deadline),
    needs_reply: !!parsed.needs_reply,
    urgency:
      parsed.urgency === 'high' || parsed.urgency === 'medium' || parsed.urgency === 'low' ? parsed.urgency : 'low',
    detected_child_name: nullableText(parsed.detected_child_name),
    detected_child_class: nullableText(parsed.detected_child_class),
    payments: salvage(parsed.payments, Payment),
  };
}
