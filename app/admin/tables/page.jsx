"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Loader2, Users, MapPin } from "lucide-react";
import {
  listTables,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
} from "@/lib/api/operations";
import TableStatusBadge, { TABLE_STATUS_OPTIONS, ZONE_LABELS } from "@/components/admin/TableStatusBadge";
import { cn } from "@/lib/utils";

const ZONE_FILTERS = [
  { id: "all",     label: "Все зоны" },
  { id: "main",    label: "Главный зал" },
  { id: "vip",     label: "VIP" },
  { id: "terrace", label: "Терраса" },
];

export default function TablesAdminPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState("all");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    setLoading(true);
    const rows = await listTables();
    setTables(rows);
    setLoading(false);
  }

  const visible = useMemo(() => {
    return tables.filter((t) => zone === "all" || t.zone === zone);
  }, [tables, zone]);

  const stats = useMemo(() => ({
    total:    tables.length,
    free:     tables.filter((t) => t.status === "free").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
  }), [tables]);

  async function handleSave(payload) {
    setBusy(true);
    const res = editing?.id
      ? await updateTable(editing.id, payload)
      : await createTable(payload);
    setBusy(false);
    if (res.ok) {
      setEditing(null);
      await refresh();
    } else {
      alert(res.error || "Ошибка сохранения");
    }
  }

  async function handleDelete(t) {
    if (!confirm(`Удалить стол №${t.number}?`)) return;
    setBusy(true);
    const res = await deleteTable(t.id);
    setBusy(false);
    if (res.ok) await refresh();
  }

  async function changeStatus(t, status) {
    setTables((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
    await updateTableStatus(t.id, status);
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
            · Столы ·
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2]">
            Планировка <span className="gold-text italic">зала.</span>
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {stats.total} столов · <span className="text-emerald-400">{stats.free}</span> свободно
            · <span className="text-amber-400">{stats.occupied}</span> заняты
            · <span className="text-blue-400">{stats.reserved}</span> броней
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-gold hover:shadow-gold-lg"
        >
          <Plus size={14} /> Добавить стол
        </button>
      </motion.header>

      <div className="flex items-center gap-1.5 overflow-x-auto mb-5">
        {ZONE_FILTERS.map((z) => {
          const active = zone === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => setZone(z.id)}
              className={cn(
                "shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors border",
                active
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/50"
                  : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
              )}
            >
              {z.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <TablesSkeleton />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl bg-black/30 border border-amber-900/30 py-16 text-center text-stone-500 text-sm">
          Столов нет.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <AnimatePresence initial={false}>
            {visible.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                onEdit={() => setEditing(t)}
                onDelete={() => handleDelete(t)}
                onChangeStatus={(s) => changeStatus(t, s)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <TableEditor
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

function TableCard({ table, onEdit, onDelete, onChangeStatus }) {
  const t = table;
  const statusTint = {
    free:     "from-emerald-500/10 border-emerald-500/30",
    occupied: "from-amber-500/10 border-amber-500/40",
    reserved: "from-blue-500/10 border-blue-500/30",
    cleaning: "from-purple-500/10 border-purple-500/30",
    closed:   "from-stone-700/20 border-stone-700/40",
  }[t.status];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={cn(
        "rounded-2xl border bg-gradient-to-br to-transparent p-4 backdrop-blur-md transition-colors",
        statusTint
      )}
    >
      <header className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
            {ZONE_LABELS[t.zone] || t.zone}
          </div>
          <div className="font-display text-3xl text-[#FDF6E2] leading-tight">
            №{t.number}
          </div>
        </div>
        <TableStatusBadge status={t.status} />
      </header>

      <div className="flex items-center gap-3 mb-4 text-xs text-stone-400">
        <span className="inline-flex items-center gap-1">
          <Users size={11} /> {t.seats} {plurSeats(t.seats)}
        </span>
        {t.current_order_id && (
          <span className="inline-flex items-center gap-1 text-amber-400">
            <MapPin size={11} /> активный заказ
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 mb-3">
        {TABLE_STATUS_OPTIONS.slice(0, 3).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChangeStatus(s.id)}
            disabled={t.status === s.id}
            className={cn(
              "px-1.5 py-1 rounded-md text-[9px] uppercase tracking-wider border transition-colors",
              t.status === s.id
                ? "bg-amber-500/20 text-amber-200 border-amber-500/50 cursor-default"
                : "text-stone-400 border-amber-900/30 hover:text-amber-300 hover:border-amber-700/50"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border border-amber-900/30 text-stone-400 text-[10px] uppercase tracking-wider hover:text-amber-300 hover:border-amber-700/50"
        >
          <Edit3 size={11} /> Изменить
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-amber-900/30 text-stone-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/10"
          title="Удалить"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </motion.article>
  );
}

function TableEditor({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState({
    number: initial?.number ?? 1,
    zone:   initial?.zone   ?? "main",
    seats:  initial?.seats  ?? 2,
    note:   initial?.note   ?? "",
  });

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCancel}
      className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.form
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="relative w-full max-w-sm rounded-2xl bg-[#1A1410] border border-amber-900/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <header className="px-6 py-4 border-b border-amber-900/30 flex items-center justify-between">
          <h2 className="font-display text-xl">{initial ? "Стол" : "Новый стол"}</h2>
          <button type="button" onClick={onCancel} className="w-8 h-8 rounded-full border border-amber-900/30 grid place-items-center text-stone-400 hover:text-[#FDF6E2]">
            <X size={14} />
          </button>
        </header>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Номер" required>
              <input
                type="number" min="1" value={form.number}
                onChange={(e) => update("number", Number(e.target.value))}
                required className={inputCls + " tabular-nums"}
              />
            </Field>
            <Field label="Мест" required>
              <input
                type="number" min="1" max="20" value={form.seats}
                onChange={(e) => update("seats", Number(e.target.value))}
                required className={inputCls + " tabular-nums"}
              />
            </Field>
          </div>

          <Field label="Зона">
            <select value={form.zone} onChange={(e) => update("zone", e.target.value)} className={inputCls}>
              <option value="main">Главный зал</option>
              <option value="vip">VIP</option>
              <option value="terrace">Терраса</option>
            </select>
          </Field>

          <Field label="Примечание">
            <input
              type="text" value={form.note}
              onChange={(e) => update("note", e.target.value)}
              className={inputCls}
              placeholder="У окна, рядом с очагом и т.п."
            />
          </Field>
        </div>

        <footer className="px-6 py-4 border-t border-amber-900/30 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full border border-amber-900/30 text-stone-400 text-xs uppercase tracking-wider hover:text-[#FDF6E2]">
            Отмена
          </button>
          <button
            type="submit" disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-gold disabled:opacity-50"
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
  "w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-900/40 text-sm text-[#FDF6E2] placeholder:text-stone-500 focus:outline-none focus:border-amber-500/60";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-amber-400 mb-1.5 font-semibold">
        {label}{required && <span className="ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function TablesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="rounded-2xl border border-amber-900/20 bg-black/30 h-44 animate-pulse" />
      ))}
    </div>
  );
}

function plurSeats(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "место";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "места";
  return "мест";
}
