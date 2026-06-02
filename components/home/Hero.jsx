"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { useT } from "@/components/providers/LocaleProvider";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const lineVariants = {
  hidden: { y: 60, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const t = useT();
  const headingLines = [
    { text: t("hero.heading.l1"), accent: false },
    { text: t("hero.heading.l2"), accent: false },
    { text: t("hero.heading.l3"), accent: true },
  ];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      {/* Layer 1 — image with sunlit wash */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute inset-0 -z-30"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=80')",
          }}
        />
        {/* Warm sunlit overlay — heavy at the bottom where text sits, fading to a soft veil at top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/55 to-ivory" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/40 via-transparent to-yellow-50/30" />
      </motion.div>

      {/* Layer 2 — warm glow blobs (gold + peach replace cyan + ember) */}
      <motion.div
        aria-hidden
        style={{ y: midY }}
        className="absolute inset-0 -z-20"
      >
        <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.30), transparent 60%)" }}
        />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,213,175,0.45), transparent 60%)" }}
        />
      </motion.div>

      {/* Oversized brand mark — sits in the upper-right, balances the heading
          on the lower-left and reinforces brand presence at first paint. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: fgY }}
        className="pointer-events-none absolute top-24 right-4 sm:top-28 sm:right-10 lg:top-32 lg:right-16 z-[5] hidden sm:block"
      >
        <div className="relative">
          {/* Soft gold radial halo */}
          <div
            aria-hidden
            className="absolute inset-0 -m-10 rounded-full blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.45), transparent 65%)",
            }}
          />
          <img
            src="/logo.jpeg"
            alt=""
            className="relative w-44 h-44 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full object-cover border-2 border-white/70 shadow-[0_20px_60px_rgba(60,40,10,0.35)] ring-1 ring-amber-300/50"
          />
          {/* Subtle rotating gold band */}
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.4) 25%, rgba(212,175,55,0) 50%, rgba(212,175,55,0.35) 75%, rgba(212,175,55,0) 100%)",
              WebkitMask:
                "radial-gradient(circle, transparent 60%, black 61%, black 64%, transparent 65%)",
              mask:
                "radial-gradient(circle, transparent 60%, black 61%, black 64%, transparent 65%)",
            }}
          />
        </div>
      </motion.div>

      {/* Content — sits in the lower third of the viewport. Heading sizes
          shrunk so three lines + tagline + CTA + stats fit on a 100svh hero
          without clipping the top line off-screen. */}
      <motion.div
        style={{ y: fgY, opacity: fade }}
        className="relative z-10 h-full mx-auto max-w-7xl px-6 sm:px-10 flex flex-col justify-end pb-16 sm:pb-20"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-gold-300/50 text-amber-800 text-[11px] uppercase tracking-[0.3em] shadow-glass">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-gold-soft animate-pulse-glow" />
            {t("hero.eyebrow")}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-stone-600 text-xs">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span className="ml-2">{t("hero.reviews")}</span>
          </span>
        </motion.div>

        {/* Heading — staggered lines. Scale tuned so three lines never overflow
            the safe area on small laptops (≈768px viewport height). */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="font-display leading-[0.95] tracking-tight text-balance text-stone-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl"
        >
          {headingLines.map((l, i) => (
            <motion.span
              key={i}
              variants={lineVariants}
              className={`block ${l.accent ? "gold-text italic" : ""}`}
            >
              {l.text}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6 max-w-xl text-stone-700 text-sm sm:text-base leading-relaxed"
        >
          {t("hero.tagline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <GoldButton href="/booking" variant="primary">
            {t("hero.cta.book")}
          </GoldButton>
          <GoldButton href="/menu" variant="ghost">
            {t("hero.cta.menu")}
          </GoldButton>
        </motion.div>

        {/* Stats strip — hidden on shorter viewports to preserve breathing room */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 hidden lg:grid grid-cols-3 max-w-2xl gap-px bg-white/40 border border-white/85 rounded-2xl overflow-hidden shadow-glass"
        >
          {[
            { k: t("hero.stats.dishes_k"), l: t("hero.stats.dishes_l") },
            { k: t("hero.stats.years_k"),  l: t("hero.stats.years_l")  },
            { k: t("hero.stats.vip_k"),    l: t("hero.stats.vip_l")    },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/70 backdrop-blur-sm px-5 py-4"
            >
              <div className="font-display text-2xl text-amber-700">{s.k}</div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">{t("hero.scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-amber-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
