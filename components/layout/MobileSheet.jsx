"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { X, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, RESTAURANT } from "@/lib/constants";
import GoldButton from "@/components/ui/GoldButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT } from "@/components/providers/LocaleProvider";

export default function MobileSheet({ onClose }) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 md:hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="absolute bottom-0 inset-x-0 glass-panel rounded-t-3xl pt-3 pb-8 px-6"
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-stone-300/70 mb-6" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Байхан Logo"
              className="w-9 h-9 rounded-full object-cover border border-amber-500/30 shadow-md"
            />
            <span className="font-display text-2xl tracking-widest text-stone-100">
              {RESTAURANT.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.close_aria")}
            className="w-10 h-10 grid place-items-center rounded-full bg-white/10 border border-white/20 text-stone-300 hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 flex justify-center">
          <LanguageSwitcher />
        </div>

        <nav className="flex flex-col gap-1 mb-8">
          {NAV_LINKS.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 + i * 0.05 }}
            >
              <Link
                href={l.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 px-2 border-b border-stone-800/40 text-stone-200 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors"
              >
                <span>{t(l.labelKey)}</span>
                <span className="text-amber-400">→</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <GoldButton href="/booking" variant="primary" className="w-full">
          {t("nav.book_cta")}
        </GoldButton>

        <div className="mt-3.5 text-center">
          <Link
            href="/admin"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-amber-400 hover:text-amber-300 py-2.5 px-6 rounded-full border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all font-semibold shadow-gold-soft"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-glow" />
            Админ-панель
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Phone size={12} className="text-amber-600/70" /> {RESTAURANT.phone}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
