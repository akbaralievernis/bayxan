"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Loader2,
  Printer,
} from "lucide-react";
import { getOrder, closeOrder } from "@/lib/api/operations";
import { useCashierSession } from "@/app/cashier/layout";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "cash",     label: "Наличные",   icon: Banknote   },
  { id: "card",     label: "Карта",      icon: CreditCard },
  { id: "qr",       label: "QR / mbank", icon: QrCode     },
];

export default function CashierOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const session = useCashierSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("cash");
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const o = await getOrder(id);
      if (!cancelled) {
        setOrder(o);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function handleClose() {
    if (busy || !order) return;
    setBusy(true);
    const res = await closeOrder(id, {
      paymentMethod: method,
      cashierId: session?.id || null,
    });
    setBusy(false);
    if (res.ok) {
      setClosed(true);
      setOrder(res.order);
      // Auto-redirect after 2s
      setTimeout(() => router.replace("/cashier"), 2200);
    } else {
      alert(res.error || "Не удалось закрыть чек");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-blue-400/70 text-[11px] uppercase tracking-[0.3em]">
        Загрузка чека…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-stone-400">Чек не найден.</p>
        <button
          type="button"
          onClick={() => router.replace("/cashier")}
          className="mt-4 text-blue-400 text-sm"
        >
          ← Назад
        </button>
      </div>
    );
  }

  const items = order.items || [];
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const total = order.total || subtotal;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <button
        type="button"
        onClick={() => router.push("/cashier")}
        className="inline-flex items-center gap-2 text-stone-400 hover:text-blue-300 text-xs uppercase tracking-wider mb-5"
      >
        <ArrowLeft size={13} /> К списку
      </button>

      {/* Success overlay */}
      {closed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/40 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 grid place-items-center mb-4">
            <CheckCircle2 size={32} className="text-emerald-300" />
          </div>
          <div className="font-display text-2xl text-[#FDF6E2] mb-2">Оплата принята</div>
          <div className="text-emerald-300 tabular-nums font-display text-3xl mb-3">
            {formatKGS(total)}
          </div>
          <div className="text-xs text-stone-400">Стол №{order.table_number} закрыт</div>
        </motion.div>
      )}

      {!closed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/40 overflow-hidden"
        >
          <header className="px-5 py-4 border-b border-amber-900/30 bg-black/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-amber-500/70 mb-1">
                  {order.order_code}
                </div>
                <div className="font-display text-2xl text-[#FDF6E2]">
                  Стол №{order.table_number}
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-2 text-[11px] text-stone-500">
              {order.guests} гостей · официант: {order.waiter_name}
            </div>
          </header>

          {/* Receipt items */}
          <ul className="px-5 py-2 divide-y divide-amber-900/30">
            {items.map((it) => (
              <li key={it.id} className="py-2.5 flex items-baseline gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#FDF6E2] truncate">{it.name}</div>
                  <div className="text-[11px] text-stone-500 tabular-nums">
                    {formatKGS(it.price)} × {it.quantity}
                  </div>
                </div>
                <div className="text-sm text-amber-300 tabular-nums">
                  {formatKGS(it.price * it.quantity)}
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="py-8 text-center text-stone-500 text-xs">Пустой чек</li>
            )}
          </ul>

          {/* Total */}
          <div className="px-5 py-4 border-t border-amber-900/30 flex items-baseline justify-between bg-black/30">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400">Итого к оплате</span>
            <span className="font-display text-3xl text-amber-300 tabular-nums">
              {formatKGS(total)}
            </span>
          </div>

          {/* Payment method */}
          <div className="px-5 py-4 border-t border-amber-900/30 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-semibold">
              Способ оплаты
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => {
                const active = method === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "py-3 rounded-xl border text-center transition-colors",
                      active
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/50"
                        : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                    )}
                  >
                    <Icon size={18} className="mx-auto mb-1" />
                    <div className="text-[10px] uppercase tracking-wider">{m.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t border-amber-900/30 bg-black/30 grid grid-cols-[1fr,auto] gap-2">
            <button
              type="button"
              disabled={busy || items.length === 0}
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-sm uppercase tracking-wider shadow-gold disabled:opacity-50"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Закрыть чек
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-900/40 text-stone-300 hover:text-amber-300 hover:border-amber-500/50"
              title="Печать"
              aria-label="Печать"
            >
              <Printer size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
