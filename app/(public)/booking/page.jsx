"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import OrderSummary from "@/components/booking/OrderSummary";
import BookingSuccess from "@/components/booking/BookingSuccess";
import { useCartStore } from "@/store/useCartStore";
import { submitBooking } from "@/lib/api/bookings";
import { cn } from "@/lib/utils";

const TABLE_TYPES = [
  { id: "standard", label: "Обычный стол", hint: "2–4 гостя"  },
  { id: "vip",      label: "VIP-кабина",    hint: "4–8 гостей" },
  { id: "terrace",  label: "Терраса",       hint: "2–6 гостей" },
];

const EVENT_TYPES = [
  { id: "casual",      label: "Обычный ужин" },
  { id: "birthday",    label: "День рождения" },
  { id: "corporate",   label: "Корпоратив" },
  { id: "anniversary", label: "Годовщина" },
];

const GUEST_OPTIONS = [
  { id: "2",  label: "2 гостя" },
  { id: "3",  label: "3 гостя" },
  { id: "4",  label: "4 гостя" },
  { id: "5",  label: "5 гостей" },
  { id: "6",  label: "6 гостей" },
  { id: "8",  label: "8 гостей" },
  { id: "10", label: "10+ гостей" },
];

export default function BookingPage() {
  const items = useCartStore((s) => s.items);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    tableType: "standard",
    eventType: "casual",
    requests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg("");
    setSubmitting(true);
    const result = await submitBooking(form, items);
    setSubmitting(false);
    if (result.ok) {
      setSuccess(result.bookingId);
    } else {
      setErrorMsg(result.error || "Не удалось отправить бронь. Попробуйте ещё раз.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="py-8 sm:py-12"
      >
        <p className="text-[11px] uppercase tracking-[0.35em] text-amber-700 mb-3">
          · Бронирование ·
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-stone-900">
          Стол ждёт<br />
          <span className="gold-text italic">именно вас.</span>
        </h1>
        <p className="mt-5 max-w-xl text-stone-600 leading-relaxed">
          Заполните форму — мы подтвердим бронь в течение нескольких минут.
          Можно добавить блюда из меню как предзаказ.
        </p>
      </motion.header>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr,360px] gap-6 lg:gap-8 items-start">
        {/* ───── LEFT — Form ───── */}
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Section title="Контактные данные">
            <div className="grid sm:grid-cols-2 gap-3">
              <GlassInput
                label="Имя"
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
                hint="Формат: +996 ..."
              />
            </div>
          </Section>

          <Section title="Дата · время · гости">
            <div className="grid sm:grid-cols-3 gap-3">
              <DatePicker
                label="Дата"
                value={form.date}
                onChange={updateField("date")}
                required
              />
              <TimePicker
                label="Время"
                value={form.time}
                onChange={updateField("time")}
                required
              />
              <GlassSelect
                label="Гостей"
                value={form.guests}
                onChange={(v) => setField("guests", v)}
                options={GUEST_OPTIONS}
                required
              />
            </div>
          </Section>

          <Section title="Зона и повод">
            <div className="grid sm:grid-cols-2 gap-3">
              <GlassSelect
                label="Тип стола"
                value={form.tableType}
                onChange={(v) => setField("tableType", v)}
                options={TABLE_TYPES}
                required
              />
              <GlassSelect
                label="Тип мероприятия"
                value={form.eventType}
                onChange={(v) => setField("eventType", v)}
                options={EVENT_TYPES}
              />
            </div>
          </Section>

          <Section title="Особые пожелания">
            <GlassInput
              label="Пожелания (аллергии, рассадка и т.д.)"
              value={form.requests}
              onChange={updateField("requests")}
              multiline
              rows={3}
            />
          </Section>

          {/* Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-md px-4 py-3 text-sm text-red-700"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <SubmitButton submitting={submitting} hasPreorder={items.length > 0} />

          <p className="text-center text-[11px] text-stone-400">
            Нажимая «Подтвердить», вы соглашаетесь с условиями обслуживания.
          </p>
        </form>

        {/* ───── RIGHT — Summary ───── */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <OrderSummary />
        </aside>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {success && (
          <BookingSuccess
            bookingId={success}
            onClose={() => setSuccess(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl p-4 sm:p-5",
        "bg-white/70 backdrop-blur-md border border-white/90 shadow-sm"
      )}
    >
      <legend className="text-[11px] uppercase tracking-[0.3em] text-stone-500 mb-3 px-1">
        {title}
      </legend>
      <div className="space-y-3">{children}</div>
    </motion.fieldset>
  );
}

function SubmitButton({ submitting, hasPreorder }) {
  return (
    <motion.button
      type="submit"
      disabled={submitting}
      whileHover={!submitting ? { y: -2 } : undefined}
      whileTap={!submitting ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={cn(
        "group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden",
        "px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm",
        "text-white",
        "bg-gradient-to-br from-amber-300 via-gold-400 to-yellow-600",
        "shadow-gold hover:shadow-gold-lg transition-shadow",
        "disabled:opacity-70 disabled:cursor-wait"
      )}
    >
      {/* Shimmer sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {submitting ? (
          <>
            <Spinner /> Подтверждаем бронь…
          </>
        ) : (
          <>
            <Sparkles size={16} strokeWidth={2.4} />
            {hasPreorder ? "Подтвердить бронь и предзаказ" : "Подтвердить бронирование"}
          </>
        )}
      </span>
    </motion.button>
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
