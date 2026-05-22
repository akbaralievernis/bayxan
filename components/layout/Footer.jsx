import Link from "next/link";
import { RESTAURANT, NAV_LINKS } from "@/lib/constants";
import { Instagram, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-stone-200/70 bg-white/40 backdrop-blur-md">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl tracking-widest text-stone-900 mb-2">
            {RESTAURANT.name}
            <span className="block text-stone-400 text-sm tracking-[0.4em] mt-1">
              {RESTAURANT.nameLocal}
            </span>
          </div>
          <p className="text-stone-600 text-sm max-w-xs leading-relaxed">
            Современный ресторан от {RESTAURANT.owner} — вкусы степи,
            поданные с точностью.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-stone-600 hover:text-amber-700 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">Контакты</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="inline-flex items-center gap-2"><Phone size={14} className="text-amber-600/70" /> {RESTAURANT.phone}</li>
            <li className="inline-flex items-center gap-2"><MapPin size={14} className="text-amber-600/70" /> {RESTAURANT.address}, {RESTAURANT.city}</li>
            <li className="inline-flex items-center gap-2"><Instagram size={14} className="text-amber-600/70" /> @bayhan.kg</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">Часы работы</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>Пн–Чт · 11:00 – 23:00</li>
            <li>Пт–Вс · 11:00 – 01:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200/70 py-5 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} {RESTAURANT.name}. Все права защищены.
      </div>
    </footer>
  );
}
