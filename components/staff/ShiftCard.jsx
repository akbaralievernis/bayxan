"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRightLeft, Hand, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "ввг", "сен", "окт", "ноя", "дек"];

function parseDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return {
    dayShort: DAYS[d.getDay()],
    dayNum: d.getDate(),
    month: MONTHS[d.getMonth()],
    isToday: d.toDateString() === new Date().toDateString(),
  };
}

function durationHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60;
  return (mins / 60).toFixed(0);
}

export default function ShiftCard({ shift, mode = "mine", onAction, busy = false }) {
  const { dayShort, dayNum, month, isToday } = parseDate(shift.date);
  const hours = durationHours(shift.startTime, shift.endTime);

  const isMine = mode === "mine";
  const ActionIcon = isMine ? ArrowRightLeft : Hand;

  return (
    <motion.article
      layout
      layoutId={shift.id}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "relative flex gap-3 p-3 rounded-xl glass-panel",
        "hover:border-gold-300/40 transition-colors shadow-sm",
        "border-l-2",
        isMine ? "border-l-amber-500" : "border-l-stone-400"
      )}
    >
      {/* Date block */}
      <div
        className={cn(
          "shrink-0 w-14 rounded-lg flex flex-col items-center justify-center py-2",
          "bg-stone-100 border border-stone-200/50"
        )}
      >
        <div className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
          {dayShort}
        </div>
        <div className="font-display text-2xl leading-none text-stone-800 tabular-nums font-semibold">
          {dayNum}
        </div>
        <div className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mt-0.5">
          {month}
        </div>
        {isToday && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[8px] font-bold uppercase tracking-wider">
            сегодня
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        {/* Time + duration */}
        <div className="flex items-center gap-2 text-stone-800">
          <Clock size={12} className={isMine ? "text-amber-600" : "text-stone-500"} />
          <span className="font-display text-sm tabular-nums font-medium">
            {shift.startTime} — {shift.endTime}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 ml-auto tabular-nums">
            {hours} ч
          </span>
        </div>

        {/* Owner (only shown on exchange-board cards) */}
        {!isMine && (
          <div className="text-[12px] text-stone-600 leading-tight">
            <span className="text-stone-800 font-medium">{shift.userName}</span>
            <span className="text-stone-400"> · {shift.userRole}</span>
          </div>
        )}

        {/* Action */}
        <motion.button
          type="button"
          onClick={onAction}
          disabled={busy}
          whileHover={!busy ? { x: 2 } : undefined}
          whileTap={!busy ? { scale: 0.97 } : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 self-start mt-1",
            "px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold",
            "transition-all no-tap-highlight",
            busy && "opacity-60 cursor-wait",
            isMine
              ? "bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-100/70 hover:border-amber-300"
              : "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 hover:border-stone-300"
          )}
        >
          {busy ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <ActionIcon size={11} strokeWidth={2.5} />
          )}
          {isMine ? "Предложить замену" : "Взять смену"}
        </motion.button>
      </div>
    </motion.article>
  );
}
