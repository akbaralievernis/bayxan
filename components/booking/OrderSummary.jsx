"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatKGS } from "@/lib/utils";
import { useT, useLocale } from "@/components/providers/LocaleProvider";

export default function OrderSummary() {
  const t = useT();
  const { locale } = useLocale();
  const items = useCartStore((s) => s.items);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 text-center bg-white/70 dark:bg-stone-900/40 backdrop-blur-md border border-white/90 dark:border-gold-500/15 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
      >
        <div className="mx-auto w-14 h-14 rounded-full grid place-items-center border border-gold-300/70 dark:border-gold-500/40 bg-white/80 dark:bg-stone-900/60 shadow-gold-soft mb-4">
          <ShoppingBag size={20} className="text-amber-600 dark:text-gold-400" />
        </div>
        <h3 className="font-display text-lg text-stone-900 dark:text-[#FDF6E2] mb-2">{t("order.empty.title")}</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-5">
          {t("order.empty.body")}
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gold-400/50 dark:border-gold-500/40 text-amber-700 dark:text-gold-300 text-xs uppercase tracking-wider hover:bg-amber-50/70 dark:hover:bg-gold-500/10 hover:border-gold-500/80 hover:shadow-gold-soft transition-all"
        >
          {t("order.empty.cta")} <ArrowRight size={12} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden bg-white/70 dark:bg-stone-900/40 backdrop-blur-md border border-white/90 dark:border-gold-500/15 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    >
      <header className="px-5 py-4 border-b border-stone-200/70 dark:border-stone-700/40 bg-white/40 dark:bg-stone-900/40">
        <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700 dark:text-gold-400">
          {t("order.header.title")}
        </h3>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 tabular-nums">
          {items.length} {plur(items.length, locale)} · {count} {locale === "ky" ? "даана" : "шт."}
        </p>
      </header>

      <ul className="divide-y divide-stone-200/70 dark:divide-stone-700/40 max-h-[420px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                {item.imagePlaceholder && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imagePlaceholder}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800 dark:text-[#FDF6E2] line-clamp-1">{item.name}</div>
                <div className="text-[11px] text-stone-400 dark:text-stone-500 tabular-nums">× {item.quantity}</div>
              </div>
              <div className="text-sm text-amber-700 dark:text-gold-300 font-medium tabular-nums">
                {formatKGS(item.price * item.quantity)}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <footer className="px-5 py-4 border-t border-stone-200/70 dark:border-stone-700/40 bg-white/40 dark:bg-stone-900/40 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          {t("order.footer.total")}
        </span>
        <span
          key={total}
          className="font-display text-2xl tabular-nums text-stone-900 dark:text-[#FDF6E2]"
        >
          {formatKGS(total)}
        </span>
      </footer>
    </motion.div>
  );
}

function plur(n, locale) {
  // Kyrgyz nouns don't change for plurality with a counter — single form is fine.
  if (locale === "ky") return "позиция";
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "позиция";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "позиции";
  return "позиций";
}
