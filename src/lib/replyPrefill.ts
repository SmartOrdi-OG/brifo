import type { LetterAnalysis } from '../types/analysis';
import type { CalendarEvent } from '../types/data';

/** What the reply screen can be handed when it's opened from something the
 * app already knows about, rather than from the blank quick tool.
 *
 * `context` is what is being answered; it is kept apart from the details the
 * parent types, which are what they want to say about it. */
export interface ReplyPrefill {
  recipient?: string;
  childName?: string;
  context?: string;
}

export function prefillFromLetter(analysis: LetterAnalysis, childName?: string): ReplyPrefill {
  return {
    recipient: analysis.sender ?? undefined,
    childName,
    context: analysis.summary || undefined,
  };
}

/** An appointment carries more than a letter does — who it's with, where, and
 * what for — and all of it matters to a letter asking to move or cancel it. */
export function prefillFromEvent(event: CalendarEvent, childName?: string): ReplyPrefill {
  const when = event.time ? `${event.date} ${event.time}` : event.date;
  const context = [
    `${event.title} — ${when}`,
    event.location ? `Ort: ${event.location}` : null,
    event.reason ? `Grund: ${event.reason}` : null,
  ]
    .filter(Boolean)
    .join('\n');
  return { recipient: event.provider || undefined, childName, context };
}
