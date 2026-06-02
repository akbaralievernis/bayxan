"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

const KEYS = ["t1", "t2", "t3", "t4", "t5", "t6"];

/**
 * Auto-scrolling marquee of guest testimonials. Uses CSS-style `animate` on a
 * doubled track so the loop is seamless. Hover pauses via `whileHover`.
 *
 * Two rows scrolling in opposite directions for richer visual texture.
 */
export default function Testimonials() {
  const t = useT();
  const cards = KEYS.map((k) => ({
    key: k,
    quote: t(`test.${k}.quote`),
    name:  t(`test.${k}.name`),
    role:  t(`test.${k}.role`),
  }));

  return (
    <section className="relative bg-ivory dark:bg-[#120D0A] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-28 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-amber-700 dark:text-gold-400 mb-3 font-semibold">
            {t("test.eyebrow")}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-stone-900 dark:text-[#FDF6E2]">
            {t("test.heading.l1")}{" "}
            <span className="gold-text italic">{t("test.heading.l2")}</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee rows — full-bleed */}
      <div className="space-y-5 pb-20 sm:pb-28">
        <MarqueeRow cards={cards} direction="left" speed={48} />
        <MarqueeRow cards={[...cards].reverse()} direction="right" speed={56} />
      </div>

      {/* Edge fade masks — hide hard cuts at viewport edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-ivory dark:from-[#120D0A] to-transparent z-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-ivory dark:from-[#120D0A] to-transparent z-10"
      />
    </section>
  );
}

function MarqueeRow({ cards, direction, speed }) {
  // Triple the list so the infinite loop has enough runway on wide screens.
  const track = [...cards, ...cards, ...cards];
  const from = direction === "left" ? "0%" : "-66.666%";
  const to   = direction === "left" ? "-66.666%" : "0%";

  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ x: from }}
        animate={{ x: to }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: "paused" }}
        className="flex gap-4 sm:gap-5 w-max"
      >
        {track.map((card, i) => (
          <Testimonial key={`${card.key}-${i}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

function Testimonial({ card }) {
  return (
    <motion.figure
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="relative w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-white/80 dark:bg-stone-900/60 backdrop-blur-md border border-white/95 dark:border-gold-500/15 shadow-glass dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] p-5 sm:p-6"
    >
      {/* Soft gold quote glyph */}
      <Quote
        size={24}
        className="absolute -top-2 left-5 text-amber-500/50 dark:text-gold-400/60 fill-amber-100/60 dark:fill-gold-900/30"
        strokeWidth={1.2}
      />

      {/* 5 stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className="fill-amber-500 dark:fill-gold-400 text-amber-500 dark:text-gold-400"
            strokeWidth={1}
          />
        ))}
      </div>

      <blockquote className="text-sm sm:text-[15px] text-stone-700 dark:text-stone-200 leading-relaxed mb-4 line-clamp-4">
        “{card.quote}”
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-3 border-t border-stone-200/70 dark:border-stone-700/40">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 dark:from-gold-400 dark:to-gold-700 grid place-items-center text-white dark:text-stone-900 text-sm font-semibold shadow-gold-soft">
          {card.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-stone-900 dark:text-[#FDF6E2] font-semibold truncate">{card.name}</div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-[0.22em] truncate">{card.role}</div>
        </div>
      </figcaption>
    </motion.figure>
  );
}
