import { cn } from "@/lib/utils";

const ROLES = {
  admin:   { label: "Админ",     cls: "bg-amber-500/15  text-amber-300  border-amber-500/40" },
  manager: { label: "Менеджер",  cls: "bg-purple-500/15 text-purple-300 border-purple-500/40" },
  waiter:  { label: "Официант",  cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  cashier: { label: "Кассир",    cls: "bg-blue-500/15   text-blue-300   border-blue-500/40" },
  kitchen: { label: "Кухня",     cls: "bg-orange-500/15 text-orange-300 border-orange-500/40" },
  cook:    { label: "Повар",     cls: "bg-stone-500/15  text-stone-300  border-stone-500/40" },
};

export default function RoleBadge({ role, className }) {
  const meta = ROLES[role] || ROLES.cook;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap",
        meta.cls,
        className
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-80" />
      {meta.label}
    </span>
  );
}
