import { RESTAURANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Embedded Google Maps iframe centered on the restaurant's real coordinates.
 *
 * Uses the keyless `https://maps.google.com/maps?q=lat,lng&output=embed`
 * format so we don't need a Maps JS API billing setup. The trade-off is no
 * custom styling — but the dark wrapper + frame around the iframe sells
 * the premium aesthetic without touching the map itself.
 *
 * `variant="dark"` overlays a subtle gold ring + soft inner shadow; use it
 * on dark sections (VisitCTA, Spaces). `variant="light"` is cleaner for
 * ivory backdrops (footer, contact pages).
 */
export default function MapEmbed({
  zoom = 16,
  height = 380,
  className,
  variant = "dark",
  label,
}) {
  const { lat, lng } = RESTAURANT.geo;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl",
        variant === "dark"
          ? "border border-amber-900/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          : "border border-white/85 shadow-glass",
        className
      )}
    >
      <iframe
        title="Карта · Кафе Байхан"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block w-full"
        style={{ height, border: 0 }}
      />

      {/* Gold inset frame on dark variant */}
      {variant === "dark" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.35)",
          }}
        />
      )}

      {/* Optional caption chip */}
      {label && (
        <figcaption className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-amber-400/40 text-amber-200 text-[10px] uppercase tracking-[0.3em] font-semibold">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
