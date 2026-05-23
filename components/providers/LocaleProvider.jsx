"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  translate,
} from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "locale";
const LocaleContext = createContext(null);

function readInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  } catch {}
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }) {
  // Start with DEFAULT_LOCALE on SSR/first paint to match the inline script in
  // app/layout.jsx that mirrors the persisted value to <html lang>. After mount
  // we sync to the real localStorage value.
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const real = readInitialLocale();
    if (real !== locale) setLocaleState(real);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {}
  }, []);

  const t = useCallback((key) => translate(locale, key), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Graceful fallback during SSR / unwrapped subtrees — return defaults
    // instead of throwing so any stray import doesn't crash.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (k) => translate(DEFAULT_LOCALE, k),
    };
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
