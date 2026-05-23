"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Premium gold-accented button. Direct refactor of the former NeonButton —
 * all Framer Motion springs/whileHover/whileTap preserved verbatim, only the
 * Tailwind tokens were swapped from cyan-on-dark to gold-on-light glass.
 *
 * Variants:
 *   - primary    → metallic gold gradient, white text, soft amber shadow
 *   - ghost      → transparent w/ gold border, gold text
 *   - solidLight → white glass w/ deep gold text (for use over photography)
 */

const base =
  "group relative inline-flex items-center justify-center gap-2 px-6 py-3 " +
  "font-medium tracking-wide uppercase text-sm rounded-full " +
  "no-tap-highlight touch-target transition-all overflow-hidden";

const variants = {
  primary: cn(
    "text-white",
    "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600",
    "shadow-[0_4px_14px_rgba(212,175,55,0.35),0_0_0_1px_rgba(212,175,55,0.4)]",
    "hover:shadow-[0_10px_28px_rgba(212,175,55,0.45),0_0_0_1px_rgba(212,175,55,0.55)]",
    "hover:from-amber-200 hover:via-gold-300 hover:to-yellow-500"
  ),
  ghost: cn(
    "text-gold-700 bg-transparent",
    "border border-gold-400/50",
    "hover:bg-gold-50/70 hover:border-gold-500/80",
    "hover:shadow-[0_4px_14px_rgba(212,175,55,0.18)]"
  ),
  solidLight: cn(
    "text-gold-700 bg-white/70 backdrop-blur-md",
    "border border-white/85 shadow-glass",
    "hover:bg-white/90 hover:border-gold-300/70 hover:text-gold-800"
  ),
};

export default function GoldButton({
  children,
  href,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  ...rest
}) {
  const motionProps = {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { type: "spring", stiffness: 380, damping: 24 },
  };

  const cls = cn(
    base,
    variants[variant],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>

      {/* Metallic shimmer sweep on hover — primary variant only */}
      {variant === "primary" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )}
          style={{
            background:
              "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)",
          }}
        />
      )}

      {/* Soft inner highlight — adds dimensionality on light bg */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 45%, transparent 100%)",
          }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.span {...motionProps} className="inline-block">
        <Link href={href} className={cls} {...rest}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      {...rest}
    >
      {inner}
    </motion.button>
  );
}
