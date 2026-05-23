"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin, Plus, ChevronRight } from "lucide-react";
import { listTables, listOrders } from "@/lib/api/operations";
import { useWaiterSession } from "./layout";
import TableStatusBadge, { ZONE_LABELS } from "@/components/admin/TableStatusBadge";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ZONES = [
  { id: "all",     label: "Все"      },
  { id: "main",    label: "Зал"      },
  { id: "vip",     label: "VIP"      },
  { id: "terrace", label: "Терраса"  },
];

export default function WaiterDashboard() {
  const session = useWaiterSession();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [zone, setZone] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [tbls, ords] = await Promise.all([
        listTables(),
        listOrders({ openOnly: true }),
      ]);
      if (!cancelled) {
        setTables(tbls);
        setOrders(ords);
        setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 8_000);  // Refresh every 8s
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  // Map order by table id for fast lookup
  const ordersByTable = useMemo(() => {
    const map = {};
    for (const o of orders) {
      if (o.table_id) map[o.table_id] = o;
    }
    return map;
  }, [orders]);

  const visible = useMemo(() => {
    return tables.filter((t) => zone === "all" || t.zone === zone);
  }, [tables, zone]);

  // My active orders count
  const myOrders = useMemo(() => {
    if (!session) return 0;
    return orders.filter((o) => o.waiter_id === session.id).length;
  }, [orders, session]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <motion.header
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 mb-2 font-semibold">· Зал ·</p>
          <h1 className="font-display text-3xl sm:text-4xl text-[#FDF6E2]">
            Привет, <span className="gold-text italic">{session?.name?.split(" ")[0]}.</span>
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {tables.length} столов · {myOrders} {plurMine(myOrders)} ваших заказов
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {ZONES.map((z) => {
            const active = zone === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setZone(z.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-colors",
                  active
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                    : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                )}
              >
                {z.label}
              </button>
            );
          })}
        </div>
      </motion.header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="rounded-2xl border border-amber-900/20 bg-black/30 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {visible.map((t) => (
            <TableTile
              key={t.id}
              table={t}
              order={ordersByTable[t.id]}
              isMine={ordersByTable[t.id]?.waiter_id === session?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TableTile({ table, order, isMine }) {
  const tint = {
    free:     "from-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/70",
    occupied: "from-amber-500/10 border-amber-500/40 hover:border-amber-500/70",
    reserved: "from-blue-500/10 border-blue-500/30 hover:border-blue-500/60",
    cleaning: "from-purple-500/10 border-purple-500/30",
    closed:   "from-stone-700/20 border-stone-700/40",
  }[table.status];

  const isFree = table.status === "free";
  const href = isFree
    ? `/waiter/order/new?table=${table.id}`
    : order
    ? `/waiter/order/${order.id}`
    : `/waiter`;

  return (
    <Link href={href} className="block">
      <motion.article
        whileHover={{ y: -2 }}
        className={cn(
          "h-full rounded-2xl border bg-gradient-to-br to-transparent p-4 backdrop-blur-md transition-all",
          tint,
          isMine && "ring-2 ring-emerald-400/40"
        )}
      >
        <header className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-stone-400">
              {ZONE_LABELS[table.zone] || table.zone}
            </div>
            <div className="font-display text-3xl text-[#FDF6E2] leading-tight">
              №{table.number}
            </div>
          </div>
          <TableStatusBadge status={table.status} />
        </header>

        <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
          <span className="inline-flex items-center gap-1">
            <Users size={11} /> {table.seats}
          </span>
          {isMine && (
            <span className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
              · мой стол
            </span>
          )}
        </div>

        {order ? (
          <div className="rounded-lg bg-black/40 border border-amber-900/40 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400">
                {order.order_code}
              </span>
              <span className="text-[10px] text-stone-400">{order.items?.length || 0} поз.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-500">Сумма</span>
              <span className="font-display text-base text-amber-300 tabular-nums">
                {formatKGS(order.total || 0)}
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-wider">
              Открыть <ChevronRight size={11} />
            </div>
          </div>
        ) : isFree ? (
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs uppercase tracking-wider font-semibold">
            <Plus size={12} /> Открыть заказ
          </div>
        ) : (
          <div className="text-[11px] text-stone-500">
            {table.status === "reserved" ? "Бронь" : table.status === "cleaning" ? "Уборка" : "Недоступен"}
          </div>
        )}
      </motion.article>
    </Link>
  );
}

function plurMine(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "активный";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "активных";
  return "активных";
}
