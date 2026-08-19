import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Lang } from '../context/translations';
import { LANGUAGE_OPTIONS } from '../data/languages';
import './LanguagePicker.css';

/** Language switcher used both in Settings and on the screens shown *before*
 * sign-in (privacy consent, auth) — those are the first thing a new user sees,
 * and without one here anyone who doesn't read the default language is stuck.
 *
 * Built on a native <select> rather than a custom menu: on a phone that opens
 * the OS picker, which handles scrolling, dismissal and accessibility for free
 * and renders every script correctly. The globe icon keeps it recognisable
 * without reading the current language. */
export function LanguagePicker({ block = false }: { block?: boolean } = {}) {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGE_OPTIONS.find((o) => o.code === lang);

  return (
    <div className={`lang-picker${block ? ' block' : ''}`}>
      <Globe size={17} strokeWidth={2} aria-hidden />
      <span className="lang-picker-value">{current?.label ?? lang}</span>
      <ChevronDown size={16} strokeWidth={2.25} aria-hidden />
      <select
        className="lang-picker-select"
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label="Language"
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
