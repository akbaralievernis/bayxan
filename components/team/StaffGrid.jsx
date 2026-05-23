"use client";

import { motion } from "framer-motion";
import StaffCard from "./StaffCard";

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export default function StaffGrid({ people }) {
  const safePeople = people || [];
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
    >
      {safePeople.map((person) => (
        <StaffCard key={person?.id || person?.name || Math.random()} person={person} />
      ))}

      {safePeople.length === 0 && (
        <div className="col-span-full py-16 text-center text-stone-400/70 font-medium">
          Данные загружаются...
        </div>
      )}
    </motion.div>
  );
}
