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
  title: `${RESTAURANT.name} · Premium Dining in ${RESTAURANT.cityRu}`,
  description:
    `Кафе ${RESTAURANT.nameLocal} (${RESTAURANT.name}) — премиальный ресторан в ${RESTAURANT.cityRu}, ${RESTAURANT.region}. Бронирование стола онлайн.`,
};

export const viewport = {
  themeColor: "#FDFBF7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                const savedLocale = localStorage.getItem('locale');
                if (savedLocale === 'ru' || savedLocale === 'ky') {
                  document.documentElement.lang = savedLocale;
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans bg-ivory dark:bg-[#120D0A] text-stone-800 dark:text-[#FDF6E2] antialiased min-h-screen overflow-x-clip transition-colors duration-300">
        {/* ── Ambient backdrop — warm, blurred, sunlit ──────────── */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Top-left golden sunrise / copper oven */}
          <div
            className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full opacity-60 blur-3xl animate-ambient-drift transition-all duration-500"
            style={{ background: "radial-gradient(circle, var(--blob-1, rgba(212,175,55,0.25)), transparent 65%)" }}
          />
          {/* Right amber/bronze wash */}
          <div
            className="absolute top-1/3 -right-48 w-[560px] h-[560px] rounded-full opacity-55 blur-3xl animate-ambient-drift transition-all duration-500"
            style={{
              background: "radial-gradient(circle, var(--blob-2, rgba(251,191,36,0.18)), transparent 65%)",
              animationDelay: "-6s",
            }}
          />
          {/* Bottom warm peach / deep amber */}
          <div
            className="absolute -bottom-32 left-1/4 w-[480px] h-[480px] rounded-full opacity-50 blur-3xl animate-ambient-drift transition-all duration-500"
            style={{
              background: "radial-gradient(circle, var(--blob-3, rgba(255,213,175,0.30)), transparent 65%)",
              animationDelay: "-12s",
            }}
          />
          {/* Very subtle paper-grain — multiplies into the ivory for warmth */}
          <div
            className="absolute inset-0 bg-noise transition-all duration-500"
            style={{
              opacity: "var(--noise-opacity, 0.03)",
              mixBlendMode: "var(--noise-blend, multiply)",
            }}
          />
        </div>

        {children}
      </body>
    </html>
  );
}
