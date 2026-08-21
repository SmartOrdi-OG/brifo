import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { ConfigError } from './analyze.js';
import { toStructuredOutputFormat } from './structuredOutput.js';

let client: Anthropic | null = null;

/** See analyze.ts getClient() — lazy construction turns a missing key into a
 * normal catchable error instead of an uncaught throw at module load. */
function getClient(): Anthropic {
  if (client) return client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ConfigError('ANTHROPIC_API_KEY is not set in the server environment');
  }
  client = new Anthropic();
  return client;
}

/** Kept in sync with api/analyze.js's OUTPUT_LANGUAGE. */
const OUTPUT_LANGUAGE: Record<string, string> = {
  ar: 'Arabic',
  de: 'German',
  tr: 'Turkish',
  fa: 'Persian (Farsi)',
  en: 'English',
  uk: 'Ukrainian',
};

/** Deliberately does not mention schools first, and says so explicitly.
 *
 * This prompt used to read "communicate with their children's school", left
 * over from when the app only handled school letters. api/analyze.js was
 * broadened when the app was; this was not — so a parent asking to excuse an
 * appointment with their child's paediatrician got back a letter addressed to
 * a school, about a two-month-old missing lessons. */
function buildSystemPrompt(lang: string): string {
  const target = OUTPUT_LANGUAGE[lang] ?? OUTPUT_LANGUAGE.ar;
  return (
    'You are a formal German letter-writing assistant helping immigrant families in Austria ' +
    'write to any recipient: a school, a doctor or clinic, a government office, an insurer, ' +
    'a landlord, a utility, or anyone else. ' +
    'Never assume the recipient is a school. Take it from the "Recipient" line when one is ' +
    'given, otherwise infer it from the details, and address the letter accordingly. ' +
    "Do not mention school, lessons or teachers unless the recipient really is a school. " +
    'Write a polite, formal German letter ' +
    `based on the intent and the details provided (the details may be written in ${target}). ` +
    'Format the letter with real line breaks, following standard German business-letter structure: ' +
    'the salutation (e.g. "Sehr geehrter Herr Dr. Kar,") alone on its own line, then a blank line, ' +
    'then the body as one or more short paragraphs separated by blank lines, then a blank line, then ' +
    'a closing phrase (e.g. "Mit freundlichen Grüßen") on its own line. Never run the salutation ' +
    'directly into the first sentence of the body on the same line. ' +
    `Then provide an accurate ${target} translation of the exact same letter, using the same ` +
    'paragraph structure (translated salutation alone on its own line, blank line, body, blank line, closing).'
  );
}

/** Ordered as they appear on screen. Kept broad enough for any recipient —
 * the original four were school-shaped, which is no longer what the app is
 * for; cancelling an appointment, asking to pay in instalments and objecting
 * to a decision are the things the guide articles actually tell people to do. */
const INTENT_LABELS = {
  entschuldigung: 'Entschuldigung wegen Abwesenheit (excuse for an absence)',
  termin: 'Terminanfrage (request an appointment)',
  absage: 'Terminabsage (cancel or move an existing appointment; apologise and, where it fits, ask for a new one)',
  zustimmung: 'Zustimmung / Einverständnis (consent)',
  ratenzahlung:
    'Bitte um Ratenzahlung oder Zahlungsaufschub (ask to pay an invoice in instalments or later; ' +
    'stay courteous, state the wish plainly, do not promise an amount or date the sender has not been given)',
  einspruch:
    'Einspruch / Widerspruch gegen eine Entscheidung (object to a decision; state only the reasons the ' +
    'sender gives, and never invent legal grounds, statutes or deadlines that were not provided)',
  frage: 'Frage an den Empfänger (a question for the recipient)',
} as const;

export type ReplyIntent = keyof typeof INTENT_LABELS;

export const ReplyRequestSchema = z.object({
  intent: z.enum(['entschuldigung', 'termin', 'absage', 'zustimmung', 'ratenzahlung', 'einspruch', 'frage']),
  /** Who the letter is going to. Optional, but it is what stops the model
   * falling back on the most common case when the details are terse. */
  recipient: z.string().max(120).optional(),
  /** What the letter being answered said, when the reply was started from one.
   * Separate from `details` on purpose: details is what the parent wants to
   * say, this is what they are answering. */
  letterContext: z.string().max(2000).optional(),
  childName: z.string().max(80).optional(),
  childClass: z.string().max(40).optional(),
  details: z.string().min(3).max(2000),
  lang: z.enum(['ar', 'de', 'tr', 'fa', 'en', 'uk']).default('ar'),
});

export type ReplyRequestInput = z.infer<typeof ReplyRequestSchema>;

const ReplyResultSchema = z.object({
  german: z.string().describe('The formal letter in German'),
  translation: z.string().describe("A translation of the same letter into the user's language"),
});

export type ReplyLetter = z.infer<typeof ReplyResultSchema>;

export class ReplyError extends Error {}

export async function generateReplyLetter(input: unknown): Promise<ReplyLetter> {
  const parsed = ReplyRequestSchema.safeParse(input);
  if (!parsed.success) throw new ReplyError(parsed.error.issues[0]?.message ?? 'invalid input');
  const { intent, recipient, letterContext, childName, childClass, details, lang } = parsed.data;
  const target = OUTPUT_LANGUAGE[lang] ?? OUTPUT_LANGUAGE.ar;

  const contextLines = [
    `Intent: ${INTENT_LABELS[intent]}`,
    recipient ? `Recipient: ${recipient}` : null,
    letterContext ? `This is a reply to a letter that said: ${letterContext}` : null,
    childName ? `Name of the person concerned: ${childName}` : null,
    childClass ? `School class (only relevant if the recipient is a school): ${childClass}` : null,
    `Details from parent (may be in ${target}): ${details}`,
  ].filter(Boolean);

  const anthropic = getClient();
  let response;
  try {
    response = await anthropic.messages.parse({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: buildSystemPrompt(lang),
      messages: [{ role: 'user', content: contextLines.join('\n') }],
      output_config: { format: toStructuredOutputFormat(ReplyResultSchema) },
    });
  } catch (err) {
    console.error('[reply] Anthropic API call failed:', err);
    throw err;
  }

  if (!response.parsed_output) {
    console.error('[reply] model returned no parsed_output', response);
    throw new ReplyError('model did not return structured output');
  }
  return response.parsed_output;
}
