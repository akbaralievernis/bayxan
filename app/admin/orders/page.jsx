"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Clock, Users, ChefHat, ShoppingBag } from "lucide-react";
import { listOrders } from "@/lib/api/operations";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "active",    label: "Активные" },
  { id: "all",       label: "Все" },
  { id: "open",      label: "Открыты" },
  { id: "preparing", label: "Готовятся" },
  { id: "paying",    label: "Расчёт" },
  { id: "closed",    label: "Закрыты" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = await listOrders();
      if (!cancelled) {
        setOrders(rows);
        setLoading(false);
      }
    })();
    // Refresh every 15s so the dashboard reflects waiter/cashier activity.
    const interval = setInterval(async () => {
      const rows = await listOrders();
      if (!cancelled) setOrders(rows);
    }, 15_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const visible = useMemo(() => {
    if (filter === "active") return orders.filter((o) => o.status !== "closed" && o.status !== "cancelled");
    if (filter === "all")    return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => ({
    active:    orders.filter((o) => o.status !== "closed" && o.status !== "cancelled").length,
    all:       orders.length,
    open:      orders.filter((o) => o.status === "open").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    paying:    orders.filter((o) => o.status === "paying").length,
    closed:    orders.filter((o) => o.status === "closed").length,
  }), [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400 mb-2 font-semibold">· Заказы ·</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2]">
          Активные <span className="gold-text italic">чеки.</span>
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          {counts.active} активных · обновление каждые 15 сек.
        </p>
      </motion.header>

      <div className="flex items-center gap-1.5 overflow-x-auto mb-5">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-colors",
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

      {loading ? (
        <OrdersSkeleton />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl bg-black/30 border border-amber-900/30 py-16 text-center text-stone-500 text-sm">
          Заказов нет.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence initial={false}>
            {visible.map((o) => <OrderCard key={o.id} order={o} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const itemCount = (order.items || []).reduce((s, it) => s + it.quantity, 0);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/30 p-5 hover:border-amber-700/50 transition-colors"
    >
      <header className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-500/70 mb-1">
            {order.order_code}
          </div>
          <div className="font-display text-xl text-[#FDF6E2]">
            Стол №{order.table_number}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <ul className="flex items-center gap-3 mb-4 text-xs text-stone-400">
        <li className="inline-flex items-center gap-1">
          <Users size={11} /> {order.guests}
        </li>
        <li className="inline-flex items-center gap-1">
          <ShoppingBag size={11} /> {itemCount} {plurItems(itemCount)}
        </li>
        <li className="inline-flex items-center gap-1 ml-auto">
          <Clock size={11} /> {timeAgo(order.opened_at)}
        </li>
      </ul>

      {order.waiter_name && (
        <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 mb-3">
          <ChefHat size={11} className="text-amber-500/70" />
          <span className="truncate">{order.waiter_name}</span>
        </div>
      )}

      <div className="pt-3 border-t border-amber-900/30 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Итого</span>
        <span className="font-display text-2xl text-amber-300 tabular-nums">
          {formatKGS(order.total || 0)}
        </span>
      </div>
    </motion.article>
  );
}

function OrdersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-2xl border border-amber-900/20 bg-black/30 h-40 animate-pulse" />
      ))}
    </div>
  );
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  return `${h} ч назад`;
}

function plurItems(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "позиция";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "позиции";
  return "позиций";
}
