"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-stone-200/50 dark:border-stone-800/50 bg-stone-100/30 backdrop-blur-md" />
    );
  }

  return (
    <motion.button
      type="button"
      aria-label="Переключить тему"
      onClick={toggleTheme}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-10 h-10 grid place-items-center rounded-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-white/85 dark:border-stone-800/80 text-stone-700 dark:text-[#FDF6E2] shadow-glass transition-colors duration-300"
    >
      {theme === "light" ? (
        <Sun className="text-amber-600" size={18} />
      ) : (
        <Moon className="text-orange-500" size={18} />
      )}
    </motion.button>
  );
}
