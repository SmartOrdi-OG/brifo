import { ALL_CHILDREN } from '../types/data';

/** The records belonging to one family member.
 *
 * A member's own records, plus the ones filed against the whole family: an
 * "الكل" item is stored once with childId === ALL_CHILDREN rather than copied
 * onto every child, so a lookup that matched only the exact id would lose it.
 *
 * Everyone is filtered the same way, adults included. An adult member used to
 * be handed the unfiltered list on the reasoning that a parent manages the
 * whole family — but a profile is one person's page, and the family-wide
 * views already exist on Home and in the calendar. What it did in practice
 * was put every child's appointment on the parent's page, so an appointment
 * saved for one child showed up under two names and neither page could be
 * trusted to say whose it was.
 */
export function recordsForMember<T extends { childId: string }>(items: T[], memberId: string): T[] {
  return items.filter((item) => item.childId === memberId || item.childId === ALL_CHILDREN);
}
