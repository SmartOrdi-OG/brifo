import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  COUNTRY_STORAGE_KEY,
  DEFAULT_COUNTRY,
  activeCountry,
  readStoredCountry,
  type Country,
} from '../lib/country';

interface CountryContextValue {
  /** What the reader picked — Austria for everyone who never saw a picker. */
  stored: Country;
  /** What the app should actually act on. See lib/country's activeCountry. */
  country: Country;
  setCountry: (country: Country) => void;
}

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Country>(() => readStoredCountry());

  useEffect(() => {
    try {
      localStorage.setItem(COUNTRY_STORAGE_KEY, stored);
    } catch {
      // A private window can refuse to store. The reader keeps their choice
      // for this session and falls back to Austria next time, which is the
      // safe way to be wrong.
    }
  }, [stored]);

  return (
    <CountryContext.Provider value={{ stored, country: activeCountry(stored), setCountry: setStored }}>
      {children}
    </CountryContext.Provider>
  );
}

/** The country in force.
 *
 * Deliberately does not throw when there is no provider, unlike useTheme: the
 * guide is rendered in tests and in the Telegram-chrome path without the full
 * provider tree, and a country is a detail those cases can default rather than
 * a dependency worth crashing a screen over. */
export function useCountry(): CountryContextValue {
  return (
    useContext(CountryContext) ?? {
      stored: DEFAULT_COUNTRY,
      country: activeCountry(DEFAULT_COUNTRY),
      setCountry: () => {},
    }
  );
}
