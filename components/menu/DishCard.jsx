"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatKGS, cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DishCard({ dish }) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) =>
    dish?.id ? (s.items.find((i) => i.id === dish.id)?.quantity ?? 0) : 0
  );

  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    if (!dish) return;
    addItem(dish);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  // Deterministic warm-gradient fallback so each dish has its own colour signature.
  const seed = String(dish?.id || dish?.name || "dish-default")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const hueA = seed % 60 + 20;         // amber/orange range
  const hueB = (hueA + 25) % 60 + 25;

  if (!dish) return null;

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-white/70 dark:bg-stone-900/40 backdrop-blur-md border border-white/90 dark:border-stone-850/40 shadow-sm",
        "transition-all duration-300 hover:shadow-md hover:border-gold-200/80 hover:-translate-y-0.5"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-950">
        {!imgError && dish.imagePlaceholder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.imagePlaceholder}
            alt={dish.name || "Блюдо"}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              background: `linear-gradient(135deg, hsl(${hueA} 70% 85%), hsl(${hueB} 60% 70%))`,
            }}
          >
            <span className="font-display text-6xl text-white/80 select-none drop-shadow-sm">
              {dish.name ? dish.name.charAt(0) : "?"}
            </span>
          </div>
        )}

        {/* soft bottom fade — blends image into the white card body */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/85 dark:from-stone-900/80 to-transparent" />

        {/* in-cart badge */}
        {inCart > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white text-[11px] font-bold shadow-gold-soft"
          >
            × {inCart}
          </motion.div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-tight text-stone-900 dark:text-[#FDF6E2]">
          {dish.name || "Блюдо"}
        </h3>

        <p className="text-[13px] leading-relaxed text-stone-500 dark:text-stone-400 line-clamp-2 min-h-[2.6em]">
          {dish.description || ""}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="font-display font-bold text-xl text-amber-700 dark:text-gold-400 tabular-nums">
            {formatKGS(dish.price || 0)}
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider",
              "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-white",
              "shadow-gold-soft hover:shadow-gold",
              "no-tap-highlight transition-shadow"
            )}
            aria-label={`Add ${dish.name || "Блюдо"} to cart`}
          >
            <motion.span
              key={justAdded ? "added" : "add"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {justAdded ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
            </motion.span>
            {justAdded ? "Добавлено" : "Добавить"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
