import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { RESTAURANT } from "@/lib/constants";

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: `${RESTAURANT.name} · Premium Dining in ${RESTAURANT.city}`,
  description:
    `${RESTAURANT.name} (${RESTAURANT.nameLocal}) — a modern dining destination by ${RESTAURANT.owner}.`,
  themeColor: "#FDFBF7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans bg-ivory text-stone-800 antialiased min-h-screen overflow-x-clip">
        {/* ── Ambient backdrop — warm, blurred, sunlit ──────────── */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Top-left golden sunrise */}
          <div
            className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full opacity-60 blur-3xl animate-ambient-drift"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.25), transparent 65%)" }}
          />
          {/* Right amber wash */}
          <div
            className="absolute top-1/3 -right-48 w-[560px] h-[560px] rounded-full opacity-55 blur-3xl animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(251, 191, 36, 0.18), transparent 65%)",
              animationDelay: "-6s",
            }}
          />
          {/* Bottom warm peach */}
          <div
            className="absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full opacity-50 blur-3xl animate-ambient-drift"
            style={{
              background: "radial-gradient(circle, rgba(255, 213, 175, 0.30), transparent 65%)",
              animationDelay: "-12s",
            }}
          />
          {/* Very subtle paper-grain — multiplies into the ivory for warmth */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-multiply" />
        </div>

        {children}
      </body>
    </html>
  );
}
