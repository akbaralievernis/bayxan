"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag } from "lucide-react";
import { NAV_LINKS, RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import GoldButton from "@/components/ui/GoldButton";
import MobileSheet from "./MobileSheet";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT } from "@/components/providers/LocaleProvider";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const pathname = usePathname();
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openDrawer);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-colors duration-300",
          scrolled
            ? "bg-white/60 dark:bg-[#120D0A]/60 backdrop-blur-md border-b border-white/80 dark:border-stone-800/40 shadow-glass"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl tracking-widest text-stone-900 dark:text-[#FDF6E2] flex items-center gap-2.5 transition-colors"
          >
            <img
              src="/logo.jpg"
              alt="Байхан Logo"
              className="w-9 h-9 rounded-full object-cover border border-amber-500/30 dark:border-gold-500/30 shadow-md"
            />
            {RESTAURANT.name}
            <span className="hidden sm:inline text-stone-400 dark:text-stone-500 text-sm tracking-[0.4em] ml-1">
              {RESTAURANT.nameLocal}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-4 py-2 text-sm uppercase tracking-wider transition-colors",
                    active
                      ? "text-amber-900 dark:text-[#FDF6E2]"
                      : "text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-gold-400"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-0 rounded-full bg-amber-100 dark:bg-stone-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-amber-200/70 dark:border-stone-850/60"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(l.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switcher — RU / KY */}
            <LanguageSwitcher className="hidden sm:inline-flex" />

            {/* Theme Toggle - premium light & monolithic dark */}
            <ThemeToggle />

            {/* Cart button — visible on all sizes */}
            <motion.button
              type="button"
              aria-label={t("nav.cart_aria")}
              onClick={openCart}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-10 h-10 grid place-items-center rounded-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-white/85 dark:border-stone-800/80 text-stone-700 dark:text-stone-200 hover:text-amber-700 dark:hover:text-gold-400 hover:border-gold-300/70 dark:hover:border-gold-500/70 shadow-glass transition-colors"
            >
              <ShoppingBag size={18} />
              {mounted && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white text-[10px] font-bold grid place-items-center shadow-gold-soft border-2 border-white dark:border-stone-900"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </motion.button>

            <div className="hidden md:block">
              <GoldButton href="/booking" variant="primary" className="px-5 py-2 text-xs">
                {t("nav.book_cta")}
              </GoldButton>
            </div>
            <button
              type="button"
              aria-label={t("nav.menu_aria")}
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-white/85 dark:border-stone-800/80 text-stone-700 dark:text-stone-200 hover:text-amber-700 dark:hover:text-gold-400 hover:border-gold-300/70 dark:hover:border-gold-500/70 shadow-glass transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MobileSheet onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
