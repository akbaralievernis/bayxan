"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { RESTAURANT } from "@/lib/constants";

const HEADING_LINES = [
  { text: "Где степь", accent: false },
  { text: "встречает", accent: false },
  { text: "огонь.", accent: true },
];

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

      {/* Content */}
      <motion.div
        style={{ y: fgY, opacity: fade }}
        className="relative z-10 h-full mx-auto max-w-7xl px-6 sm:px-10 flex flex-col justify-end pb-20 sm:pb-28"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-gold-300/50 text-amber-800 text-[11px] uppercase tracking-[0.3em] shadow-glass">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shadow-gold-soft animate-pulse-glow" />
            Теперь открыты в Бишкеке
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-stone-600 text-xs">
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <Star size={12} className="fill-amber-500 text-amber-500" />
            <span className="ml-2">4.9 · 1 240 отзывов</span>
          </span>
        </motion.div>

        {/* Heading — staggered lines */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="font-display leading-[0.95] tracking-tight text-balance text-stone-900 text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] max-w-5xl"
        >
          {HEADING_LINES.map((l, i) => (
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
          className="mt-8 max-w-xl text-stone-700 text-base sm:text-lg leading-relaxed"
        >
          Традиции Востока, современная подача. {RESTAURANT.name} —
          пространство, где каждый вкус рассказывает свою историю.
          Открыты ежедневно, по предварительной брони.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <GoldButton href="/booking" variant="primary">
            Забронировать стол
          </GoldButton>
          <GoldButton href="/menu" variant="ghost">
            Посмотреть меню
          </GoldButton>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-14 hidden sm:grid grid-cols-3 max-w-2xl gap-px bg-white/40 border border-white/85 rounded-2xl overflow-hidden shadow-glass"
        >
          {[
            { k: "12+", l: "Авторских блюд" },
            { k: "9",   l: "Лет мастерства" },
            { k: "VIP", l: "Кабины · терраса" },
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
        <span className="text-[10px] uppercase tracking-[0.35em]">Вниз</span>
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
