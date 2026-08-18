import type { Lang } from '../context/translations';

/** Every supported language, labelled in its own script so someone who can't
 * read the current UI language can still find their own. Order matches the
 * order languages were added. Single source of truth — Settings and the
 * pre-auth gates both render from this. */
export const LANGUAGE_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fa', label: 'فارسی' },
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
];
