"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Search,
  Send,
  Receipt,
  Loader2,
} from "lucide-react";
import {
  getOrder,
  addOrderItem,
  removeOrderItem,
  updateOrderStatus,
} from "@/lib/api/operations";
import { listMenuItems } from "@/lib/api/admin";
import { CATEGORIES } from "@/lib/mockData";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useWaiterSession } from "@/app/waiter/layout";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function WaiterOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = useWaiterSession();
  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [o, m] = await Promise.all([getOrder(id), listMenuItems()]);
      if (!cancelled) {
        setOrder(o);
        setMenu(m.filter((x) => x.active));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function refreshOrder() {
    const fresh = await getOrder(id);
    if (fresh) setOrder(fresh);
  }

  async function addItem(dish) {
    setBusy(true);
    const res = await addOrderItem(id, {
      menuItemId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
    });
    if (res.ok) await refreshOrder();
    setBusy(false);
  }

  async function removeItem(item) {
    setBusy(true);
    await removeOrderItem(id, item.id);
    await refreshOrder();
    setBusy(false);
  }

  async function sendToKitchen() {
    setBusy(true);
    await updateOrderStatus(id, "preparing");
    await refreshOrder();
    setBusy(false);
  }

  async function requestCheck() {
    setBusy(true);
    await updateOrderStatus(id, "paying");
    await refreshOrder();
    setBusy(false);
    router.replace("/waiter");
  }

  const visible = useMemo(() => {
    return menu.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${m.name} ${m.description || ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [menu, category, query]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-amber-400/70 text-[11px] uppercase tracking-[0.3em]">
        Загрузка заказа…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-stone-400">Заказ не найден.</p>
        <button
          type="button"
          onClick={() => router.replace("/waiter")}
          className="mt-4 inline-flex items-center gap-2 text-amber-400 text-sm"
        >
          <ArrowLeft size={14} /> Вернуться к столам
        </button>
      </div>
    );
  }

  const itemCount = (order.items || []).reduce((s, it) => s + it.quantity, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-start justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.push("/waiter")}
            className="mt-1 w-8 h-8 grid place-items-center rounded-lg border border-amber-900/40 text-stone-400 hover:text-amber-300"
            aria-label="Назад"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-500/80 mb-1">
              {order.order_code}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl text-[#FDF6E2]">
                Стол №{order.table_number}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              {order.guests} {plurGuests(order.guests)} · {order.waiter_name || session?.name}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid lg:grid-cols-[1fr,360px] gap-4 lg:gap-6 items-start">
        {/* Menu picker */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
              {CATEGORIES.map((c) => {
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border transition-colors",
                      active
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"
                        : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                    )}
                  >
                    {c.short || c.label}
                  </button>
                );
              })}
            </div>
            <div className="relative sm:w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Поиск блюда"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-full bg-black/30 border border-amber-900/30 text-sm text-[#FDF6E2] placeholder:text-stone-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {visible.map((dish) => (
              <button
                key={dish.id}
                type="button"
                disabled={busy}
                onClick={() => addItem(dish)}
                className="text-left rounded-xl bg-black/30 border border-amber-900/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 p-3 transition-colors disabled:opacity-50"
              >
                <div className="text-sm text-[#FDF6E2] font-medium leading-snug line-clamp-2 mb-2">
                  {dish.name}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 text-sm tabular-nums">
                    {formatKGS(dish.price)}
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                    <Plus size={11} />
                  </span>
                </div>
              </button>
            ))}
            {visible.length === 0 && (
              <div className="col-span-full text-center text-stone-500 py-12 text-sm">
                Ничего не найдено
              </div>
            )}
          </div>
        </section>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-20 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-900/40 overflow-hidden">
          <header className="px-4 py-3 border-b border-amber-900/30 bg-black/30">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold mb-1">
              Чек
            </div>
            <div className="text-xs text-stone-500">
              {itemCount} {plurItems(itemCount)}
            </div>
          </header>

          <ul className="max-h-[420px] overflow-y-auto divide-y divide-amber-900/30">
            <AnimatePresence initial={false}>
              {(order.items || []).map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="px-4 py-3 flex items-start gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#FDF6E2] line-clamp-1">{item.name}</div>
                    <div className="text-[11px] text-stone-500 tabular-nums">
                      {formatKGS(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm text-amber-300 tabular-nums whitespace-nowrap">
                    {formatKGS(item.price * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    disabled={busy}
                    className="w-6 h-6 grid place-items-center rounded text-stone-500 hover:text-red-400"
                  >
                    <Trash2 size={11} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {(order.items || []).length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-stone-500">
                Добавьте блюда из меню
              </li>
            )}
          </ul>

          <footer className="px-4 py-3 border-t border-amber-900/30 bg-black/30 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Итого</span>
              <span className="font-display text-2xl text-amber-300 tabular-nums">
                {formatKGS(order.total || 0)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy || itemCount === 0 || order.status === "preparing"}
                onClick={sendToKitchen}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] uppercase tracking-wider font-semibold hover:bg-emerald-500/25 disabled:opacity-40"
              >
                {busy ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                На кухню
              </button>
              <button
                type="button"
                disabled={busy || itemCount === 0}
                onClick={requestCheck}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[11px] uppercase tracking-wider font-semibold hover:bg-amber-500/25 disabled:opacity-40"
              >
                <Receipt size={11} /> На расчёт
              </button>
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
}

function plurGuests(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "гость";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "гостя";
  return "гостей";
}

function plurItems(n) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "позиция";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "позиции";
  return "позиций";
}
