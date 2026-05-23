import { cn } from "@/lib/utils";

const STATUSES = {
  free:     { label: "Свободен",    cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  occupied: { label: "Занят",       cls: "bg-amber-500/15  text-amber-300   border-amber-500/40" },
  reserved: { label: "Бронь",       cls: "bg-blue-500/15   text-blue-300    border-blue-500/40" },
  cleaning: { label: "Уборка",      cls: "bg-purple-500/15 text-purple-300  border-purple-500/40" },
  closed:   { label: "Закрыт",      cls: "bg-stone-500/15  text-stone-300   border-stone-500/40" },
};

export default function TableStatusBadge({ status, className }) {
  const meta = STATUSES[status] || STATUSES.free;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-[0.18em] font-semibold",
        meta.cls,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      {meta.label}
    </span>
  );
}

export const TABLE_STATUS_OPTIONS = Object.keys(STATUSES).map((id) => ({ id, label: STATUSES[id].label }));
export const ZONE_LABELS = { main: "Главный зал", vip: "VIP", terrace: "Терраса" };
