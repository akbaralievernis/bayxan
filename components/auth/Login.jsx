"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Loader2, User } from "lucide-react";
import { verifyCredentials } from "@/lib/api/staff";
import { setAdminSession } from "@/lib/adminSession";
import { RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
 * Generic Login-screen reused by /admin/login, /waiter/login, /cashier/login.
 *
 * Props:
 *   - portal: "admin" | "waiter" | "cashier" — restricts which roles can enter.
 *             A user with role outside the allowed set sees an error.
 *   - allowedRoles: array of role IDs (e.g. ["waiter","manager"]).
 *   - subtitle: header text under the brand.
 *   - onSuccess(session): called when login succeeds AND role is allowed.
 *                         Default: stores in adminSession and redirects.
 */
export default function Login({
  portal = "admin",
  allowedRoles,
  subtitle = "· Вход для администратора ·",
  hint,
  onSuccess,
}) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const loginInputRef = useRef(null);

  useEffect(() => {
    loginInputRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!login.trim() || !password.trim()) return;

    setBusy(true);
    setError("");
    const result = await verifyCredentials(login.trim(), password.trim());
    setBusy(false);

    if (!result.ok || !result.session) {
      return fail(result.error || "Неверный логин или пароль");
    }

    const session = result.session;
    const role = session.role;

    // Check the role is allowed for this portal
    if (allowedRoles && !allowedRoles.includes(role)) {
      const targetPortal = ROLE_PORTAL[role];
      return fail(
        targetPortal
          ? `Этот аккаунт относится к роли «${roleLabel(role)}». Вход через ${targetPortal}.`
          : `Этот аккаунт не имеет доступа к панели «${portal}»`
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
    setPassword("");
    setTimeout(() => {
      setShake(false);
      loginInputRef.current?.focus();
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
              src="/logo.jpeg"
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

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="relative">
            <label className="block text-[10px] tracking-[0.25em] uppercase text-gold-500 mb-1.5 font-semibold pl-1">
              Логин
            </label>
            <div className="relative">
              <input
                ref={loginInputRef}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={busy}
                placeholder="ivanov"
                required
                className={cn(
                  "w-full rounded-xl bg-black/45 border border-amber-900/50 pl-10 pr-4 py-3 text-sm text-[#FDF6E2] caret-amber-400 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.18)] transition-all disabled:opacity-50",
                  error && "border-red-500/60"
                )}
              />
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] tracking-[0.25em] uppercase text-gold-500 mb-1.5 font-semibold pl-1">
              Пароль
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                placeholder="••••"
                required
                className={cn(
                  "w-full rounded-xl bg-black/45 border border-amber-900/50 pl-10 pr-4 py-3 text-sm text-[#FDF6E2] caret-amber-400 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/80 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.18)] transition-all disabled:opacity-50",
                  error && "border-red-500/60"
                )}
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={busy || !login.trim() || !password.trim()}
            whileHover={!busy ? { scale: 1.02 } : undefined}
            whileTap={!busy ? { scale: 0.98 } : undefined}
            className="w-full !mt-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-stone-900 bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 shadow-gold hover:shadow-gold-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" /> Вход...
              </span>
            ) : (
              "Войти"
            )}
          </motion.button>
        </motion.form>

        <div className="mt-6 min-h-6 flex items-center justify-center text-center px-2">
          <AnimatePresence mode="wait">
            {error && (
              <motion.span
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-start gap-1.5 text-xs text-red-400 leading-snug"
              >
                <Lock size={11} className="mt-0.5 shrink-0" /> {error}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {hint && (
          <p className="mt-3 text-center text-[10px] text-stone-650 leading-relaxed max-w-xs mx-auto">
            {hint}
          </p>
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
