"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { listTables, openOrder } from "@/lib/api/operations";
import { useWaiterSession } from "@/app/waiter/layout";

export default function NewOrderPage() {
  const router = useRouter();
  const params = useSearchParams();
  const session = useWaiterSession();
  const tableId = params.get("table");

  const [table, setTable] = useState(null);
  const [guests, setGuests] = useState(2);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!tableId) return;
    (async () => {
      const tbls = await listTables();
      setTable(tbls.find((t) => t.id === tableId) || null);
    })();
  }, [tableId]);

  async function handleOpen() {
    if (!tableId || busy) return;
    setBusy(true);
    const res = await openOrder({
      tableId,
      waiter: session ? { id: session.id, name: session.name } : null,
      guests,
    });
    setBusy(false);
    if (res.ok) {
      router.replace(`/waiter/order/${res.order.id}`);
    } else {
      alert(res.error || "Не удалось открыть заказ");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <button
        type="button"
        onClick={() => router.push("/waiter")}
        className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-300 text-xs uppercase tracking-wider mb-6"
      >
        <ArrowLeft size={13} /> К столам
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/40 p-6"
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-2 font-semibold">
          Новый заказ
        </div>

        {table ? (
          <>
            <h1 className="font-display text-3xl text-[#FDF6E2] mb-1">
              Стол №{table.number}
            </h1>
            <p className="text-xs text-stone-400 mb-6">
              {table.seats} мест · {{ main: "главный зал", vip: "VIP", terrace: "терраса" }[table.zone] || table.zone}
            </p>

            <div className="mb-6">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-amber-400 mb-2 font-semibold">
                Гостей
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full border border-amber-900/40 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 grid place-items-center"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="font-display text-4xl text-[#FDF6E2] tabular-nums">{guests}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(table.seats, guests + 1))}
                  className="w-10 h-10 rounded-full border border-amber-900/40 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 grid place-items-center"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-stone-500">
                <Users size={10} className="inline mr-1" /> Стол на {table.seats} мест
              </p>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={handleOpen}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-sm uppercase tracking-wider shadow-gold disabled:opacity-50"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              Открыть заказ
            </button>
          </>
        ) : (
          <div className="text-center text-stone-500 py-8">
            {tableId ? "Стол не найден" : "Стол не выбран"}
          </div>
        )}
      </motion.div>
    </div>
  );
}
