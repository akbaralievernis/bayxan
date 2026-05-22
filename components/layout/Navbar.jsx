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
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const pathname = usePathname();
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
            ? "bg-white/60 backdrop-blur-md border-b border-white/80 shadow-glass"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-2xl tracking-widest text-stone-900 flex items-center gap-2"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-gold-400 shadow-gold-soft animate-pulse-glow" />
            {RESTAURANT.name}
            <span className="hidden sm:inline text-stone-400 text-sm tracking-[0.4em] ml-1">
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
                      ? "text-amber-900"
                      : "text-stone-700 hover:text-amber-600"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-0 rounded-full bg-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] border border-amber-200/70"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart button — visible on all sizes */}
            <motion.button
              type="button"
              aria-label="Открыть корзину"
              onClick={openCart}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-md border border-white/85 text-stone-700 hover:text-amber-700 hover:border-gold-300/70 shadow-glass transition-colors"
            >
              <ShoppingBag size={18} />
              {mounted && cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white text-[10px] font-bold grid place-items-center shadow-gold-soft border-2 border-white"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </motion.button>

            <div className="hidden md:block">
              <GoldButton href="/booking" variant="primary" className="px-5 py-2 text-xs">
                Забронировать
              </GoldButton>
            </div>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-md border border-white/85 text-stone-700 hover:text-amber-700 hover:border-gold-300/70 shadow-glass"
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
