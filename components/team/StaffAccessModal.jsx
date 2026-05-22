"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, Lock, ShieldCheck } from "lucide-react";
import GlassInput from "@/components/ui/GlassInput";
import { verifyPin } from "@/lib/api/staff";
import { setStaffSession } from "@/lib/staffSession";
import { cn } from "@/lib/utils";

/**
 * Hidden staff-only PIN gateway.
 * Verifies the PIN against `lib/api/staff#verifyPin` and, on success,
 * persists the session to sessionStorage then routes to /staff.
 */
export default function StaffAccessModal({ onClose }) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | accessing | denied | granted
  const inputRef = useRef(null);

  // Esc to close + autofocus
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Auto-submit when 4 digits entered
  useEffect(() => {
    if (pin.length !== 4 || phase !== "idle") return;
    let cancelled = false;
    let resetTimer;

    (async () => {
      setPhase("accessing");
      const result = await verifyPin(pin);
      if (cancelled) return;

      if (result.ok) {
        setStaffSession(result.session);
        setPhase("granted");
        // Brief celebratory beat, then route into the portal.
        resetTimer = setTimeout(() => router.push("/staff"), 650);
      } else {
        setPhase("denied");
        setPin("");
        resetTimer = setTimeout(() => setPhase("idle"), 1400);
      }
    })();

    return () => {
      cancelled = true;
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [pin, phase, router]);

  const handleChange = (e) => {
    // digits only, max 4
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(v);
  };

  const accessing = phase === "accessing";
  const denied = phase === "denied";
  const granted = phase === "granted";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label="Доступ для персонала"
      className="fixed inset-0 z-[80] grid place-items-center px-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Ambient grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative w-full max-w-sm glass-panel gold-ring rounded-3xl p-8 text-center"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full text-stone-400 hover:text-amber-600 hover:bg-stone-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, stiffness: 240, damping: 18 }}
          className={cn(
            "mx-auto w-16 h-16 rounded-full grid place-items-center mb-5 border",
            (accessing || granted)
              ? "bg-amber-100 border-amber-300 text-amber-800 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
              : denied
              ? "bg-red-500/15 border-red-400/60"
              : "bg-stone-100 border-stone-200 text-stone-600"
          )}
        >
          {accessing || granted ? (
            <ShieldCheck size={26} className="text-amber-700" strokeWidth={2.4} />
          ) : (
            <Lock
              size={22}
              className={denied ? "text-red-600" : "text-amber-600"}
              strokeWidth={2.2}
            />
          )}
        </motion.div>

        {/* Title */}
        <h2 className="font-display text-2xl text-stone-800 mb-1.5">
          {granted
            ? "Доступ разрешён"
            : accessing
            ? "Идёт авторизация…"
            : denied
            ? "Неверный код"
            : "Доступ для персонала"}
        </h2>
        <p className="text-[12px] text-stone-500 mb-7 leading-relaxed">
          {granted
            ? "Открываем портал смен…"
            : accessing
            ? "Проверяем код в системе…"
            : denied
            ? "Попробуйте ещё раз."
            : "Введите 4-значный PIN-код, выданный администратором."}
        </p>

        {/* PIN input */}
        <div className="relative">
          <GlassInput
            ref={inputRef}
            label="PIN-код"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={handleChange}
            disabled={accessing || granted}
            maxLength={4}
            className={cn(
              "text-center text-3xl font-display tracking-[0.6em] pl-6",
              "tabular-nums caret-amber-500"
            )}
          />

          {/* Loading bar */}
          {(accessing || granted) && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ originX: 0 }}
              className="absolute left-1 right-1 -bottom-0.5 h-0.5 bg-amber-500 shadow-[0_0_12px_rgba(212,175,55,0.5)] rounded-full"
            />
          )}
        </div>

        {/* Tiny segment dots showing entry progress */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              animate={{
                scale: pin.length > i ? 1.15 : 1,
                opacity: pin.length > i ? 1 : 0.3,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className={cn(
                "w-2 h-2 rounded-full",
                pin.length > i ? "bg-amber-500 shadow-[0_0_8px_rgba(212,175,55,0.4)]" : "bg-stone-200"
              )}
            />
          ))}
        </div>

        <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-stone-400">
          · Bayhan Staff Portal · v0.1 ·
        </p>
      </motion.div>
    </motion.div>
  );
}
