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

// Map roles to the portal each can access.
const ROLE_PORTAL = {
  admin:   "/admin",
  manager: "/admin",
  waiter:  "/waiter",
  cashier: "/cashier",
  kitchen: "/kitchen",
  cook:    "/staff",   // cooks land on the staff exchange board
};

/**
 * Generic PIN-login screen reused by /admin/login, /waiter/login, /cashier/login.
 *
 * Props:
 *   - portal: "admin" | "waiter" | "cashier" — restricts which roles can enter.
 *             A user with role outside the allowed set sees an error.
 *   - allowedRoles: array of role IDs (e.g. ["waiter","manager"]).
 *   - subtitle: header text under the brand.
 *   - onSuccess(session): called when login succeeds AND role is allowed.
 *                         Default: stores in adminSession and redirects.
 */
export default function PinLogin({
  portal = "admin",
  allowedRoles,
  subtitle = "· Вход для администратора ·",
  hint,
  onSuccess,
}) {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (digits.every((d) => d.length === 1) && !busy) {
      submit(digits.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  function handleChange(i, value) {
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
      return fail(result.error || "Неверный PIN");
    }

    const session = result.session;
    const role = session.role;

    // Check the role is allowed for this portal
    if (allowedRoles && !allowedRoles.includes(role)) {
      const targetPortal = ROLE_PORTAL[role];
      return fail(
        targetPortal
          ? `Этот PIN относится к роли «${roleLabel(role)}». Вход через ${targetPortal}.`
          : `Этот PIN не имеет доступа к панели «${portal}»`
      );
    }

    if (onSuccess) {
      onSuccess(session);
    } else {
      // Default flow: persist as admin session + route by role.
      setAdminSession({ ...session, is_admin: session.is_admin || role === "admin" });
      router.replace(ROLE_PORTAL[role] || "/admin");
    }
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
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.20), transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/40 p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 flex justify-center">
            <img
              src="/logo.jpg"
              alt="Байхан Logo"
              className="w-12 h-12 rounded-full object-cover border border-amber-500/30 shadow-md"
            />
          </div>
          <div className="font-display text-2xl tracking-[0.25em] text-[#FDF6E2]">
            {RESTAURANT.name}
            <span className="ml-1.5 text-[9px] uppercase tracking-[0.35em] text-amber-400">
              {portal}
            </span>
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-amber-400/70">
            {subtitle}
          </p>
        </div>

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

        <div className="mt-6 min-h-6 flex items-center justify-center text-center px-2">
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
                className="inline-flex items-start gap-1.5 text-xs text-red-400 leading-snug"
              >
                <Lock size={11} className="mt-0.5 shrink-0" /> {error}
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

        {hint && (
          <p className="mt-6 text-center text-[10px] text-stone-600">{hint}</p>
        )}
      </motion.div>
    </div>
  );
}

function roleLabel(id) {
  return {
    admin: "Администратор",
    manager: "Менеджер",
    waiter: "Официант",
    cashier: "Кассир",
    kitchen: "Кухня",
    cook: "Повар",
  }[id] || id;
}
