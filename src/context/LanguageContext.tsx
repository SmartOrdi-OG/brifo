import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, isRtlLang, type Lang, type TranslationKey } from './translations';

interface LanguageContextValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'brifo_lang';
const VALID_LANGS: readonly Lang[] = ['ar', 'de', 'tr', 'fa'];

function readStoredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID_LANGS.includes(stored as Lang) ? (stored as Lang) : 'ar';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  const dir = isRtlLang(lang) ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = (next: Lang) => setLangState(next);
  const t = (key: TranslationKey) => translations[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
