"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

/**
 * Four signature dishes presented in an asymmetric editorial grid. Each card
 * is dark (matching the "Premium Deep Gold" surface) and sits on the light
 * ivory canvas — the contrast makes the photography pop.
 */
const DISHES = [
  {
    key: "d1",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80",
    badge: "chef",
    span: "lg:col-span-2 lg:row-span-2",
    aspect: "aspect-[4/5] lg:aspect-auto lg:h-full",
  },
  {
    key: "d2",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    badge: "hit",
    span: "lg:col-span-2",
    aspect: "aspect-[16/9] lg:aspect-auto lg:h-full",
  },
  {
    key: "d3",
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    badge: null,
    span: "",
    aspect: "aspect-square lg:aspect-auto lg:h-full",
  },
  {
    key: "d4",
    img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
    badge: "new",
    span: "",
    aspect: "aspect-square lg:aspect-auto lg:h-full",
  },
];

export default function Signatures() {
  const t = useT();

  return (
    <section className="relative bg-ivory dark:bg-[#120D0A] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-700 dark:text-gold-400 mb-3 font-semibold">
              {t("sig.eyebrow")}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-stone-900 dark:text-[#FDF6E2]">
              {t("sig.heading.l1")}<br />
              <span className="gold-text italic">{t("sig.heading.l2")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-stone-600 dark:text-stone-300 leading-relaxed">
              {t("sig.tagline")}
            </p>
          </div>

          <Link
            href="/menu"
            className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-full border border-gold-400/60 text-amber-800 dark:text-gold-300 text-xs uppercase tracking-wider hover:bg-amber-50/70 dark:hover:bg-gold-500/10 hover:border-gold-500 dark:hover:border-gold-400 hover:shadow-gold-soft transition-all group"
          >
            {t("sig.cta")}
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:auto-rows-[260px]">
          {DISHES.map((d, i) => (
            <SignatureCard key={d.key} dish={d} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SignatureCard({ dish, index, t }) {
  const name = t(`sig.${dish.key}.name`);
  const desc = t(`sig.${dish.key}.desc`);
  const price = t(`sig.${dish.key}.price`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl bg-[#1A1410] ${dish.span} ${dish.aspect} cursor-pointer`}
    >
      {/* Background image with subtle zoom on hover */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${dish.img}')` }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Dark gradient overlay — heavier at the bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Gold inset border on hover */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl ring-0 ring-amber-400/0 group-hover:ring-1 group-hover:ring-amber-400/60 transition-all duration-500 pointer-events-none"
      />

      {/* Badge */}
      {dish.badge && <Badge variant={dish.badge} t={t} />}

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl sm:text-2xl text-[#FDF6E2] leading-tight">
            {name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300/90 line-clamp-2 leading-relaxed">
            {desc}
          </p>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-semibold tabular-nums whitespace-nowrap">
          {price}
        </div>
      </div>
    </motion.article>
  );
}

function Badge({ variant, t }) {
  const icons = {
    chef: <Sparkles size={11} className="text-amber-300" />,
    hit:  <Flame    size={11} className="text-amber-300" />,
    new:  null,
  };
  const label = t(`sig.badge.${variant}`);
  return (
    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/40 text-[10px] uppercase tracking-[0.25em] text-amber-200 font-semibold">
      {icons[variant]}
      {label}
    </div>
  );
}
