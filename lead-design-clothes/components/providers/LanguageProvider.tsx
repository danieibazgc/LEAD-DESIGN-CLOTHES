"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale, TranslationKey } from "@/lib/i18n/translations";
import {
  SUPPORTED_LOCALES,
  formatTranslation,
} from "@/lib/i18n/translations";

const STORAGE_KEY = "lead-design-clothes-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && SUPPORTED_LOCALES.includes(stored as Locale)
      ? (stored as Locale)
      : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => formatTranslation(locale, key, params),
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
