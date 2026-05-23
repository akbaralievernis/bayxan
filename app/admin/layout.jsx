"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  LogOut,
  ShieldCheck,
  Users,
  Armchair,
  Receipt,
} from "lucide-react";
import { getAdminSession, clearAdminSession } from "@/lib/adminSession";
import { RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AdminSessionContext = createContext(null);
export function useAdminSession() {
  return useContext(AdminSessionContext);
}

const NAV = [
  { href: "/admin",          label: "Сводка",     icon: LayoutDashboard, exact: true },
  { href: "/admin/orders",   label: "Заказы",     icon: Receipt },
  { href: "/admin/tables",   label: "Столы",      icon: Armchair },
  { href: "/admin/bookings", label: "Брони",      icon: CalendarCheck },
  { href: "/admin/menu",     label: "Меню",       icon: UtensilsCrossed },
  { href: "/admin/staff",    label: "Сотрудники", icon: Users },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(undefined); // undefined = checking

  // Skip auth gate on the login page itself
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setSession(null);
      return;
    }
    const s = getAdminSession();
    if (!s || !s.is_admin) {
      router.replace("/admin/login");
      return;
    }
    setSession(s);
  }, [router, isLogin]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0F0A07] text-[#FDF6E2]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <ShieldCheck size={20} className="text-amber-400 animate-pulse-glow" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-amber-400/70">
            Проверка доступа…
          </span>
        </motion.div>
      </div>
    );
  }

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  return (
    <AdminSessionContext.Provider value={session}>
      <div className="min-h-screen bg-[#0F0A07] text-[#FDF6E2] flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-amber-900/30 bg-[#0F0A07]/85 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-2.5 group no-tap-highlight">
              <img
                src="/logo.jpg"
                alt="Байхан Logo"
                className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
              />
              <span className="font-display text-base tracking-[0.25em] text-[#FDF6E2]">
                {RESTAURANT.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.35em] text-amber-400">
                  admin
                </span>
              </span>
            </Link>

            {/* Inline nav (desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3.5 py-2 text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 rounded-full",
                      active
                        ? "text-amber-300"
                        : "text-stone-400 hover:text-amber-300"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-pill"
                        className="absolute inset-0 rounded-full bg-amber-500/10 border border-amber-500/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={13} className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-[13px] text-[#FDF6E2] font-medium">{session?.name || "Администратор"}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
                  {session?.role || "Админ"}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full grid place-items-center bg-amber-500/15 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                {session?.name ? session.name.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("") : "?"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-900/40 text-stone-400 text-[11px] uppercase tracking-wider hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>

          {/* Mobile nav row */}
          <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider border transition-colors",
                    active
                      ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
                      : "text-stone-400 border-amber-900/30"
                  )}
                >
                  <Icon size={12} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </AdminSessionContext.Provider>
  );
}
