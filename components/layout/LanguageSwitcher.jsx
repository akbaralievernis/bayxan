"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LOCALE_META, SUPPORTED_LOCALES } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Two-position segmented control: RU | KY. Mirrors the visual language of
 * ThemeToggle so the navbar stays balanced.
 */
export default function LanguageSwitcher({ className }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Тил / Язык"
      className={cn(
        "relative inline-flex items-center rounded-full p-0.5",
        "bg-white/70 dark:bg-stone-900/60 backdrop-blur-md",
        "border border-white/85 dark:border-stone-800/80 shadow-glass",
        className
      )}
    >
      {SUPPORTED_LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase rounded-full",
              "transition-colors no-tap-highlight",
              active
                ? "text-amber-900 dark:text-[#FDF6E2]"
                : "text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-gold-400"
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/80 to-amber-100/60 dark:from-stone-800 dark:to-stone-850 border border-amber-300/70 dark:border-gold-700/40 shadow-gold-soft"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{LOCALE_META[code].short}</span>
          </button>
        );
      })}
    </div>
  );
}
