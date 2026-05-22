"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatKGS, cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit:   { opacity: 0, x: 24, transition: { duration: 0.2 } },
};

export default function CartDrawer() {
  const isOpen      = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items       = useCartStore((s) => s.items);
  const increment   = useCartStore((s) => s.increment);
  const decrement   = useCartStore((s) => s.decrement);
  const removeItem  = useCartStore((s) => s.removeItem);
  const clearCart   = useCartStore((s) => s.clearCart);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — soft warm wash, not pitch black */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[55] bg-stone-900/30 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            role="dialog"
            aria-label="Корзина"
            className={cn(
              "fixed top-0 right-0 z-[60] h-full w-full sm:w-[420px]",
              "flex flex-col bg-ivory/95 backdrop-blur-xl border-l border-white/80",
              "shadow-[-24px_0_60px_-12px_rgba(60,40,10,0.15)]"
            )}
          >
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-stone-200/70 bg-white/60">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-amber-600" />
                <div>
                  <h2 className="font-display text-lg text-stone-900 leading-tight">Корзина</h2>
                  <p className="text-[11px] text-stone-500 uppercase tracking-[0.25em]">
                    {count > 0 ? `${count} поз.` : "Пусто"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="px-2 py-1 text-[11px] uppercase tracking-wider text-stone-500 hover:text-red-500 transition-colors"
                    aria-label="Очистить корзину"
                  >
                    Очистить
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Закрыть корзину"
                  className="w-9 h-9 grid place-items-center rounded-full text-stone-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? <EmptyState onClose={closeDrawer} /> : (
                <ul className="px-3 py-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="flex gap-3 p-2.5 rounded-2xl bg-white/70 border border-white/90 shadow-sm"
                      >
                        {/* thumb */}
                        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-stone-100">
                          {item.imagePlaceholder && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imagePlaceholder}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* meta */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm text-stone-900 leading-snug line-clamp-2">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="shrink-0 text-stone-400 hover:text-red-500 transition-colors"
                              aria-label="Удалить"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-1.5">
                            {/* qty stepper */}
                            <div className="inline-flex items-center gap-1 bg-white rounded-full border border-stone-200 p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                              <StepBtn onClick={() => decrement(item.id)} ariaLabel="Уменьшить">
                                <Minus size={12} strokeWidth={3} />
                              </StepBtn>
                              <span className="px-2 text-sm font-medium text-stone-800 tabular-nums min-w-[1.25rem] text-center">
                                {item.quantity}
                              </span>
                              <StepBtn onClick={() => increment(item.id)} ariaLabel="Увеличить">
                                <Plus size={12} strokeWidth={3} />
                              </StepBtn>
                            </div>

                            <div className="font-display font-bold text-amber-700 text-sm tabular-nums">
                              {formatKGS(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="border-t border-stone-200/70 bg-white/70 px-5 py-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-stone-500">Итого</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.06, color: "#B8941F" }}
                    animate={{ scale: 1, color: "#1c1917" }}
                    transition={{ duration: 0.35 }}
                    className="font-display text-2xl tabular-nums"
                  >
                    {formatKGS(total)}
                  </motion.span>
                </div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/booking"
                    onClick={closeDrawer}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2",
                      "px-5 py-3.5 rounded-full",
                      "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-white font-bold uppercase tracking-wider text-sm",
                      "shadow-gold hover:shadow-gold-lg transition-shadow"
                    )}
                  >
                    Оформить · забронировать
                    <ArrowRight size={16} strokeWidth={3} />
                  </Link>
                </motion.div>

                <p className="text-center text-[11px] text-stone-400">
                  Заказ привязывается к бронированию столика.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function StepBtn({ children, onClick, ariaLabel }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      aria-label={ariaLabel}
      className="w-6 h-6 grid place-items-center rounded-full text-stone-600 hover:text-amber-700 hover:bg-amber-50"
    >
      {children}
    </motion.button>
  );
}

function EmptyState({ onClose }) {
  return (
    <div className="h-full grid place-items-center px-6 py-16 text-center">
      <div className="space-y-5 max-w-xs">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, type: "spring" }}
          className="mx-auto w-20 h-20 rounded-full grid place-items-center border border-gold-300/70 bg-white/80 shadow-gold-soft"
        >
          <ShoppingBag size={28} className="text-amber-600" />
        </motion.div>

        <div className="space-y-1.5">
          <h3 className="font-display text-xl text-stone-900">Корзина пуста</h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            Добавьте блюда из меню, чтобы оформить заказ к столу.
          </p>
        </div>

        <Link
          href="/menu"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gold-400/50 text-amber-700 text-xs uppercase tracking-wider hover:bg-amber-50/70 hover:border-gold-500/80 hover:shadow-gold-soft transition-all"
        >
          К меню <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
