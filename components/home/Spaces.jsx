"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { useT } from "@/components/providers/LocaleProvider";

const SPACES = [
  {
    key: "s1",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80",
  },
  {
    key: "s2",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80",
  },
  {
    key: "s3",
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function Spaces() {
  const t = useT();
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative bg-[#120D0A] text-[#FDF6E2] overflow-hidden"
    >
      {/* Top fade — handoff from Signatures section above (ivory in light theme,
          chocolate in dark theme so the seam disappears either way). */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FDFBF7] dark:from-[#120D0A] to-transparent pointer-events-none z-20"
      />

      {/* Background image with crossfade between active spaces + parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={SPACES[active].key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${SPACES[active].img}')` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Heavy dark wash so text stays legible regardless of which image is showing */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#120D0A] via-[#120D0A]/85 to-[#120D0A]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#120D0A]/40 via-transparent to-[#120D0A]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-36">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-12 lg:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400 mb-3 font-semibold">
            {t("spaces.eyebrow")}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            {t("spaces.heading.l1")}<br />
            <span className="gold-text italic">{t("spaces.heading.l2")}</span>
          </h2>
          <p className="mt-5 text-stone-300 leading-relaxed">
            {t("spaces.tagline")}
          </p>
        </motion.div>

        {/* Two-column: list of spaces (left) + active detail (right) */}
        <div className="grid lg:grid-cols-[1fr,1fr] gap-8 lg:gap-16 items-center">
          {/* Left — spaces list */}
          <div className="space-y-1">
            {SPACES.map((s, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={s.key}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full text-left group relative py-5 sm:py-7 border-b border-amber-900/40 transition-colors hover:border-amber-500/60 focus:outline-none focus-visible:border-amber-400"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-display tabular-nums text-sm transition-colors ${
                          isActive ? "text-amber-400" : "text-stone-500 group-hover:text-amber-500/70"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight transition-colors ${
                          isActive ? "text-[#FDF6E2]" : "text-stone-500 group-hover:text-[#F5E8C0]"
                        }`}
                      >
                        {t(`spaces.${s.key}.name`)}
                      </span>
                    </div>
                    <motion.span
                      animate={{
                        x: isActive ? 0 : -8,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-amber-400 hidden sm:inline"
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 ml-10 text-sm sm:text-base text-stone-300 leading-relaxed max-w-md">
                          {t(`spaces.${s.key}.desc`)}
                        </p>
                        <p className="mt-2 ml-10 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.3em] text-amber-400/80">
                          <Users size={11} />
                          {t(`spaces.${s.key}.cap`)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Right — focused image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={SPACES[active].key}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${SPACES[active].img}')` }}
              />
            </AnimatePresence>

            {/* Gold frame */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(212,175,55,0.45), 0 30px 80px -20px rgba(0,0,0,0.6)",
              }}
            />
            {/* Bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Caption */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80 mb-1">
                  {String(active + 1).padStart(2, "0")} / 03
                </div>
                <div className="font-display text-2xl text-[#FDF6E2]">
                  {t(`spaces.${SPACES[active].key}.name`)}
                </div>
              </div>
              <Link
                href="/booking"
                className="px-4 py-2 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/50 text-amber-200 text-[10px] uppercase tracking-[0.25em] hover:bg-amber-400/30 transition-colors"
              >
                {t("spaces.cta")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade — handoff to light Testimonials below */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none z-20"
      />
    </section>
  );
}
