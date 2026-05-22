"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Trash2, Copy } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function BookingSuccess({ bookingId, onClose }) {
  const clearCart = useCartStore((s) => s.clearCart);

  // Esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const copyId = async () => {
    try {
      await navigator.clipboard?.writeText(bookingId);
    } catch {/* noop */}
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Бронирование подтверждено"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/85 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Ambient glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(102,252,241,0.7), transparent 60%)",
          }}
        />
      </motion.div>

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative w-full max-w-md glass-panel neon-ring rounded-3xl p-8 sm:p-10 text-center"
      >
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.12, stiffness: 240, damping: 16 }}
          className="mx-auto w-20 h-20 rounded-full bg-neon shadow-neon grid place-items-center mb-6 animate-pulse-glow"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#070809"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
              d="M5 12.5l5 5L20 7"
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.35 }}
          className="font-display text-3xl text-white mb-2"
        >
          Готово!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.35 }}
          className="text-white/65 leading-relaxed mb-6 text-balance"
        >
          Бронирование подтверждено. Мы пришлём напоминание за час до визита.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.35 }}
          className="bg-obsidian-900/80 border border-white/5 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-3"
        >
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
              Номер брони
            </div>
            <div className="font-display text-xl text-neon tabular-nums">
              {bookingId}
            </div>
          </div>
          <button
            type="button"
            onClick={copyId}
            aria-label="Скопировать номер брони"
            className="shrink-0 w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/60 hover:text-neon hover:border-neon/60 transition-colors"
          >
            <Copy size={14} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.35 }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Link
            href="/"
            onClick={() => { clearCart(); onClose?.(); }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-neon text-obsidian-950 text-xs font-bold uppercase tracking-wider shadow-neon hover:shadow-[0_0_32px_rgba(102,252,241,0.65)] transition-shadow"
          >
            <Home size={14} strokeWidth={2.6} /> На главную
          </Link>
          <button
            type="button"
            onClick={() => { clearCart(); onClose?.(); }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-white/15 text-white/70 text-xs uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
          >
            <Trash2 size={14} /> Очистить корзину
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
