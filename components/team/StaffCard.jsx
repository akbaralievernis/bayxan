"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function StaffCard({ person }) {
  const [imgError, setImgError] = useState(false);

  // Deterministic gradient seeded by id — same person → same colors across renders.
  const seed = (person?.id || person?.name || "st-default")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const hueA = seed % 360;
  const hueB = (hueA + 55) % 360;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "glass-panel",
        "transition-shadow duration-300",
        "hover:border-gold-300/50 hover:shadow-gold-soft"
      )}
    >
      {/* Avatar */}
      <div className="relative aspect-square overflow-hidden bg-stone-50">
        {!imgError && person?.imagePlaceholder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.imagePlaceholder}
            alt={person?.name || "Сотрудник"}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              background: `linear-gradient(135deg, hsl(${hueA} 60% 94%), hsl(${hueB} 50% 88%))`,
            }}
          >
            <span className="font-display text-5xl text-gold-700/60 select-none tracking-wider">
              {initials(person?.name || "Сотрудник")}
            </span>
          </div>
        )}

        {/* Bottom fade for name legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ivory-200 via-ivory-100/60 to-transparent" />

        {/* Name + role pinned to bottom of image */}
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-700 mb-1">
            {person?.role || "Персонал"}
          </div>
          <h3 className="font-display text-lg leading-tight text-stone-800 text-balance font-medium">
            {person?.name || "Сотрудник"}
          </h3>
        </div>

        {/* Hover gold outline */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-300/0 group-hover:ring-gold-300/20 transition-all duration-300 pointer-events-none" />
      </div>

      {/* Meta */}
      <div className="px-3.5 py-3 space-y-1.5 text-[12px] text-stone-600">
        <div className="flex items-center gap-2">
          <Award size={12} className="text-amber-600 shrink-0" />
          <span className="truncate">{person?.experience || "Опыт: не указан"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-amber-600 shrink-0" />
          <span className="truncate">{person?.shiftInfo || "График: не указан"}</span>
        </div>
      </div>
    </motion.article>
  );
}
