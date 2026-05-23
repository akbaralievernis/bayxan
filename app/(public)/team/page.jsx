"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StaffGrid from "@/components/team/StaffGrid";
import CareersForm from "@/components/team/CareersForm";
import StaffAccessModal from "@/components/team/StaffAccessModal";
import { STAFF, DEPARTMENTS } from "@/lib/staffData";
import { cn } from "@/lib/utils";
import { useT } from "@/components/providers/LocaleProvider";

// Easter-egg constants
const TAP_GOAL = 5;
const TAP_WINDOW_MS = 2000;

export default function TeamPage() {
  const t = useT();
  const [dept, setDept] = useState("all");
  const [accessOpen, setAccessOpen] = useState(false);

  // Click-burst detector for the hidden staff-portal trigger
  const tapsRef = useRef([]);
  const triggerHeading = () => {
    const now = Date.now();
    // Keep only taps within the rolling window
    tapsRef.current = [
      ...tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS),
      now,
    ];
    if (tapsRef.current.length >= TAP_GOAL) {
      tapsRef.current = [];
      setAccessOpen(true);
    }
  };

  const people = useMemo(() => {
    if (dept === "all") return STAFF;
    return STAFF.filter((p) => p.department === dept);
  }, [dept]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
      {/* ── Header (heading is the hidden trigger) ───────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-8 sm:py-12"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-amber-600 mb-3 font-semibold">
          {t("team.eyebrow")}
        </p>
        <h1
          onClick={triggerHeading}
          className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-stone-800 select-none cursor-default"
          aria-label={`${t("team.heading.l1")} ${t("team.heading.l2")}`}
        >
          {t("team.heading.l1")}<br />
          <span className="gold-text italic">{t("team.heading.l2")}</span>
        </h1>
        <p className="mt-5 max-w-xl text-stone-500 leading-relaxed">
          {t("team.tagline")}
        </p>
      </motion.header>

      {/* ── Department filter ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {DEPARTMENTS.map((d) => {
          const active = dept === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDept(d.id)}
              className={cn(
                "relative px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors no-tap-highlight",
                active ? "text-amber-900 font-semibold" : "text-stone-500 hover:text-stone-800"
              )}
            >
              {active && (
                <motion.span
                  layoutId="dept-pill"
                  className="absolute inset-0 rounded-full bg-amber-100 border border-amber-200/50 shadow-gold-soft"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-medium">{d.label}</span>
            </button>
          );
        })}
        <span className="ml-auto text-[11px] text-stone-400 uppercase tracking-[0.25em] tabular-nums">
          {people.length} {pluralPeople(people.length)}
        </span>
      </div>

      {/* ── Staff grid ───────────────────────────────────────────── */}
      <section className="mb-20">
        <StaffGrid people={people} />
      </section>

      {/* ── Careers section ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid lg:grid-cols-[1fr,1fr] gap-6 lg:gap-10 items-start"
      >
        {/* Left — invitation copy */}
        <div className="lg:pt-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-amber-600 mb-3 font-semibold">
            {t("team.careers.eyebrow")}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-stone-800 leading-[0.95] tracking-tight mb-5">
            {t("team.careers.heading.l1")}<br />
            {t("team.careers.heading.l2")}{" "}
            <span className="gold-text italic">{t("team.careers.heading.l3")}</span>
          </h2>
          <ul className="space-y-3 text-stone-600 text-sm leading-relaxed">
            {["bullet1", "bullet2", "bullet3", "bullet4"].map((k) => (
              <li key={k} className="flex gap-3">
                <span className="text-amber-600 mt-1">·</span>
                {t(`team.careers.${k}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <CareersForm />
      </motion.section>

      {/* ── Hidden staff-portal modal ────────────────────────────── */}
      <AnimatePresence>
        {accessOpen && (
          <StaffAccessModal onClose={() => setAccessOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function pluralPeople(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "человек";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "человека";
  return "человек";
}
