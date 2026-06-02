"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin, Phone, Sparkles, ExternalLink } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import MapEmbed from "@/components/ui/MapEmbed";
import { useT } from "@/components/providers/LocaleProvider";
import { RESTAURANT } from "@/lib/constants";

/**
 * Final-act call-to-action. Dark canvas with drifting copper glow, a giant
 * editorial headline, three info chips (address / hours / phone) and the
 * primary booking button. Sits right before the footer.
 */
export default function VisitCTA() {
  const t = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const headingY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={ref}
      className="relative bg-[#0F0A07] text-[#FDF6E2] overflow-hidden"
    >
      {/* Top fade — handoff from Testimonials above (ivory in light theme,
          chocolate in dark theme). */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FDFBF7] dark:from-[#120D0A] to-transparent pointer-events-none"
      />

      {/* Ambient copper glow with subtle scroll parallax */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184,115,51,0.28), transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 -right-32 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.22), transparent 60%)",
          }}
        />
      </motion.div>

      {/* Faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 lg:py-40 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.4em] text-amber-400 mb-5 font-semibold inline-flex items-center gap-2"
        >
          <Sparkles size={12} className="text-amber-400" />
          {t("visit.eyebrow")}
        </motion.p>

        <motion.h2
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.98] tracking-tight text-balance max-w-4xl mx-auto"
        >
          {t("visit.heading.l1")}<br />
          <span className="gold-text italic">{t("visit.heading.l2")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-7 sm:mt-9 max-w-xl mx-auto text-stone-300 leading-relaxed"
        >
          {t("visit.tagline")}
        </motion.p>

        {/* Map + info — split layout. Map left (anchors the eye), info stack
            right. Stacks vertically on mobile so the map keeps its aspect. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 sm:mt-16 grid lg:grid-cols-[1.3fr,1fr] gap-4 sm:gap-5 max-w-5xl mx-auto text-left"
        >
          <MapEmbed
            variant="dark"
            height={380}
            label={t("visit.map.label")}
            className="min-h-[280px]"
          />

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <InfoChip
              icon={<MapPin size={16} className="text-amber-400" />}
              title={t("visit.address.title")}
              body={t("visit.address.body")}
              subline={t("visit.address.line2")}
              action={
                <a
                  href={RESTAURANT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-amber-300 hover:text-amber-200 mt-2 transition-colors"
                >
                  {t("visit.address.maps_cta")} <ExternalLink size={10} />
                </a>
              }
            />
            <InfoChip
              icon={<Clock size={16} className="text-amber-400" />}
              title={t("visit.hours.title")}
              body={t("visit.hours.body")}
            />
            <InfoChip
              icon={<Phone size={16} className="text-amber-400" />}
              title={t("visit.phone.title")}
              body={
                <a
                  href={`tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-amber-200 transition-colors"
                >
                  {RESTAURANT.phone}
                </a>
              }
              action={
                <a
                  href={`tel:${RESTAURANT.phoneAlt.replace(/[^\d+]/g, "")}`}
                  className="block text-sm text-stone-300 hover:text-amber-200 transition-colors mt-1 tabular-nums"
                >
                  {RESTAURANT.phoneAlt}
                </a>
              }
            />
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 sm:mt-14 flex justify-center"
        >
          <GoldButton href="/booking" variant="primary" className="px-8 py-4 text-base">
            {t("visit.cta")}
          </GoldButton>
        </motion.div>

        {/* Subtle pulse ring under the button */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-6 flex justify-center"
        >
          <span className="block w-12 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function InfoChip({ icon, title, body, subline, action }) {
  return (
    <div className="group rounded-2xl bg-black/30 backdrop-blur-md border border-amber-900/40 hover:border-amber-500/40 px-5 py-5 transition-colors text-left">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-400/80 mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <div className="font-display text-base sm:text-lg text-[#FDF6E2] leading-snug">
        {body}
      </div>
      {subline && (
        <div className="mt-1 text-xs text-stone-400 leading-relaxed">{subline}</div>
      )}
      {action}
    </div>
  );
}
