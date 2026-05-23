"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function Philosophy() {
  const t = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#120D0A] text-[#FDF6E2]"
    >
      {/* Ambient — copper glow drifting up */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -top-40 left-1/3 w-[720px] h-[720px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184,115,51,0.22), transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 -right-32 w-[560px] h-[560px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.18), transparent 60%)",
          }}
        />
      </motion.div>

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-16 items-center">
          {/* ───── LEFT — Text ───── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-7"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/70" />
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-amber-400">
                <Flame size={12} className="text-amber-400" />
                {t("philosophy.eyebrow")}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance"
            >
              {t("philosophy.heading.p1")}{" "}
              <span className="gold-text italic">{t("philosophy.heading.p2")}</span>
            </motion.h2>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed text-stone-300 max-w-xl"
            >
              {t("philosophy.body.p1")}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed text-stone-300 max-w-xl"
            >
              {t("philosophy.body.p2")}
            </motion.p>

            {/* Pull quote with drop cap */}
            <motion.blockquote
              variants={fadeUp}
              className="relative mt-10 pl-8 sm:pl-12 py-2 border-l-2 border-amber-500/60"
            >
              <span
                aria-hidden
                className="absolute -left-3 -top-6 font-display text-[110px] sm:text-[140px] leading-none gold-text select-none"
              >
                «
              </span>
              <p className="font-display text-2xl sm:text-3xl leading-snug text-balance text-[#F5E8C0]">
                {t("philosophy.quote")}
              </p>
              <footer className="mt-4 text-[11px] uppercase tracking-[0.35em] text-amber-400/80">
                {t("philosophy.quote.author")}
              </footer>
            </motion.blockquote>
          </motion.div>

          {/* ───── RIGHT — Image with parallax ───── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden rounded-2xl"
          >
            {/* Gold frame */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl pointer-events-none z-20"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(212,175,55,0.35), 0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            />

            {/* Parallax image */}
            <motion.div
              style={{ y: imageY, scale: 1.15 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80')",
                }}
              />
            </motion.div>

            {/* Vignette + warm wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#120D0A]/85 via-[#120D0A]/20 to-transparent z-10" />
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.18), transparent 55%)",
              }}
            />

            {/* Caption chip */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-[10px] uppercase tracking-[0.3em] text-amber-300">
                <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse-glow" />
                {t("philosophy.caption.live")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                {t("philosophy.caption.zone")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top & bottom edge fades — smooth handoff to light Hero above and Footer/next section below */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-ivory dark:from-[#120D0A] to-transparent pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ivory dark:from-[#120D0A] to-transparent pointer-events-none"
      />
    </section>
  );
}
