/** @type {import('tailwindcss').Config} */
module.exports = {
  // Light mode is now the default surface. The "dark" class is intentionally
  // left configured so individual surfaces (e.g. modals over photos) can opt in.
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory base — keeps the room feeling sunlit, not sterile.
        ivory: {
          DEFAULT: "#FDFBF7",
          50:  "#FFFFFF",
          100: "#FDFBF7",
          200: "#F8F3EA",
          300: "#F0E7D5",
          400: "#E5D5A8",
        },

        // Metallic gold accent system. `gold.DEFAULT` is the user-spec #D4AF37.
        gold: {
          DEFAULT: "#D4AF37",
          50:  "#FBF6E4",
          100: "#F5E8C0",
          200: "#EAD68C",
          300: "#DEC158",
          400: "#D4AF37",
          500: "#B8941F",
          600: "#9A7A19",
          700: "#7C5C19",
          800: "#5A4314",
          900: "#3D2D0D",
        },

        // Backwards-compat alias — `text-neon`/`bg-neon`/etc. still work in
        // un-refactored files but now render gold. Will be removed once every
        // surface has been migrated.
        neon: {
          DEFAULT: "#D4AF37",
          soft: "#D4AF37cc",
          dim: "#B8941F",
        },

        // Kept for ember-leaning accents (currently used by ShiftCard's
        // "exchange" border). Will become a softer stone in the staff refactor.
        ember: {
          400: "#E8A668",
          500: "#C97B3E",
          600: "#8C4A1F",
          700: "#5A2E10",
        },

        // The old obsidian palette is intentionally retained so existing dark
        // surfaces that haven't been refactored yet don't error. Per-page
        // refactors will replace `bg-obsidian-*` with `bg-white/...` / `bg-ivory`.
        obsidian: {
          950: "#070809",
          900: "#0B0D10",
          850: "#10141A",
          800: "#161B22",
          700: "#1F2630",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      boxShadow: {
        // ── Glass shadows (soft, elegant) ──────────────────────────
        glass:    "0 8px 30px rgb(0, 0, 0, 0.04)",
        "glass-lg": "0 12px 48px rgb(0, 0, 0, 0.06)",
        "glass-xl": "0 24px 64px rgb(0, 0, 0, 0.08)",

        // ── Gold accents ───────────────────────────────────────────
        gold:      "0 4px 14px rgba(212, 175, 55, 0.35), 0 0 1px rgba(212, 175, 55, 0.6)",
        "gold-soft": "0 2px 10px rgba(212, 175, 55, 0.18)",
        "gold-lg": "0 8px 32px rgba(212, 175, 55, 0.40)",
        "gold-inset": "inset 0 0 16px rgba(212, 175, 55, 0.10)",

        // ── Aliases — old neon tokens now resolve to gold ──────────
        neon:        "0 4px 14px rgba(212, 175, 55, 0.35), 0 0 1px rgba(212, 175, 55, 0.6)",
        "neon-soft": "0 2px 10px rgba(212, 175, 55, 0.18)",
        "neon-inset":"inset 0 0 16px rgba(212, 175, 55, 0.10)",
      },

      keyframes: {
        // Gold pulse — replaces the cyan version. Same name preserved so any
        // `animate-pulse-glow` in existing files keeps animating, just gold.
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(212,175,55,0.30)" },
          "50%":      { boxShadow: "0 0 22px rgba(212,175,55,0.65)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        // Slow drift for the ambient amber blobs in the layout backdrop.
        "ambient-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%":      { transform: "translate(20px, -30px) scale(1.05)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },

      animation: {
        "pulse-glow":   "pulse-glow 2.4s ease-in-out infinite",
        "float-y":      "float-y 4s ease-in-out infinite",
        "ambient-drift":"ambient-drift 18s ease-in-out infinite",
        shimmer:        "shimmer 6s linear infinite",
      },

      backgroundImage: {
        // Soft warm radial — replaces the cyan version.
        "grid-fade":
          "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08), transparent 60%)",
        noise:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/></svg>\")",
      },
    },
  },
  plugins: [],
};
