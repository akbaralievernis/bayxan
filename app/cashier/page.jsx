"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  Wallet,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { listOrders } from "@/lib/api/operations";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useCashierSession } from "./layout";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "ready",     label: "Готовы к оплате" },
  { id: "open",      label: "Открытые"        },
  { id: "closed",    label: "Закрытые"        },
];

export default function CashierDashboard() {
  const session = useCashierSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ready");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const rows = await listOrders();
      if (!cancelled) {
        setOrders(rows);
        setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 8_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const visible = useMemo(() => {
    return orders.filter((o) => {
      if (filter === "ready")  return o.status === "paying" || o.status === "served";
      if (filter === "open")   return o.status === "open" || o.status === "preparing";
      if (filter === "closed") return o.status === "closed";
      return true;
    });
  }, [orders, filter]);

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return orders
      .filter((o) => o.status === "closed" && o.closed_at?.startsWith(today))
      .reduce((s, o) => s + Number(o.total || 0), 0);
  }, [orders]);

  const counts = useMemo(() => ({
    ready:  orders.filter((o) => o.status === "paying" || o.status === "served").length,
    open:   orders.filter((o) => o.status === "open" || o.status === "preparing").length,
    closed: orders.filter((o) => o.status === "closed").length,
  }), [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <motion.header
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-blue-400 mb-2 font-semibold">· Касса ·</p>
          <h1 className="font-display text-3xl sm:text-4xl text-[#FDF6E2]">
            Привет, <span className="gold-text italic">{session?.name?.split(" ")[0]}.</span>
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {counts.ready} заказов ждут оплаты · сегодня в кассе{" "}
            <span className="text-amber-300 tabular-nums">{formatKGS(todayRevenue)}</span>
          </p>
        </div>
      </motion.header>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <KpiTile icon={Receipt} label="К оплате" value={counts.ready} accent="blue" />
        <KpiTile icon={Clock}   label="Открытые" value={counts.open} accent="amber" />
        <KpiTile icon={Wallet}  label="Выручка сегодня" value={formatKGS(todayRevenue)} accent="gold" />
      </div>

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
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/50"
                  : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
              )}
            >
              {f.label}
              <span className={cn(
                "tabular-nums text-[10px] px-1.5 rounded-full",
                active ? "bg-blue-500/20 text-blue-200" : "bg-amber-900/30 text-stone-400"
              )}>
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="rounded-2xl border border-amber-900/20 bg-black/30 h-40 animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl bg-black/30 border border-amber-900/30 py-16 text-center text-stone-500 text-sm">
          {filter === "ready" ? "Нет заказов готовых к оплате." : "Заказов нет."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence initial={false}>
            {visible.map((o) => <CashierCard key={o.id} order={o} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }) {
  const colors = {
    blue:  "from-blue-500/10 border-blue-500/30 text-blue-300",
    amber: "from-amber-500/10 border-amber-500/30 text-amber-300",
    gold:  "from-yellow-500/15 border-amber-500/40 text-amber-200",
  }[accent];
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br to-transparent p-4 backdrop-blur-md", colors)}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] mb-2 opacity-80">
        <Icon size={12} />
        <span>{label}</span>
      </div>
      <div className="font-display text-2xl sm:text-3xl text-[#FDF6E2] tabular-nums">{value}</div>
    </div>
  );
}

function CashierCard({ order }) {
  const itemCount = (order.items || []).reduce((s, it) => s + it.quantity, 0);
  const isReady = order.status === "paying";
  return (
    <Link href={`/cashier/order/${order.id}`} className="block">
      <motion.article
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ y: -2 }}
        className={cn(
          "rounded-2xl bg-black/30 backdrop-blur-md border p-5 transition-colors",
          isReady ? "border-blue-500/40 hover:border-blue-500/70 ring-2 ring-blue-500/15" : "border-amber-900/30 hover:border-amber-700/50"
        )}
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

        <ul className="flex items-center gap-3 mb-3 text-xs text-stone-400">
          <li className="inline-flex items-center gap-1"><Users size={11} /> {order.guests}</li>
          <li className="text-stone-600">·</li>
          <li>{itemCount} поз.</li>
          <li className="text-stone-600">·</li>
          <li>{order.waiter_name}</li>
        </ul>

        <div className="pt-3 border-t border-amber-900/30 flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Сумма</span>
          <span className="font-display text-2xl text-amber-300 tabular-nums">
            {formatKGS(order.total || 0)}
          </span>
        </div>

        {isReady && (
          <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-blue-300 font-semibold">
            <CheckCircle2 size={11} /> Принять оплату <ChevronRight size={11} />
          </div>
        )}
      </motion.article>
    </Link>
  );
}
