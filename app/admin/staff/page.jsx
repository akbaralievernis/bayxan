"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  EyeOff,
  Eye,
  Loader2,
  KeyRound,
  Phone,
  Briefcase,
} from "lucide-react";
import {
  listStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  STAFF_ROLES,
} from "@/lib/api/admin";
import RoleBadge from "@/components/admin/RoleBadge";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all",     label: "Все" },
  { id: "admin",   label: "Админы" },
  { id: "waiter",  label: "Официанты" },
  { id: "cashier", label: "Кассиры" },
  { id: "cook",    label: "Кухня" },
];

export default function StaffAdminPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    setLoading(true);
    const rows = await listStaff();
    setStaff(rows);
    setLoading(false);
  }

  const visible = useMemo(() => {
    return staff.filter((s) => {
      if (filter === "admin")  { if (!(s.role === "admin" || s.role === "manager")) return false; }
      else if (filter === "cook") { if (!(s.role === "cook" || s.role === "kitchen")) return false; }
      else if (filter !== "all") { if (s.role !== filter) return false; }
      if (query) {
        const q = query.toLowerCase();
        if (!`${s.name} ${s.title || ""} ${s.phone || ""}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [staff, filter, query]);

  const counts = useMemo(() => ({
    all:     staff.length,
    admin:   staff.filter((s) => s.role === "admin" || s.role === "manager").length,
    waiter:  staff.filter((s) => s.role === "waiter").length,
    cashier: staff.filter((s) => s.role === "cashier").length,
    cook:    staff.filter((s) => s.role === "cook" || s.role === "kitchen").length,
  }), [staff]);

  async function handleSave(payload) {
    setBusy(true);
    const res = editing?.id
      ? await updateStaff(editing.id, payload)
      : await createStaff(payload);
    setBusy(false);
    if (res.ok) {
      setEditing(null);
      await refresh();
    } else {
      alert(res.error || "Ошибка сохранения");
    }
  }

  async function handleDelete(s) {
    if (!confirm(`Удалить ${s.name}? Это действие нельзя отменить.`)) return;
    setBusy(true);
    const res = await deleteStaff(s.id);
    setBusy(false);
    if (res.ok) await refresh();
  }

  async function toggleActive(s) {
    const res = await updateStaff(s.id, { ...s, active: !s.active });
    if (res.ok) {
      setStaff((prev) => prev.map((p) => (p.id === s.id ? { ...p, active: !s.active } : p)));
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400 mb-2 font-semibold">
            · Сотрудники ·
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2]">
            Управление <span className="gold-text italic">командой.</span>
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {staff.length} {plurPeople(staff.length)} · {staff.filter((s) => s.active).length} активных
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-gold hover:shadow-gold-lg transition-shadow"
        >
          <Plus size={14} /> Добавить
        </button>
      </motion.header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 flex-1">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors border",
                  active
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/50"
                    : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                )}
              >
                {f.label}
                <span className={cn(
                  "tabular-nums text-[10px] px-1.5 rounded-full",
                  active ? "bg-amber-500/20 text-amber-200" : "bg-amber-900/30 text-stone-400"
                )}>
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Поиск…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-full bg-black/30 border border-amber-900/30 text-sm text-[#FDF6E2] placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {loading ? (
        <StaffSkeleton />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl bg-black/30 border border-amber-900/30 py-16 text-center text-stone-500 text-sm">
          Никого не найдено.
        </div>
      ) : (
        <div className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/30 overflow-hidden">
          <ul className="divide-y divide-amber-900/30">
            <AnimatePresence initial={false}>
              {visible.map((s) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "px-4 sm:px-6 py-4 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] gap-3 sm:gap-4 items-center transition-colors hover:bg-amber-500/[0.03]",
                    !s.active && "opacity-50"
                  )}
                >
                  <Avatar name={s.name} />

                  <div className="min-w-0">
                    <div className="text-sm sm:text-[15px] text-[#FDF6E2] font-medium truncate">
                      {s.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                      <span className="truncate">{s.title}</span>
                      {s.phone && (
                        <>
                          <span className="text-stone-700">·</span>
                          <span className="tabular-nums truncate">{s.phone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <RoleBadge role={s.role} />
                    {s.pin && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-500/70 tabular-nums">
                        <KeyRound size={10} /> ••{s.pin?.slice(-2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ActionBtn icon={Edit3} label="Изменить" onClick={() => setEditing(s)} />
                    <ActionBtn
                      icon={s.active ? EyeOff : Eye}
                      label={s.active ? "Деактивировать" : "Активировать"}
                      onClick={() => toggleActive(s)}
                    />
                    <ActionBtn icon={Trash2} label="Удалить" onClick={() => handleDelete(s)} variant="danger" />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <StaffEditor
            initial={editing === "new" ? null : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            busy={busy}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Avatar({ name }) {
  const initials = name ? name.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("") : "?";
  return (
    <div className="w-10 h-10 rounded-full grid place-items-center bg-gradient-to-br from-amber-300 to-yellow-700 text-stone-900 text-sm font-bold shadow-gold-soft">
      {initials || "?"}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, variant }) {
  const cls = variant === "danger"
    ? "border-amber-900/30 text-stone-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/10"
    : "border-amber-900/30 text-stone-400 hover:text-amber-300 hover:border-amber-700/50 hover:bg-amber-500/5";
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn("inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors", cls)}
    >
      <Icon size={13} />
    </button>
  );
}

function StaffEditor({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState({
    name:       initial?.name       ?? "",
    title:      initial?.title      ?? "",
    role:       initial?.role       ?? "waiter",
    department: initial?.department ?? "hall",
    phone:      initial?.phone      ?? "",
    pin:        initial?.pin        ?? "",
    active:     initial ? initial.active : true,
  });

  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !/^\d{4}$/.test(form.pin)) return;
    onSave(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
      className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1A1410] border border-amber-900/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <header className="sticky top-0 z-10 px-6 py-4 border-b border-amber-900/30 bg-[#1A1410]/95 backdrop-blur-md flex items-center justify-between">
          <h2 className="font-display text-xl text-[#FDF6E2]">
            {initial ? "Редактирование" : "Новый сотрудник"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 grid place-items-center rounded-full border border-amber-900/30 text-stone-400 hover:text-[#FDF6E2] hover:border-amber-700/50"
          >
            <X size={14} />
          </button>
        </header>

        <div className="px-6 py-5 space-y-4">
          <Field label="Имя" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={inputCls}
              placeholder="Айгуль Сатарова"
            />
          </Field>

          <Field label="Должность" hint="Как отображать в UI — например, «Старший официант»">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputCls}
              placeholder="Официант"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Роль" required>
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className={inputCls}
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Отдел">
              <select
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                className={inputCls}
              >
                <option value="admin">Администрация</option>
                <option value="hall">Зал</option>
                <option value="kitchen">Кухня</option>
                <option value="bar">Бар</option>
              </select>
            </Field>
          </div>

          <Field label="Телефон">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputCls}
              placeholder="+996 …"
            />
          </Field>

          <Field label="PIN-код (4 цифры)" required hint="Используется для входа в портал">
            <input
              type="text"
              inputMode="numeric"
              value={form.pin}
              onChange={(e) => update("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
              required
              maxLength={4}
              className={inputCls + " tabular-nums tracking-[0.4em] text-center"}
              placeholder="••••"
            />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer py-2">
            <span className="relative inline-block w-10 h-6 rounded-full bg-stone-800 border border-amber-900/40 transition-colors">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
                className="sr-only peer"
              />
              <span className="absolute inset-0 rounded-full bg-amber-500/30 opacity-0 peer-checked:opacity-100 transition-opacity" />
              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-stone-400 peer-checked:bg-amber-300 peer-checked:translate-x-4 transition-transform" />
            </span>
            <span className="text-sm text-[#FDF6E2]">
              Активен <span className="text-stone-500 text-xs">(может входить в портал)</span>
            </span>
          </label>
        </div>

        <footer className="sticky bottom-0 z-10 px-6 py-4 border-t border-amber-900/30 bg-[#1A1410]/95 backdrop-blur-md flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-amber-900/30 text-stone-400 text-xs uppercase tracking-wider hover:text-[#FDF6E2]"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={busy || !form.name.trim() || !/^\d{4}$/.test(form.pin)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy && <Loader2 size={12} className="animate-spin" />}
            {initial ? "Сохранить" : "Создать"}
          </button>
        </footer>
      </motion.form>
    </motion.div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-900/40 text-sm text-[#FDF6E2] placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)] transition-all";

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-400 mb-1.5 font-semibold">
        {label}{required && <span className="ml-0.5 text-amber-300">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1 text-[10px] text-stone-500">{hint}</span>}
    </label>
  );
}

function StaffSkeleton() {
  return (
    <ul className="rounded-2xl bg-black/30 border border-amber-900/30 divide-y divide-amber-900/20 overflow-hidden">
      {[0, 1, 2, 3, 4].map((i) => (
        <li key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-amber-900/15" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-amber-900/15 rounded" />
            <div className="h-2 w-1/4 bg-amber-900/10 rounded" />
          </div>
          <div className="w-16 h-5 bg-amber-900/15 rounded" />
        </li>
      ))}
    </ul>
  );
}

function plurPeople(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "сотрудник";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "сотрудника";
  return "сотрудников";
}
