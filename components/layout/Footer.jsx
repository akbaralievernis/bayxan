"use client";

import Link from "next/link";
import { RESTAURANT, NAV_LINKS } from "@/lib/constants";
import { Instagram, Phone, MapPin } from "lucide-react";
import { useT, useLocale } from "@/components/providers/LocaleProvider";

export default function Footer() {
  const t = useT();
  const { locale } = useLocale();
  const city = locale === "ky" ? RESTAURANT.cityKy : RESTAURANT.cityRu;
  return (
    <footer className="relative mt-24 border-t border-stone-200/70 dark:border-stone-800/40 bg-white/40 dark:bg-[#120D0A]/40 backdrop-blur-md">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/logo.jpg"
              alt="Байхан Logo"
              className="w-10 h-10 rounded-full object-cover border border-amber-500/30 dark:border-gold-500/30 shadow-md"
            />
            <div className="font-display text-2xl tracking-widest text-stone-900 dark:text-[#FDF6E2]">
              {RESTAURANT.name}
              <span className="block text-stone-400 dark:text-stone-500 text-sm tracking-[0.4em] mt-0.5">
                {RESTAURANT.nameLocal}
              </span>
            </div>
          </div>
          <p className="text-stone-700 dark:text-stone-300 text-sm max-w-xs leading-relaxed">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-gold-400 font-semibold mb-4">{t("footer.navigation")}</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-stone-800 dark:text-stone-200 hover:text-amber-600 dark:hover:text-gold-400 transition-colors font-medium">
                  {t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-gold-400 font-semibold mb-4">{t("footer.contacts")}</h4>
          <ul className="space-y-2 text-sm text-stone-800 dark:text-stone-200">
            <li>
              <a
                href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-amber-600 dark:hover:text-gold-400 transition-colors tabular-nums font-medium"
              >
                <Phone size={14} className="text-amber-600/70" /> {RESTAURANT.phone}
              </a>
            </li>
            <li>
              <a
                href={`tel:${RESTAURANT.phoneAlt.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-amber-600 dark:hover:text-gold-400 transition-colors tabular-nums pl-6 font-medium"
              >
                {RESTAURANT.phoneAlt}
              </a>
            </li>
            <li>
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 hover:text-amber-600 dark:hover:text-gold-400 transition-colors font-medium"
              >
                <MapPin size={14} className="text-amber-600/70 mt-0.5 shrink-0" />
                <span>
                  {locale === "ky" ? RESTAURANT.addressKy : RESTAURANT.address}
                  <span className="block text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-normal">
                    {locale === "ky" ? "Кашкар-Кыштак айылы, Ош облусу" : "с. Кашгар-Кыштак, Ошская область"}
                  </span>
                </span>
              </a>
            </li>
            <li className="inline-flex items-center gap-2 font-medium"><Instagram size={14} className="text-amber-600/70" /> @bayhan.kg</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-gold-400 font-semibold mb-4">{t("footer.hours")}</h4>
          <ul className="space-y-2 text-sm text-stone-800 dark:text-stone-200 font-medium">
            <li>{t("footer.hours.mon_thu")}</li>
            <li className="text-stone-500 dark:text-stone-400 font-normal">{t("footer.hours.fri_sun")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200/70 dark:border-stone-800/40 py-5 text-center text-xs text-stone-400 dark:text-stone-500 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span>© {new Date().getFullYear()} {RESTAURANT.name}. {t("footer.copyright")}</span>
        <span className="hidden sm:inline text-stone-300 dark:text-stone-700">·</span>
        <Link href="/admin" className="text-stone-500 dark:text-stone-450 hover:text-amber-600 dark:hover:text-gold-400 transition-colors underline decoration-dotted underline-offset-4 font-medium">
          Админ-панель
        </Link>
      </div>
    </footer>
  );
}
