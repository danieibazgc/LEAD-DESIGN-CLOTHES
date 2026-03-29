"use client";

import { useId } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { localeOptions, type Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const id = useId();
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="hidden text-[11px] font-label font-bold uppercase tracking-widest text-outline lg:block"
      >
        {t("language.label")}
      </label>
      <select
        id={id}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="h-9 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-3 text-xs font-semibold text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        aria-label={t("language.label")}
      >
        {localeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
