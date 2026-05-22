"use client";

import { motion, AnimatePresence } from "framer-motion";
import DishCard from "./DishCard";

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export default function DishGrid({ dishes }) {
  return (
    <motion.div
      // Re-key forces re-stagger when category changes
      key={dishes.map((d) => d.id).join("-").slice(0, 40)}
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      <AnimatePresence mode="popLayout">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </AnimatePresence>

      {dishes.length === 0 && (
        <div className="col-span-full py-24 text-center text-white/40">
          В этой категории пока ничего нет.
        </div>
      )}
    </motion.div>
  );
}
