"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatKGS } from "@/lib/utils";

export default function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 text-center bg-white/70 backdrop-blur-md border border-white/90 shadow-sm"
      >
        <div className="mx-auto w-14 h-14 rounded-full grid place-items-center border border-gold-300/70 bg-white/80 shadow-gold-soft mb-4">
          <ShoppingBag size={20} className="text-amber-600" />
        </div>
        <h3 className="font-display text-lg text-stone-900 mb-2">Без предзаказа</h3>
        <p className="text-sm text-stone-500 leading-relaxed mb-5">
          Вы можете добавить блюда из меню для предзаказа к вашему столу.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gold-400/50 text-amber-700 text-xs uppercase tracking-wider hover:bg-amber-50/70 hover:border-gold-500/80 hover:shadow-gold-soft transition-all"
        >
          К меню <ArrowRight size={12} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md border border-white/90 shadow-sm"
    >
      <header className="px-5 py-4 border-b border-stone-200/70 bg-white/40">
        <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700">
          Предзаказ к столу
        </h3>
        <p className="text-[11px] text-stone-500 mt-1 tabular-nums">
          {items.length} {plur(items.length)} · {count} шт.
        </p>
      </header>

      <ul className="divide-y divide-stone-200/70 max-h-[420px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                {item.imagePlaceholder && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imagePlaceholder}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800 line-clamp-1">{item.name}</div>
                <div className="text-[11px] text-stone-400 tabular-nums">× {item.quantity}</div>
              </div>
              <div className="text-sm text-amber-700 font-medium tabular-nums">
                {formatKGS(item.price * item.quantity)}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <footer className="px-5 py-4 border-t border-stone-200/70 bg-white/40 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Итого
        </span>
        <motion.span
          key={total}
          initial={{ scale: 1.05, color: "#B8941F" }}
          animate={{ scale: 1, color: "#1c1917" }}
          transition={{ duration: 0.35 }}
          className="font-display text-2xl tabular-nums"
        >
          {formatKGS(total)}
        </motion.span>
      </footer>
    </motion.div>
  );
}

function plur(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "позиция";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "позиции";
  return "позиций";
}
