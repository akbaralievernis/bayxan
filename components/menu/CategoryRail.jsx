"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/mockData";

export default function CategoryRail({ active, onChange }) {
  return (
    <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-ivory/80 backdrop-blur-xl border-b border-stone-200/70">
      <div className="relative">
        <div
          className="flex items-center gap-1 overflow-x-auto py-3 no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange(cat.id)}
                className={cn(
                  "relative shrink-0 px-4 py-2 text-sm uppercase tracking-wider whitespace-nowrap transition-colors no-tap-highlight",
                  isActive
                    ? "text-white"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-gold-400 to-yellow-600 shadow-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 font-medium">
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.short}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* edge fades — to ivory, not black */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ivory to-transparent" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
