"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * White-glass floating-label input. Direct refactor of the former NeonInput —
 * the `peer-placeholder-shown` / `peer-focus` cascade is preserved exactly,
 * only the colour tokens were swapped (dark glass → white glass, neon →
 * gold).
 *
 * Supports both <input> and <textarea> via the `multiline` prop.
 */
const GlassInput = forwardRef(function GlassInput(
  {
    label,
    type = "text",
    required,
    className,
    multiline = false,
    rows = 3,
    hint,
    error,
    ...props
  },
  ref
) {
  const id = useId();
  const Field = multiline ? "textarea" : "input";

  return (
    <div className="relative">
      <Field
        ref={ref}
        id={id}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        required={required}
        placeholder=" "
        aria-invalid={!!error}
        className={cn(
          "peer w-full rounded-xl",
          "bg-white/65 backdrop-blur-md",
          "border border-white/85",
          "shadow-[0_2px_10px_rgba(0,0,0,0.03)]",
          "text-stone-800 text-sm placeholder:text-transparent",
          "px-4 pt-5 pb-2",
          multiline && "resize-none pt-6 pb-3 min-h-[96px] leading-relaxed",
          "focus:outline-none",
          "focus:bg-white/85 focus:border-gold-400/70",
          "focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15),inset_0_-1px_0_0_rgba(212,175,55,0.7)]",
          "transition-all duration-200",
          error &&
            "border-red-300 focus:border-red-400 " +
            "focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15),inset_0_-1px_0_0_#f87171]",
          className
        )}
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          "absolute pointer-events-none transition-all duration-200 left-4",
          // default state = floating up (small, gold caps)
          "top-1.5 text-[10px] tracking-[0.25em] uppercase text-gold-700",
          // empty + not focused → drop down to natural placeholder position
          multiline
            ? "peer-placeholder-shown:top-4"
            : "peer-placeholder-shown:top-3.5",
          "peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal",
          "peer-placeholder-shown:normal-case peer-placeholder-shown:text-stone-400",
          // focus overrides everything → back up to floating gold
          "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-[0.25em]",
          "peer-focus:uppercase peer-focus:text-gold-700",
          error && "text-red-500 peer-focus:text-red-500"
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-gold-600">*</span>}
      </label>

      {(hint || error) && (
        <p
          className={cn(
            "mt-1.5 px-1 text-[11px]",
            error ? "text-red-500" : "text-stone-500"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});

export default GlassInput;
