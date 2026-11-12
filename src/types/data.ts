import type { LetterAnalysis } from './analysis';

export const CHILD_COLORS = ['#2563eb', '#d97706', '#059669', '#db2777', '#7c3aed', '#dc2626'] as const;

export type FamilyMemberType = 'child' | 'adult';

export interface Child {
  id: string;
  name: string;
  type: FamilyMemberType;
  schoolClass: string;
  school?: string;
  color: string;
  consentGiven: boolean;
  consentDate: string;
  createdAt: string;
  /** Bumped on every edit (see DataContext's updateChild).
   *
   * Not decoration: lib/mergeState picks the winner between this device and
   * the cloud copy by `updatedAt ?? createdAt`. Without it a rename on one
   * phone ties with the stale record on the other — both sides keep their own
   * version and push it back up, so the two parents' phones disagree about
   * the child's name forever. Optional only because records written before
   * this field existed don't carry one; lib/backup fills it in on the way in. */
  updatedAt?: string;
}

/** Special pseudo-id for letters/events that apply to the whole family rather than one child. */
export const ALL_CHILDREN = 'all' as const;

export interface LetterPhoto {
  base64: string;
  mediaType: 'image/jpeg';
}

export interface StoredLetter {
  id: string;
  childId: string;
  createdAt: string;
  analysis: LetterAnalysis;
  /** Local-only: kept out of the cloud-sync payload (see DataContext's
   * syncToCloud call) because the backup API caps total payload size and
   * photos would blow that budget after a handful of letters. Present in
   * localStorage and in manual JSON export/import. */
  photo?: LetterPhoto;
}

export interface Payment {
  id: string;
  childId: string;
  amount: number;
  currency: string;
  reason: string;
  /** YYYY-MM-DD, or null when the letter named an amount but no deadline.
   *
   * It used to be typed `string` and was not: the model fills this from the
   * letter, and a bill that says "pay at the office" with no date gives it
   * nothing to fill it with. The type said the value was always there, every
   * reader called a string method on it, and one such payment crashed the
   * home screen at every launch — permanently, since the data was saved. */
  dueDate: string | null;
  paid: boolean;
  letterId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventSource = 'letter' | 'payment' | 'manual';

export interface CalendarEvent {
  id: string;
  childId: string;
  title: string;
  date: string;
  /** HH:MM (24-hour), optional — an event with no time is treated as all-day. */
  time?: string;
  /** With whom (e.g. doctor/provider name), optional. */
  provider?: string;
  /** Address/place of the appointment, optional. */
  location?: string;
  /** Reason for the visit, optional. */
  reason?: string;
  source: CalendarEventSource;
  createdAt: string;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  childId: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  /** YYYY-MM-DD. Optional — when set, the todo joins the same reminder
   * pipeline (foreground fallback + push) as calendar events. */
  dueDate?: string;
}

export interface AppRating {
  stars: number;
  comment: string;
  updatedAt: string;
}

/** Records a deletion so that merging in a stale copy from another device
 * (see lib/mergeState.ts) removes the item again instead of resurrecting it. */
export interface Tombstone {
  id: string;
  deletedAt: string;
}
