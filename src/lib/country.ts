/** Which country's system the reader lives under.
 *
 * Not the same question as which language they read. A Syrian parent in
 * Germany reads Arabic and deals with the Jobcenter; a Syrian parent in
 * Austria reads the same Arabic and deals with the AMS. The guide and the
 * letter analysis follow the country; everything else follows the language.
 *
 * ── Why nothing is visible yet ───────────────────────────────────────────
 * COUNTRY_SELECTION_ENABLED is the switch, and it is off. The whole of this
 * lives in the app but changes nothing a user sees: there is no picker, every
 * account is Austria, and the guide shows exactly the 22 articles it showed
 * before. Germany's guide is empty — all 22 existing articles are Austrian in
 * substance, not merely in vocabulary (the official-letter article explains
 * RSa/RSb and points at the Arbeiterkammer; the grading article teaches a
 * scale where 5 is a fail, which in Germany it is not). Turning this on
 * before German articles exist would offer a German parent an empty Ratgeber,
 * or worse, Austrian answers about their child's school report.
 *
 * So the flag flips when there is German content to show, not when the
 * plumbing is finished.
 */
export const COUNTRIES = ['at', 'de'] as const;

export type Country = (typeof COUNTRIES)[number];

/** The single switch. Flipping it to true is the whole of "going live". */
export const COUNTRY_SELECTION_ENABLED = false;

export const COUNTRY_STORAGE_KEY = 'brifo_country';

/** Austria, not "undecided".
 *
 * Every account that exists today is Austrian, and they must not be asked a
 * question they have no reason to answer. A reader who never sees the picker
 * is in Austria, which is exactly where they already were. */
export const DEFAULT_COUNTRY: Country = 'at';

export function isCountry(value: unknown): value is Country {
  return typeof value === 'string' && (COUNTRIES as readonly string[]).includes(value);
}

/** Reads the stored country, falling back to Austria.
 *
 * Takes the store rather than reaching for localStorage so the awkward cases
 * — a private window where reading throws, a value written by a later version
 * — can be tested rather than hoped about.
 */
export function readStoredCountry(store: Pick<Storage, 'getItem'> | undefined = safeStorage()): Country {
  try {
    const stored = store?.getItem(COUNTRY_STORAGE_KEY);
    return isCountry(stored) ? stored : DEFAULT_COUNTRY;
  } catch {
    return DEFAULT_COUNTRY;
  }
}

/** The country actually in force.
 *
 * While the switch is off this is Austria for everyone, whatever is stored —
 * so a value left behind by testing cannot leak a half-built Germany to a
 * real reader. */
export function activeCountry(stored: Country): Country {
  return COUNTRY_SELECTION_ENABLED ? stored : DEFAULT_COUNTRY;
}

function safeStorage(): Pick<Storage, 'getItem'> | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
