import { cn } from "@/lib/utils";

const STATUSES = {
  open:       { label: "Открыт",      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  preparing:  { label: "Готовится",   cls: "bg-amber-500/15  text-amber-300   border-amber-500/40" },
  served:     { label: "Подано",      cls: "bg-blue-500/15   text-blue-300    border-blue-500/40" },
  paying:     { label: "Расчёт",      cls: "bg-purple-500/15 text-purple-300  border-purple-500/40" },
  closed:     { label: "Закрыт",      cls: "bg-stone-500/15  text-stone-300   border-stone-500/40" },
  cancelled:  { label: "Отменён",     cls: "bg-red-500/15    text-red-300     border-red-500/40" },
};

export default function OrderStatusBadge({ status, className }) {
  const meta = STATUSES[status] || STATUSES.open;
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

export const ORDER_STATUS_OPTIONS = Object.keys(STATUSES).map((id) => ({ id, label: STATUSES[id].label }));
