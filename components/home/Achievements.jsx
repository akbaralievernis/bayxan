"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useT } from "@/components/providers/LocaleProvider";

/**
 * Thin counter ribbon between Hero and Philosophy. Numeric values tick from
 * 0 → target when scrolled into view (once). Non-numeric values (e.g. "4.9",
 * "180k") are split into numeric prefix + suffix so the counter still runs.
 */
export default function Achievements() {
  const t = useT();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    { k: t("ach.years.k"),  l: t("ach.years.l")  },
    { k: t("ach.dishes.k"), l: t("ach.dishes.l") },
    { k: t("ach.guests.k"), l: t("ach.guests.l") },
    { k: t("ach.rating.k"), l: t("ach.rating.l") },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-ivory border-y border-amber-200/50"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-amber-200/40 rounded-3xl overflow-hidden border border-amber-200/60 shadow-glass my-12 sm:my-16">
        {items.map((item, i) => (
          <motion.div
            key={item.l}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white/80 backdrop-blur-sm px-5 py-6 sm:px-7 sm:py-9 text-center group"
          >
            <div className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight">
              <Counter target={item.k} start={inView} />
            </div>
            <div className="mt-3 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-amber-700/80">
              {item.l}
            </div>
            <div className="mt-3 mx-auto w-8 h-px bg-gold-400/70 group-hover:w-16 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * Animated number counter. Parses the leading digits; everything else (k, +,
 * dots) is kept verbatim as a suffix.
 *
 * Parsing is memoized so the useEffect deps stay stable across renders — if
 * we put the raw match array in deps, every setValue would re-trigger the
 * effect (new object identity) and the animation would never advance past
 * the first frame.
 */
function Counter({ target, start }) {
  const [value, setValue] = useState(0);

  const parsed = useMemo(() => {
    const m = String(target).match(/^([\d.,]+)(.*)$/);
    if (!m) return null;
    return {
      numeric: parseFloat(m[1].replace(",", ".")),
      suffix: m[2],
      decimals: m[1].includes(".") ? 1 : 0,
    };
  }, [target]);

  useEffect(() => {
    if (!start || !parsed) return;
    let raf;
    const duration = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parsed.numeric * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, parsed]);

  if (!parsed) return <span>{target}</span>;

  return (
    <span className="tabular-nums">
      {value.toFixed(parsed.decimals)}
      <span className="gold-text">{parsed.suffix}</span>
    </span>
  );
}
