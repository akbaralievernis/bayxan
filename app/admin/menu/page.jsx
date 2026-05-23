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
} from "lucide-react";
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/api/admin";
import { CATEGORIES } from "@/lib/mockData";
import { formatKGS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MenuAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    const rows = await listMenuItems();
    setItems(rows);
    setLoading(false);
  }

  const visible = useMemo(() => {
    return items.filter((it) => {
      if (category !== "all" && it.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(`${it.name} ${it.description || ""}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [items, category, query]);

  async function handleSave(payload) {
    setBusy(true);
    const res = editing?.id
      ? await updateMenuItem(editing.id, payload)
      : await createMenuItem(payload);
    setBusy(false);
    if (res.ok) {
      setEditing(null);
      await refresh();
    } else {
      alert(`Не удалось сохранить: ${res.error || "ошибка"}`);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Удалить «${item.name}»? Это действие нельзя отменить.`)) return;
    setBusy(true);
    const res = await deleteMenuItem(item.id);
    setBusy(false);
    if (res.ok) await refresh();
  }

  async function toggleActive(item) {
    const res = await updateMenuItem(item.id, { ...item, active: !item.active });
    if (res.ok) {
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, active: !item.active } : p))
      );
    }
  }

  const counts = useMemo(() => {
    const map = { all: items.length };
    CATEGORIES.forEach((c) => {
      if (c.id !== "all") map[c.id] = items.filter((i) => i.category === c.id).length;
    });
    return map;
  }, [items]);

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
            · Меню ·
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#FDF6E2]">
            Редактирование <span className="gold-text italic">меню.</span>
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {items.length} {plurDishes(items.length)} в каталоге
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600 text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-gold hover:shadow-gold-lg transition-shadow"
        >
          <Plus size={14} /> Добавить блюдо
        </button>
      </motion.header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 flex-1">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors border",
                  active
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/50"
                    : "text-stone-400 border-amber-900/30 hover:border-amber-700/50"
                )}
              >
                {c.short || c.label}
                <span className={cn(
                  "tabular-nums text-[10px] px-1.5 rounded-full",
                  active ? "bg-amber-500/20 text-amber-200" : "bg-amber-900/30 text-stone-400"
                )}>
                  {counts[c.id] ?? 0}
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

      {/* Grid */}
      {loading ? (
        <MenuGridSkeleton />
      ) : visible.length === 0 ? (
        <div className="rounded-2xl bg-black/30 border border-amber-900/30 py-16 text-center text-stone-500 text-sm">
          В этой категории пока нет блюд.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onEdit={() => setEditing(item)}
                onDelete={() => handleDelete(item)}
                onToggleActive={() => toggleActive(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <MenuEditor
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

/* ───────────────────────── Card ───────────────────────── */

function MenuCard({ item, onEdit, onDelete, onToggleActive }) {
  const cat = CATEGORIES.find((c) => c.id === item.category);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-black/30 border transition-all",
        item.active
          ? "border-amber-900/30 hover:border-amber-700/50"
          : "border-stone-800/50 opacity-60"
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-stone-900">
        {item.imagePlaceholder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imagePlaceholder}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-stone-900 grid place-items-center text-amber-500/50 font-display text-3xl">
            {item.name?.[0] ?? "?"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Active indicator */}
        {!item.active && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-stone-700 text-stone-300 text-[9px] uppercase tracking-[0.2em] font-semibold">
            <EyeOff size={9} /> Скрыто
          </div>
        )}

        {/* Category chip */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-200 text-[9px] uppercase tracking-[0.2em] font-semibold">
          {cat?.short || cat?.label || item.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-base text-[#FDF6E2] leading-tight line-clamp-1">
            {item.name}
          </h3>
          <span className="font-display text-base text-amber-300 tabular-nums shrink-0">
            {formatKGS(item.price)}
          </span>
        </div>
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
          {item.description}
        </p>

        <div className="flex items-center gap-1.5">
          <ActionBtn icon={Edit3}            label="Изменить" onClick={onEdit} />
          <ActionBtn icon={item.active ? EyeOff : Eye}
                     label={item.active ? "Скрыть" : "Показать"}
                     onClick={onToggleActive} />
          <ActionBtn icon={Trash2} label="Удалить" onClick={onDelete} variant="danger" />
        </div>
      </div>
    </motion.article>
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
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
        cls
      )}
    >
      <Icon size={13} />
    </button>
  );
}

/* ───────────────────────── Editor modal ───────────────────────── */

function MenuEditor({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    category: initial?.category ?? CATEGORIES.find((c) => c.id !== "all")?.id ?? "national",
    imagePlaceholder: initial?.imagePlaceholder ?? "",
    active: initial ? initial.active : true,
  });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0) return;
    onSave(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 grid place-items-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1A1410] border border-amber-900/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <header className="sticky top-0 z-10 px-6 py-4 border-b border-amber-900/30 bg-[#1A1410]/95 backdrop-blur-md flex items-center justify-between">
          <h2 className="font-display text-xl text-[#FDF6E2]">
            {initial ? "Редактирование" : "Новое блюдо"}
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
          <Field label="Название" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Описание">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={cn(inputCls, "resize-none")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Цена (KGS)" required>
              <input
                type="number"
                min="0"
                step="10"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                required
                className={inputCls + " tabular-nums"}
              />
            </Field>
            <Field label="Категория">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="URL изображения" hint="Опционально — Unsplash / Cloudinary / прямая ссылка">
            <input
              type="url"
              placeholder="https://…"
              value={form.imagePlaceholder}
              onChange={(e) => update("imagePlaceholder", e.target.value)}
              className={inputCls}
            />
          </Field>

          {form.imagePlaceholder && (
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-amber-900/30 bg-stone-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.imagePlaceholder} alt="" className="w-full h-full object-cover" />
            </div>
          )}

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
              Активно <span className="text-stone-500 text-xs">(видно гостям на сайте)</span>
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
            disabled={busy || !form.name.trim() || form.price <= 0}
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

function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-2xl bg-black/30 border border-amber-900/20 overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-amber-900/10" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-2/3 bg-amber-900/15 rounded" />
            <div className="h-2 w-full bg-amber-900/10 rounded" />
            <div className="h-2 w-3/4 bg-amber-900/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function plurDishes(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "блюдо";
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "блюда";
  return "блюд";
}
