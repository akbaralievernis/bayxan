"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export default function DatePicker({
  label,
  value,
  onChange,
  required,
  min,
  max,
  className,
  ...props
}) {
  const id = useId();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className={cn(
        "relative rounded-xl transition-all duration-200 touch-target-lg",
        "bg-white/60 backdrop-blur-md border border-stone-200",
        "shadow-[0_2px_10px_rgba(0,0,0,0.03)]",
        "hover:bg-white/80 hover:border-stone-300",
        "focus-within:bg-white focus-within:border-gold-400/70",
        "focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15),inset_0_-1px_0_0_rgba(212,175,55,0.7)]",
        className
      )}
    >
      <label
        htmlFor={id}
        className="block px-4 pt-2 text-[10px] tracking-[0.25em] uppercase text-gold-700"
      >
        {label}
        {required && <span className="ml-0.5 text-gold-600">*</span>}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        required={required}
        min={min || today}
        max={max}
        style={{ colorScheme: "light" }}
        className={cn(
          "w-full bg-transparent px-4 pb-2 pt-0.5 text-sm",
          "text-stone-800 focus:outline-none cursor-pointer",
          !value && "text-stone-400"
        )}
        {...props}
      />
    </div>
  );
}
