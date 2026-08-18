import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS } from '../data/languages';
import './LanguagePicker.css';

/** Compact language switcher for the screens shown *before* sign-in (privacy
 * consent, auth). Those are the first things a new user sees, and until now
 * the only language switcher lived in Settings — behind the auth gate — so
 * anyone who didn't read the default language was stuck, including on the
 * screen asking them to accept the privacy policy.
 *
 * Deliberately a visible row rather than a dropdown: someone who can't read
 * the page needs to spot their own language at a glance, not discover it
 * behind a tap. */
export function LanguagePicker() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-picker" role="group" aria-label="Language">
      {LANGUAGE_OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          lang={opt.code}
          onClick={() => setLang(opt.code)}
          className={`lang-picker-btn${lang === opt.code ? ' selected' : ''}`}
          aria-pressed={lang === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
