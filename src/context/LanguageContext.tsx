import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, arByGender, isRtlLang, type Gender, type Lang, type TranslationKey } from './translations';

interface LanguageContextValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  /** How the reader wants to be addressed; `null` until they say. */
  gender: Gender | null;
  setGender: (gender: Gender | null) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'brifo_lang';
const GENDER_KEY = 'brifo_gender';
const VALID_LANGS: readonly Lang[] = ['ar', 'de', 'tr', 'fa', 'en', 'uk'];

function readStoredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID_LANGS.includes(stored as Lang) ? (stored as Lang) : 'ar';
}

function readStoredGender(): Gender | null {
  const stored = localStorage.getItem(GENDER_KEY);
  return stored === 'm' || stored === 'f' ? stored : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  const [gender, setGenderState] = useState<Gender | null>(readStoredGender);
  const dir = isRtlLang(lang) ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  useEffect(() => {
    if (gender) localStorage.setItem(GENDER_KEY, gender);
    else localStorage.removeItem(GENDER_KEY);
  }, [gender]);

  const setLang = (next: Lang) => setLangState(next);
  const setGender = (next: Gender | null) => setGenderState(next);

  /** Arabic is the only language whose wording depends on the reader's gender
   * (see arByGender). Everywhere else, and whenever they haven't chosen, this
   * is the plain table lookup it always was. */
  const t = (key: TranslationKey) => {
    if (lang === 'ar' && gender) {
      const override = arByGender[gender][key];
      if (override) return override;
    }
    return translations[lang][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, gender, setGender, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
