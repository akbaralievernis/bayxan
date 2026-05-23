"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, RotateCw } from "lucide-react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import GoldButton from "@/components/ui/GoldButton";
import { POSITION_OPTIONS } from "@/lib/staffData";
import { cn } from "@/lib/utils";

const EMPTY = {
  name: "",
  phone: "",
  position: "",
  about: "",
};

export default function CareersForm() {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const updateField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Simulated network call — replace with lib/api/careers.js later.
    await new Promise((r) => setTimeout(r, 1200));
    console.info("[careers] application:", form);
    setSubmitting(false);
    setDone(true);
  }

  function reset() {
    setForm(EMPTY);
    setDone(false);
  }

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-7">
      <header className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-600 mb-2">
          · Карьера ·
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-stone-800 leading-tight">
          Присоединяйтесь<br />к команде <span className="gold-text italic">Bayhan</span>
        </h2>
        <p className="mt-3 text-stone-500 text-sm leading-relaxed max-w-md">
          Оставьте заявку — мы свяжемся в течение 3 рабочих дней и пригласим
          на собеседование.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={onSubmit}
            className="space-y-3"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <GlassInput
                label="Полное имя"
                value={form.name}
                onChange={updateField("name")}
                required
                autoComplete="name"
              />
              <GlassInput
                label="Телефон"
                type="tel"
                value={form.phone}
                onChange={updateField("phone")}
                required
                autoComplete="tel"
              />
            </div>

            <GlassSelect
              label="Желаемая должность"
              value={form.position}
              onChange={(v) => setField("position", v)}
              options={POSITION_OPTIONS}
              required
              placeholder="Выберите позицию"
            />

            <GlassInput
              label="О себе и опыте работы"
              value={form.about}
              onChange={updateField("about")}
              multiline
              rows={4}
              hint="Кратко: где работали, что умеете, почему хотите к нам."
            />

            <GoldButton
              type="submit"
              disabled={submitting || !form.name.trim() || !form.phone.trim() || !form.position}
              className="w-full mt-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Spinner /> Отправляем…
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={2.4} /> Отправить заявку
                </>
              )}
            </GoldButton>
          </motion.form>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1, stiffness: 240, damping: 16 }}
              className="mx-auto w-16 h-16 rounded-full bg-amber-50 border border-amber-200 grid place-items-center mb-4 shadow-[0_4px_16px_rgba(212,175,55,0.15)]"
            >
              <Check size={28} strokeWidth={3} className="text-amber-600" />
            </motion.div>
            <h3 className="font-display text-2xl text-stone-800 mb-2">Заявка отправлена</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
              Спасибо за интерес к Bayhan. Мы свяжемся с вами в ближайшие
              3 рабочих дня.
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-amber-200 text-amber-700 text-xs uppercase tracking-wider hover:bg-amber-50/50 hover:border-amber-300 transition-all"
            >
              <RotateCw size={12} /> Подать ещё одну
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
