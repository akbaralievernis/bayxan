"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Clock,
  Phone,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Search,
} from "lucide-react";
import { listBookings, updateBookingStatus } from "@/lib/api/admin";
import StatusBadge, { STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all",       label: "Все" },
  { id: "pending",   label: "Ожидание" },
  { id: "confirmed", label: "Подтверждено" },
  { id: "today",     label: "Сегодня" },
  { id: "cancelled", label: "Отменены" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = await listBookings();
      if (!cancelled) {
        setBookings(rows);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter((b) => {
      // Filter
      if (filter === "today" && b.date !== today) return false;
      if (["pending", "confirmed", "cancelled"].includes(filter) && b.status !== filter) return false;
      // Search
      if (query) {
        const q = query.toLowerCase();
        const hay = `${b.name} ${b.phone} ${b.booking_id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, filter, query]);

  async function changeStatus(id, status) {
    setBusyId(id);
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    const res = await updateBookingStatus(id, status);
    if (!res.ok) {
      // Rollback by refetching
      const fresh = await listBookings();
      setBookings(fresh);
    }
    setBusyId(null);
  }

  const counts = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      all:       bookings.length,
      pending:   bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      today:     bookings.filter((b) => b.date === today).length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400 mb-2 font-semibold">
          · Брони ·
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2]">
          Управление <span className="gold-text italic">бронями.</span>
        </h1>
      </motion.header>

      {/* Filter + search row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors border",
                  active
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/50"
                    : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                )}
              >
                {f.label}
                <span className={cn(
                  "tabular-nums text-[10px] px-1.5 rounded-full",
                  active ? "bg-amber-500/20 text-amber-200" : "bg-amber-900/30 text-stone-400"
                )}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Поиск по имени, телефону, ID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full bg-black/30 border border-amber-900/30 text-sm text-[#FDF6E2] placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/30 overflow-hidden">
        {loading ? (
          <BookingsSkeleton />
        ) : visible.length === 0 ? (
          <div className="py-16 text-center text-stone-500 text-sm">
            Броней не найдено.
          </div>
        ) : (
          <ul className="divide-y divide-amber-900/30">
            <AnimatePresence initial={false}>
              {visible.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  expanded={expandedId === b.id}
                  busy={busyId === b.id}
                  onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  onChangeStatus={(s) => changeStatus(b.id, s)}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking, expanded, busy, onToggle, onChangeStatus }) {
  const b = booking;
  const hasPreorder = (b.pre_order?.length || 0) > 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "transition-colors",
        expanded ? "bg-amber-500/5" : "hover:bg-amber-500/[0.03]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto_auto] gap-3 sm:gap-4 items-center"
      >
        {/* Time + date column */}
        <div className="w-14 text-center">
          <div className="font-display text-base text-amber-300 tabular-nums leading-none">
            {b.time?.slice(0, 5)}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-stone-500 tabular-nums">
            {shortDate(b.date)}
          </div>
        </div>

        {/* Name + phone */}
        <div className="min-w-0">
          <div className="text-sm sm:text-[15px] text-[#FDF6E2] truncate font-medium">
            {b.name}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
            <span className="tabular-nums">{b.phone}</span>
            <span className="text-stone-700">·</span>
            <span className="text-amber-500/70 tabular-nums">{b.booking_id}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="hidden sm:flex items-center gap-3 text-[12px] text-stone-400">
          <span className="inline-flex items-center gap-1">
            <Users size={11} /> {b.guests}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} /> {tableLabel(b.table_type)}
          </span>
          {hasPreorder && (
            <span className="inline-flex items-center gap-1 text-amber-400">
              <ShoppingBag size={11} /> {formatKGS(b.total)}
            </span>
          )}
        </div>

        {/* Status */}
        <StatusBadge status={b.status} />

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={cn("text-stone-500 transition-transform", expanded && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-amber-900/30 bg-black/20"
          >
            <div className="px-4 sm:px-6 py-5 grid sm:grid-cols-[1fr,auto] gap-5">
              {/* Details */}
              <div className="space-y-3 text-sm">
                <DetailRow icon={Calendar} label="Дата" value={longDate(b.date)} />
                <DetailRow icon={Clock}    label="Время" value={b.time?.slice(0, 5)} />
                <DetailRow icon={Users}    label="Гостей" value={`${b.guests} · ${eventLabel(b.event_type)}`} />
                <DetailRow icon={Phone}    label="Телефон" value={b.phone} />
                {b.requests && (
                  <DetailRow icon={ChevronRight} label="Пожелания" value={b.requests} />
                )}

                {hasPreorder && (
                  <div className="mt-4 rounded-xl bg-black/30 border border-amber-900/30 p-3">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-amber-400 mb-2 font-semibold inline-flex items-center gap-1.5">
                      <ShoppingBag size={11} /> Предзаказ
                    </div>
                    <ul className="space-y-1.5 text-[13px]">
                      {b.pre_order.map((item) => (
                        <li key={item.id} className="flex items-center justify-between">
                          <span className="text-stone-300 truncate">
                            {item.name} <span className="text-stone-500">× {item.quantity}</span>
                          </span>
                          <span className="text-amber-300 tabular-nums">
                            {formatKGS(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-amber-900/30 flex items-center justify-between text-sm">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400">Итого</span>
                      <span className="font-display text-lg text-amber-300 tabular-nums">
                        {formatKGS(b.total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status actions */}
              <div className="sm:w-56">
                <div className="text-[10px] uppercase tracking-[0.25em] text-amber-400 mb-2 font-semibold">
                  Изменить статус
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = b.status === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={busy || active}
                        onClick={() => onChangeStatus(opt.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider border transition-colors text-left",
                          active
                            ? "bg-amber-500/20 text-amber-200 border-amber-500/50 cursor-default"
                            : "text-stone-400 border-amber-900/30 hover:text-amber-300 hover:border-amber-700/50",
                          busy && !active && "opacity-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Quick actions */}
                <div className="mt-4 flex gap-2">
                  <QuickAction
                    icon={Check}
                    label="Подтвердить"
                    color="emerald"
                    disabled={busy || b.status === "confirmed"}
                    onClick={() => onChangeStatus("confirmed")}
                  />
                  <QuickAction
                    icon={X}
                    label="Отменить"
                    color="red"
                    disabled={busy || b.status === "cancelled"}
                    onClick={() => onChangeStatus("cancelled")}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-stone-300">
      <Icon size={13} className="text-amber-400 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[9px] uppercase tracking-[0.25em] text-stone-500 mb-0.5">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, color, disabled, onClick }) {
  const colors = {
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25",
    red:     "bg-red-500/15 text-red-300 border-red-500/40 hover:bg-red-500/25",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[11px] uppercase tracking-wider border transition-colors",
        colors[color],
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <Icon size={11} /> {label}
    </button>
  );
}

function BookingsSkeleton() {
  return (
    <ul className="divide-y divide-amber-900/20">
      {[0, 1, 2, 3, 4].map((i) => (
        <li key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-10 rounded bg-amber-900/15" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-amber-900/15 rounded" />
            <div className="h-2 w-1/4 bg-amber-900/10 rounded" />
          </div>
          <div className="w-20 h-5 bg-amber-900/15 rounded" />
        </li>
      ))}
    </ul>
  );
}

function shortDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(d);
}
function longDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(d);
}
function tableLabel(type) {
  return { standard: "Стол", vip: "VIP-ложа", terrace: "Терраса" }[type] || type;
}
function eventLabel(type) {
  return {
    casual: "Обычный ужин",
    birthday: "День рождения",
    corporate: "Корпоратив",
    anniversary: "Годовщина",
    business: "Деловая встреча",
  }[type] || type;
}
