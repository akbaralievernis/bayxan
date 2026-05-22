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
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
    >
      {people.map((person) => (
        <StaffCard key={person.id} person={person} />
      ))}

      {people.length === 0 && (
        <div className="col-span-full py-16 text-center text-white/40">
          В этом отделе пока никого нет.
        </div>
      )}
    </motion.div>
  );
}
