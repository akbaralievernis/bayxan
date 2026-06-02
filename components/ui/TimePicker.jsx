"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export default function TimePicker({
  label,
  value,
  onChange,
  required,
  step = 900, // 15-min increments by default
  min,
  max,
  className,
  ...props
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "relative rounded-xl transition-all duration-200 touch-target-lg",
        "bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-800",
        "shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.25)]",
        "hover:bg-white/80 dark:hover:bg-stone-900/80 hover:border-stone-300 dark:hover:border-stone-700",
        "focus-within:bg-white dark:focus-within:bg-stone-900 focus-within:border-gold-400/70 dark:focus-within:border-gold-500/70",
        "focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15),inset_0_-1px_0_0_rgba(212,175,55,0.7)] dark:focus-within:shadow-[0_0_0_3px_rgba(184,134,11,0.15),inset_0_-1px_0_0_rgba(184,134,11,0.7)]",
        className
      )}
    >
      <label
        htmlFor={id}
        className="block px-4 pt-2 text-[10px] tracking-[0.25em] uppercase text-gold-700 dark:text-gold-500"
      >
        {label}
        {required && <span className="ml-0.5 text-gold-600 dark:text-gold-500">*</span>}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        min={min}
        max={max}
        className={cn(
          "w-full bg-transparent px-4 pb-2 pt-0.5 text-sm",
          "text-stone-800 dark:text-[#FDF6E2] focus:outline-none cursor-pointer",
          "[color-scheme:light] dark:[color-scheme:dark]",
          !value && "text-stone-400 dark:text-stone-500"
        )}
        {...props}
      />
    </div>
  );
}
