"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, LogOut } from "lucide-react";
import { getStaffSession, clearStaffSession } from "@/lib/staffSession";
import { RESTAURANT } from "@/lib/constants";

const StaffSessionContext = createContext(null);

export function useStaffSession() {
  return useContext(StaffSessionContext);
}

export default function StaffLayout({ children }) {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = still checking

  // Auth gate
  useEffect(() => {
    const s = getStaffSession();
    if (!s) {
      router.replace("/team");
      return;
    }
    setSession(s);
  }, [router]);

  if (session === undefined) {
    return (
      <div className="min-h-screen grid place-items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-3 text-stone-500"
        >
          <ShieldCheck size={20} className="text-amber-600 animate-pulse-glow" />
          <span className="text-[11px] uppercase tracking-[0.3em]">
            Проверка доступа…
          </span>
        </motion.div>
      </div>
    );
  }

  function handleLogout() {
    clearStaffSession();
    router.replace("/team");
  }

  return (
    <StaffSessionContext.Provider value={session}>
      <div className="min-h-screen flex flex-col">
        {/* Compact staff top-bar */}
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Link
              href="/staff"
              className="flex items-center gap-2.5 group no-tap-highlight"
            >
              <img
                src="/logo.jpeg"
                alt="Байхан Logo"
                className="w-7 h-7 rounded-full object-cover border border-amber-200 shadow-sm"
              />
              <span className="font-display text-base tracking-[0.25em] text-stone-800">
                {RESTAURANT.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.35em] text-amber-600">
                  staff
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-[13px] text-stone-800 font-medium">{session.name}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-amber-600 font-semibold">
                  {session.role}
                </div>
              </div>

              {/* Avatar dot — initials */}
              <div className="w-8 h-8 rounded-full grid place-items-center bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700 font-semibold">
                {session.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-600 text-[11px] uppercase tracking-wider hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                aria-label="Выйти из портала"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </StaffSessionContext.Provider>
  );
}
