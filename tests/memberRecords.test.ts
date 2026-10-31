/** Whose appointment is this?
 *
 * Reported from the app: an appointment saved for one child appeared on that
 * child's page AND on the mother's. Both pages showed it as theirs, so the
 * profile stopped answering the only question it is for.
 *
 * The cause was a branch on member type — an "adult" member was handed the
 * whole family's records unfiltered, on the reasoning that a parent manages
 * everyone. The reasoning is about the Home screen and the calendar, which
 * are family-wide by design. A profile is one person's page.
 *
 * These pin that every member is filtered the same way, and that the
 * family-wide records still reach everyone.
 */
import { describe, it, expect } from 'vitest';
import { recordsForMember } from '../src/lib/memberRecords';
import { ALL_CHILDREN } from '../src/types/data';

const MOTHER = 'm1';
const AYLA = 'c1';
const ALAA = 'c2';

const events = [
  { id: 'e1', childId: AYLA, title: 'دكتور الاطفال' },
  { id: 'e2', childId: ALAA, title: 'لينز' },
  { id: 'e3', childId: MOTHER, title: 'موعد الأم' },
  { id: 'e4', childId: ALL_CHILDREN, title: 'عطلة المدرسة' },
];

const titles = (memberId: string) => recordsForMember(events, memberId).map((e) => e.title);

describe('an appointment belongs to one member', () => {
  it('does not put a child’s appointment on the parent’s page', () => {
    // The reported bug, exactly: the mother is an adult member, and her page
    // listed Ayla's doctor appointment as if it were hers.
    expect(titles(MOTHER)).not.toContain('دكتور الاطفال');
  });

  it('does not put one child’s appointment on another child’s page', () => {
    expect(titles(AYLA)).not.toContain('لينز');
    expect(titles(ALAA)).not.toContain('دكتور الاطفال');
  });

  it('keeps the member’s own', () => {
    expect(titles(AYLA)).toContain('دكتور الاطفال');
    expect(titles(ALAA)).toContain('لينز');
    expect(titles(MOTHER)).toContain('موعد الأم');
  });
});

describe('a family-wide record still reaches everyone', () => {
  it('appears for every member', () => {
    // Stored once under ALL_CHILDREN rather than copied per member, so a
    // filter on the exact id alone would drop it from every page at once.
    for (const member of [AYLA, ALAA, MOTHER]) {
      expect(titles(member), member).toContain('عطلة المدرسة');
    }
  });
});

describe('the shape of the result', () => {
  it('returns the records themselves, not copies', () => {
    // ChildProfile compares by identity when deleting; a mapped copy would
    // quietly stop matching.
    expect(recordsForMember(events, AYLA)[0]).toBe(events[0]);
  });

  it('is empty for a member with nothing, rather than everything', () => {
    // The old branch's failure mode: an unknown or empty id falling through
    // to the unfiltered list.
    expect(recordsForMember(events, 'nobody').map((e) => e.title)).toEqual(['عطلة المدرسة']);
    expect(recordsForMember([], AYLA)).toEqual([]);
  });
});
