"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CategoryRail from "@/components/menu/CategoryRail";
import DishGrid from "@/components/menu/DishGrid";
import { CATEGORIES } from "@/lib/mockData";
import { fetchMenu } from "@/lib/api/menu";
import { useT } from "@/components/providers/LocaleProvider";

export default function MenuPage() {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const items = await fetchMenu();
      if (!cancelled) {
        setMenuItems(items || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dishes = useMemo(() => {
    if (activeCategory === "all") return menuItems;
    return menuItems.filter((d) => d.category === activeCategory);
  }, [activeCategory, menuItems]);

  const activeLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? t("menu.title_fallback");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
      {/* Page header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-8 sm:py-12"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-amber-600 mb-3 font-semibold">
          {t("menu.eyebrow")}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-stone-800 dark:text-[#FDF6E2]">
          {t("menu.heading.l1")}<br />
          <span className="gold-text italic">{t("menu.heading.l2")}</span>
        </h1>
        <p className="mt-5 max-w-xl text-stone-500 dark:text-stone-400 leading-relaxed">
          {t("menu.tagline")}
        </p>
      </motion.header>

      {/* Sticky category filter */}
      <CategoryRail active={activeCategory} onChange={setActiveCategory} />

      {/* Active category caption */}
      <motion.div
        key={activeLabel}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mt-6 mb-4"
      >
        <span className="font-display text-2xl text-stone-800 dark:text-[#FDF6E2]">{activeLabel}</span>
        <span className="flex-1 h-px bg-gradient-to-r from-stone-300/60 dark:from-stone-800/30 to-transparent" />
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 tabular-nums">
          {loading ? t("menu.loading") : `${dishes.length} ${pluralize(dishes.length)}`}
        </span>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-white/10 border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <DishGrid dishes={dishes} />
      )}
    </div>
  );
}

function pluralize(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "позиция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "позиции";
  return "позиций";
}
