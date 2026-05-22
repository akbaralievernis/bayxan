"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Custom white-glass dropdown — direct refactor of the former NeonSelect.
 * All Framer Motion (springs, AnimatePresence) and keyboard logic preserved
 * exactly; only Tailwind tokens move to the light/gold system.
 *
 *   options: [{ id, label, hint? }]
 *   value:   id of the active option (or "")
 *   onChange: (id) => void
 */
export default function GlassSelect({
  label,
  value,
  onChange,
  options = [],
  required,
  placeholder = "Выберите…",
  className,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.id === value);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Esc + arrow keys
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && focusIdx >= 0) {
        e.preventDefault();
        onChange(options[focusIdx].id);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, focusIdx, options, onChange]);

  // When opening, focus the currently selected option
  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.id === value);
      setFocusIdx(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group w-full text-left rounded-xl",
          "bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800",
          "shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.25)]",
          "px-4 pt-5 pb-2 pr-10 text-sm text-stone-800 dark:text-[#FDF6E2]",
          "transition-all duration-200",
          "hover:bg-white/95 dark:hover:bg-stone-900/95 hover:border-stone-300 dark:hover:border-stone-700",
          "focus:outline-none",
          open &&
            "bg-white dark:bg-stone-900 border-gold-400/70 dark:border-gold-500/70 " +
            "shadow-[0_0_0_3px_rgba(212,175,55,0.15),inset_0_-1px_0_0_rgba(212,175,55,0.7)] dark:shadow-[0_0_0_3px_rgba(184,134,11,0.15),inset_0_-1px_0_0_rgba(184,134,11,0.7)]"
        )}
      >
        <span className={cn(selected ? "text-stone-800 dark:text-[#FDF6E2]" : "text-stone-400 dark:text-stone-500")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 transition-all duration-200",
            open && "rotate-180 text-amber-600 dark:text-gold-500"
          )}
        />
      </button>

      <label
        htmlFor={id}
        className="absolute pointer-events-none left-4 top-1.5 text-[10px] tracking-[0.25em] uppercase text-gold-700 dark:text-gold-500"
      >
        {label}
        {required && <span className="ml-0.5 text-gold-600 dark:text-gold-500">*</span>}
      </label>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-40 top-full left-0 right-0 mt-2",
              "max-h-64 overflow-y-auto py-1",
              "rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/90 dark:border-stone-800",
              "shadow-[0_12px_40px_rgba(60,40,10,0.10)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
            )}
          >
            {options.map((opt, i) => {
              const isActive = value === opt.id;
              const isFocused = focusIdx === i;
              return (
                <li key={opt.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onMouseEnter={() => setFocusIdx(i)}
                    onClick={() => {
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3 transition-colors",
                      isFocused ? "bg-amber-50 dark:bg-stone-800/80" : "hover:bg-stone-50 dark:hover:bg-stone-800/50",
                      isActive ? "text-amber-900 dark:text-gold-300 font-medium" : "text-stone-800 dark:text-[#FDF6E2]"
                    )}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block leading-tight">{opt.label}</span>
                      {opt.hint && (
                        <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                    {isActive && <Check size={14} className="shrink-0 text-amber-600 dark:text-gold-500" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
