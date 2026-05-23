"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Users,
  Wallet,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats } from "@/lib/api/admin";
import { formatKGS } from "@/lib/utils";
import { useAdminSession } from "./layout";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminDashboard() {
  const session = useAdminSession();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getDashboardStats();
      if (!cancelled) setStats(s);
    })();
    return () => { cancelled = true; };
  }, []);

  const greeting = useGreeting();
  const firstName = session?.name?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Greeting header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 sm:mb-12"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400 mb-2 font-semibold">
          · Сводка ·
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2] leading-tight">
          {greeting}, <span className="gold-text italic">{firstName}.</span>
        </h1>
        <p className="mt-3 text-stone-400 text-sm">
          Что происходит сегодня в зале.
        </p>
      </motion.header>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <KpiCard
          icon={CalendarCheck}
          label="Брони сегодня"
          value={stats ? stats.today.total : "—"}
          delay={0.05}
        />
        <KpiCard
          icon={Users}
          label="Гостей ожидается"
          value={stats ? stats.today.guests : "—"}
          delay={0.12}
        />
        <KpiCard
          icon={Wallet}
          label="Выручка (предзаказ)"
          value={stats ? formatKGS(stats.today.revenue) : "—"}
          delay={0.2}
          accent
        />
        <KpiCard
          icon={Clock}
          label="Требуют подтверждения"
          value={stats ? stats.pending : "—"}
          delay={0.28}
          urgent={stats?.pending > 0}
        />
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-4 lg:gap-6">
        {/* Upcoming bookings */}
        <Panel title="Ближайшие брони" right={
          <Link
            href="/admin/bookings"
            className="text-[11px] uppercase tracking-wider text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
          >
            Все брони <ArrowRight size={11} />
          </Link>
        }>
          {!stats ? (
            <UpcomingSkeleton />
          ) : stats.upcoming.length === 0 ? (
            <Empty body="На горизонте пусто." />
          ) : (
            <ul className="divide-y divide-amber-900/30">
              {stats.upcoming.map((b, i) => (
                <motion.li
                  key={b.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="py-3 flex items-center gap-3"
                >
                  <div className="w-10 text-center">
                    <div className="font-display text-base text-amber-300 tabular-nums">
                      {b.time?.slice(0, 5)}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.25em] text-stone-500">
                      {shortDate(b.date)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#FDF6E2] truncate">{b.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {b.guests} {plurGuests(b.guests)} · {tableLabel(b.table_type)}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </motion.li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Side cards */}
        <div className="space-y-4">
          <Panel title="Завтра">
            {stats ? (
              <div className="text-center py-2">
                <div className="font-display text-5xl text-amber-300 tabular-nums">
                  {stats.nextDay.count}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  броней
                </div>
                <div className="mt-3 text-[11px] text-stone-400 tabular-nums">
                  {longDate(stats.nextDay.date)}
                </div>
              </div>
            ) : (
              <div className="h-32 animate-pulse bg-amber-900/10 rounded-lg" />
            )}
          </Panel>

          <Panel title="Быстрые ссылки">
            <div className="grid grid-cols-1 gap-2">
              <QuickLink href="/admin/bookings" label="Управление бронями" icon={CalendarCheck} />
              <QuickLink href="/admin/menu"     label="Редактировать меню" icon={TrendingUp} />
              <QuickLink href="/"               label="Открыть сайт"       icon={ArrowRight} external />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Sub-components ─────────────────────── */

function KpiCard({ icon: Icon, label, value, delay = 0, accent, urgent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-5 backdrop-blur-md transition-colors ${
        urgent
          ? "bg-red-500/5 border border-red-500/40 hover:border-red-500/60"
          : accent
          ? "bg-amber-500/10 border border-amber-500/40 hover:border-amber-500/60"
          : "bg-black/30 border border-amber-900/30 hover:border-amber-700/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg grid place-items-center ${
            urgent
              ? "bg-red-500/15 text-red-300"
              : accent
              ? "bg-amber-500/20 text-amber-300"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          <Icon size={16} />
        </div>
      </div>
      <div className={`font-display text-3xl sm:text-4xl tabular-nums leading-tight ${
        urgent ? "text-red-300" : "text-[#FDF6E2]"
      }`}>
        {value}
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-stone-400 leading-relaxed">
        {label}
      </div>
    </motion.div>
  );
}

function Panel({ title, right, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/30 p-5 sm:p-6"
    >
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold">
          {title}
        </h2>
        {right}
      </header>
      {children}
    </motion.section>
  );
}

function QuickLink({ href, label, icon: Icon, external }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-amber-900/30 hover:border-amber-500/40 hover:bg-amber-500/5 text-stone-300 hover:text-amber-300 transition-colors"
    >
      <Icon size={14} className="text-amber-400" />
      <span className="text-sm flex-1">{label}</span>
      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}

function Empty({ body }) {
  return (
    <div className="py-8 text-center text-[12px] text-stone-500">{body}</div>
  );
}

function UpcomingSkeleton() {
  return (
    <ul className="divide-y divide-amber-900/20">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="py-3 flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded bg-amber-900/15" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 bg-amber-900/15 rounded" />
            <div className="h-2 w-1/3 bg-amber-900/10 rounded" />
          </div>
          <div className="w-16 h-5 rounded bg-amber-900/15" />
        </li>
      ))}
    </ul>
  );
}

function useGreeting() {
  const [g, setG] = useState("Здравствуйте");
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) setG("Доброе утро");
    else if (h >= 12 && h < 18) setG("Добрый день");
    else if (h >= 18 && h < 23) setG("Добрый вечер");
    else setG("Доброй ночи");
  }, []);
  return g;
}

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(d);
}

function longDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "2-digit", month: "long" }).format(d);
}

function tableLabel(type) {
  return { standard: "Стол", vip: "VIP-ложа", terrace: "Терраса" }[type] || type;
}

function plurGuests(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "гость";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "гостя";
  return "гостей";
}
