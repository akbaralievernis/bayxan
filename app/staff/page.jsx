"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Sparkles } from "lucide-react";
import ShiftCard from "@/components/staff/ShiftCard";
import { useStaffSession } from "./layout";
import { supabase } from "@/lib/supabase/client";
import {
  getMyShifts,
  getAvailableExchanges,
  requestExchange,
  claimExchange,
  mapShift,
} from "@/lib/api/staff";
import { cn } from "@/lib/utils";

export default function StaffDashboard() {
  const session = useStaffSession();

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // Initial load
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      const [mine, others] = await Promise.all([
        getMyShifts(session.id),
        getAvailableExchanges(session.id),
      ]);
      if (cancelled) return;
      // Dedupe by id — defensive in case mock data overlaps
      const map = new Map();
      [...mine, ...others].forEach((s) => map.set(s.id, s));
      setShifts(Array.from(map.values()));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [session]);

  // Supabase Realtime WebSockets subscription to the public.shifts table
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("shifts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shifts",
        },
        async (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          if (eventType === "DELETE") {
            setShifts((prev) => prev.filter((s) => s.id !== oldRow.id));
          } else if (eventType === "INSERT" || eventType === "UPDATE") {
            // Realtime postgres_changes payloads don't include foreign relations,
            // so we fetch the updated row joined with its staff_profile.
            const { data, error } = await supabase
              .from("shifts")
              .select("*, staff_profiles(name, role)")
              .eq("id", newRow.id)
              .single();

            if (!error && data) {
              const mapped = mapShift(data);
              setShifts((prev) => {
                const filtered = prev.filter((s) => s.id !== mapped.id);
                return [...filtered, mapped];
              });
            } else {
              // Fallback to row data with placeholder labels if API fetch fails
              const mapped = mapShift({
                ...newRow,
                staff_profiles: { name: "Сотрудник", role: "Персонал" }
              });
              setShifts((prev) => {
                const filtered = prev.filter((s) => s.id !== mapped.id);
                return [...filtered, mapped];
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const myShifts = useMemo(
    () =>
      shifts
        .filter((s) => s.userId === session?.id && s.status === "mine")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [shifts, session]
  );

  const exchangeShifts = useMemo(
    () =>
      shifts
        .filter((s) => s.status === "offered" && s.userId !== session?.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [shifts, session]
  );

  /* ─────────── Optimistic actions ─────────── */

  async function offerShift(id) {
    setBusyId(id);
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "offered" } : s))
    );
    const res = await requestExchange(id);
    if (!res.ok) {
      // rollback
      setShifts((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "mine" } : s))
      );
    }
    setBusyId(null);
  }

  async function takeShift(id) {
    setBusyId(id);
    const prevSnapshot = shifts.find((s) => s.id === id);
    setShifts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "mine",
              userId: session.id,
              userName: session.name,
              userRole: session.role,
            }
          : s
      )
    );
    const res = await claimExchange(id, session);
    if (!res.ok && prevSnapshot) {
      setShifts((prev) => prev.map((s) => (s.id === id ? prevSnapshot : s)));
    }
    setBusyId(null);
  }

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Доброе утро";
    if (h >= 12 && h < 18) return "Добрый день";
    if (h >= 18 && h < 23) return "Добрый вечер";
    return "Доброй ночи";
  }, []);

  const firstName = session?.name?.split(" ")[0] ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Greeting */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 sm:mb-8 flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-600 mb-2 font-semibold">
            · Биржа смен ·
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-stone-800 leading-tight">
            {greeting},{" "}
            <span className="gold-text italic">{firstName}.</span>
          </h1>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2">
          <StatChip icon={Calendar} label="Мои смены" value={myShifts.length} accent="gold" />
          <StatChip icon={Users}    label="Биржа"     value={exchangeShifts.length} accent="ember" />
        </div>
      </motion.header>

      {/* Two-column board */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-start">
        {/* ──────── Col 1 — My Shifts ──────── */}
        <Column
          title="Мои смены"
          subtitle={`${myShifts.length} ${plurShifts(myShifts.length)} впереди`}
          accent="gold"
        >
          {loading ? (
            <SkeletonList />
          ) : myShifts.length === 0 ? (
            <Empty
              title="Свободно"
              body="На неделе у вас нет назначенных смен."
            />
          ) : (
            <ul className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {myShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    mode="mine"
                    busy={busyId === shift.id}
                    onAction={() => offerShift(shift.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Column>

        {/* ──────── Col 2 — Exchange Board ──────── */}
        <Column
          title="Биржа смен"
          subtitle={`${exchangeShifts.length} ${plurAvail(exchangeShifts.length)}`}
          accent="ember"
        >
          {loading ? (
            <SkeletonList />
          ) : exchangeShifts.length === 0 ? (
            <Empty
              title="Тишина"
              body="Никто не предлагает свои смены."
            />
          ) : (
            <ul className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {exchangeShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    mode="exchange"
                    busy={busyId === shift.id}
                    onAction={() => takeShift(shift.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Column>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-[10px] uppercase tracking-[0.3em] text-stone-400">
        · realtime-ready · supabase channel will plug in here ·
      </p>
    </div>
  );
}

/* ──────────────────────── Subcomponents ──────────────────────── */

function Column({ title, subtitle, accent = "gold", children }) {
  const dotClass = accent === "ember" ? "bg-stone-400" : "bg-amber-500";
  return (
    <section className="glass-panel rounded-2xl p-3 sm:p-4 min-h-[220px]">
      <header className="px-1 mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)} />
          <h2 className="text-xs uppercase tracking-[0.3em] text-stone-800 font-semibold">
            {title}
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 tabular-nums font-medium">
          {subtitle}
        </span>
      </header>
      {children}
    </section>
  );
}

function StatChip({ icon: Icon, label, value, accent }) {
  const color = accent === "ember" ? "text-stone-500" : "text-amber-600";
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-stone-200/50">
      <Icon size={12} className={color} />
      <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium">
        {label}
      </span>
      <span className={cn("font-display text-sm tabular-nums", color)}>
        {value}
      </span>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-[88px] rounded-xl bg-stone-200/50 border border-stone-200/30 animate-pulse"
        />
      ))}
    </ul>
  );
}

function Empty({ title, body }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="px-4 py-10 text-center"
    >
      <div className="mx-auto w-10 h-10 rounded-full bg-stone-100 border border-stone-200/50 grid place-items-center mb-3">
        <Sparkles size={14} className="text-stone-400" />
      </div>
      <div className="font-display text-base text-stone-700 mb-1">{title}</div>
      <div className="text-[12px] text-stone-400">{body}</div>
    </motion.div>
  );
}

function plurShifts(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "смена";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "смены";
  return "смен";
}

function plurAvail(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "доступна";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "доступны";
  return "доступно";
}
