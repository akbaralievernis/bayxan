import { cn } from "@/lib/utils";

const STATUSES = {
  pending:   { label: "Ожидание",   cls: "bg-amber-500/15  text-amber-300  border-amber-500/40" },
  confirmed: { label: "Подтверждено", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  seated:    { label: "За столом",  cls: "bg-blue-500/15   text-blue-300   border-blue-500/40" },
  completed: { label: "Закрыта",    cls: "bg-stone-500/15  text-stone-300  border-stone-500/40" },
  cancelled: { label: "Отменена",   cls: "bg-red-500/15    text-red-300    border-red-500/40" },
  no_show:   { label: "Не пришли",  cls: "bg-rose-500/15   text-rose-300   border-rose-500/40" },
};

export default function StatusBadge({ status, className }) {
  const meta = STATUSES[status] || STATUSES.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap",
        meta.cls,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {meta.label}
    </span>
  );
}

export const STATUS_OPTIONS = Object.keys(STATUSES).map((id) => ({
  id,
  label: STATUSES[id].label,
}));
