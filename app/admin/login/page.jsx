"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { verifyPin } from "@/lib/api/staff";
import { setAdminSession } from "@/lib/adminSession";
import { RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PIN_LEN = 4;
// Stub mode (no Supabase env) → these PINs are admins.
const STUB_ADMIN_PINS = ["0000", "9012"];

export default function AdminLoginPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  // Autofocus first cell on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // When all digits are filled, attempt login
  useEffect(() => {
    if (digits.every((d) => d.length === 1) && !busy) {
      submit(digits.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  function handleChange(i, value) {
    // Strip everything that isn't a digit, keep just the last char
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < PIN_LEN - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[i - 1] = "";
        return next;
      });
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LEN);
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    for (let i = 0; i < PIN_LEN; i++) next[i] = pasted[i] || "";
    setDigits(next);
    inputs.current[Math.min(pasted.length, PIN_LEN - 1)]?.focus();
  }

  async function submit(pin) {
    setBusy(true);
    setError("");
    const result = await verifyPin(pin);
    setBusy(false);

    if (!result.ok || !result.session) {
      fail(result.error || "Неверный PIN");
      return;
    }

    // In stub mode `is_admin` isn't included. Recognise admin PINs from the
    // known list so we can still demo the panel.
    const isAdmin =
      result.session.is_admin === true || STUB_ADMIN_PINS.includes(pin);

    if (!isAdmin) {
      fail("Этот PIN не имеет доступа к админ-панели");
      return;
    }

    setAdminSession({ ...result.session, is_admin: true });
    router.replace("/admin");
  }

  function fail(message) {
    setError(message);
    setShake(true);
    setDigits(["", "", "", ""]);
    setTimeout(() => {
      setShake(false);
      inputs.current[0]?.focus();
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#0F0A07] text-[#FDF6E2] grid place-items-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.20), transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative w-full max-w-sm rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/40 p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Brand */}
        <div className="text-center mb-7">
          <div className="mx-auto w-12 h-12 rounded-xl grid place-items-center bg-amber-500/15 border border-amber-500/40 mb-4">
            <ShieldCheck size={20} className="text-amber-400" />
          </div>
          <div className="font-display text-2xl tracking-[0.25em] text-[#FDF6E2]">
            {RESTAURANT.name}
            <span className="ml-1.5 text-[9px] uppercase tracking-[0.35em] text-amber-400">
              admin
            </span>
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-amber-400/70">
            · Вход для администратора ·
          </p>
        </div>

        {/* PIN entry */}
        <motion.div
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 sm:gap-3"
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={busy}
              type="password"
              className={cn(
                "w-12 h-14 sm:w-14 sm:h-16 text-center font-display text-2xl",
                "rounded-xl bg-black/40 border border-amber-900/50",
                "text-[#FDF6E2] caret-amber-400",
                "focus:outline-none focus:border-amber-500/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.18)]",
                "transition-all disabled:opacity-50",
                error && "border-red-500/60"
              )}
            />
          ))}
        </motion.div>

        {/* Status */}
        <div className="mt-6 h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {busy ? (
              <motion.span
                key="busy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-amber-400/80"
              >
                <Loader2 size={12} className="animate-spin" /> Проверка…
              </motion.span>
            ) : error ? (
              <motion.span
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-xs text-red-400"
              >
                <Lock size={11} /> {error}
              </motion.span>
            ) : (
              <motion.span
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] uppercase tracking-[0.3em] text-stone-500"
              >
                Введите 4-значный PIN
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[10px] text-stone-600">
          В stub-режиме доступ: <span className="text-amber-400 tabular-nums">0000</span> или <span className="text-amber-400 tabular-nums">9012</span>
        </p>
      </motion.div>
    </div>
  );
}
