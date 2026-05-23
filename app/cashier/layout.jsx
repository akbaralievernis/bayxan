"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Banknote } from "lucide-react";
import { getPosSession, clearPosSession } from "@/lib/waiterSession";
import { RESTAURANT } from "@/lib/constants";

const CashierCtx = createContext(null);
export function useCashierSession() { return useContext(CashierCtx); }

const ALLOWED = ["cashier", "manager", "admin"];

export default function CashierLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/cashier/login";
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (isLogin) { setSession(null); return; }
    const s = getPosSession();
    if (!s || !ALLOWED.includes(s.role)) {
      router.replace("/cashier/login");
      return;
    }
    setSession(s);
  }, [router, isLogin]);

  if (isLogin) return <>{children}</>;

  if (session === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0F0A07] text-amber-400/70 text-[11px] uppercase tracking-[0.3em]">
        Проверка доступа…
      </div>
    );
  }

  function handleLogout() {
    clearPosSession();
    router.replace("/cashier/login");
  }

  return (
    <CashierCtx.Provider value={session}>
      <div className="min-h-screen bg-[#0F0A07] text-[#FDF6E2] flex flex-col">
        <header className="sticky top-0 z-30 border-b border-amber-900/30 bg-[#0F0A07]/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link href="/cashier" className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Байхан Logo"
                className="w-8 h-8 rounded-full object-cover border border-blue-500/35"
              />
              <span className="font-display text-base tracking-[0.25em] text-[#FDF6E2]">
                {RESTAURANT.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.35em] text-blue-400">
                  cashier
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="text-right leading-tight hidden sm:block">
                <div className="text-[13px] text-[#FDF6E2] font-medium">{session.name}</div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-blue-400 font-semibold">
                  {session.title || session.role}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full grid place-items-center bg-blue-500/15 border border-blue-500/40 text-[11px] font-bold text-blue-300">
                {session.name?.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-900/40 text-stone-400 text-[11px] uppercase tracking-wider hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </CashierCtx.Provider>
  );
}
