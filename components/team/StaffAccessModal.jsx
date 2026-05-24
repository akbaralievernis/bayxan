"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X, Lock, ShieldCheck } from "lucide-react";
import GlassInput from "@/components/ui/GlassInput";
import { verifyCredentials } from "@/lib/api/staff";
import { setStaffSession } from "@/lib/staffSession";
import { cn } from "@/lib/utils";

/**
 * Hidden staff-only credential gateway.
 * Verifies credentials against `lib/api/staff#verifyCredentials` and, on success,
 * persists the session to sessionStorage then routes to /staff.
 */
export default function StaffAccessModal({ onClose }) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login.trim() || !password.trim() || phase !== "idle") return;

    setPhase("accessing");
    const result = await verifyCredentials(login.trim(), password.trim());

    if (result.ok) {
      setStaffSession(result.session);
      setPhase("granted");
      // Brief celebratory beat, then route into the portal.
      setTimeout(() => router.push("/staff"), 650);
    } else {
      setPhase("denied");
      setPassword("");
      setTimeout(() => setPhase("idle"), 1400);
    }
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
          className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-850/50 transition-colors"
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
              : "bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
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
        <h2 className="font-display text-2xl text-stone-800 dark:text-[#FDF6E2] mb-1.5">
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
            ? "Проверяем данные в системе…"
            : denied
            ? "Попробуйте ещё раз."
            : "Введите ваши логин и пароль для входа в портал смен."}
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <GlassInput
            ref={inputRef}
            label="Логин"
            type="text"
            autoComplete="username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={accessing || granted}
            required
            placeholder="ivanov"
          />

          <GlassInput
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={accessing || granted}
            required
            placeholder="••••"
          />

          <motion.button
            type="submit"
            disabled={accessing || granted || !login.trim() || !password.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full !mt-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-white dark:text-stone-900 bg-amber-600 dark:bg-gradient-to-br dark:from-amber-300 dark:via-gold-400 dark:to-yellow-600 shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accessing ? "Вход..." : "Войти"}
          </motion.button>
        </form>

        <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-stone-400">
          · Bayhan Staff Portal · v0.1 ·
        </p>
      </motion.div>
    </motion.div>
  );
}
