// Mock roster — replace with Supabase `staff` table later.
// `imagePlaceholder` may be a URL or null. StaffCard falls back to a
// deterministic HSL-gradient avatar with the person's initials.

export const STAFF = [
  {
    id: "st-azamat",
    name: "Азамат Кулов",
    role: "Шеф-повар",
    department: "kitchen",
    experience: "Опыт: 8 лет",
    shiftInfo: "График: 2/2, 11:00 — 00:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-aigul",
    name: "Айгуль Сатарова",
    role: "Су-шеф",
    department: "kitchen",
    experience: "Опыт: 5 лет",
    shiftInfo: "График: 5/2, 09:00 — 21:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-eldar",
    name: "Эльдар Бекбаев",
    role: "Старший администратор",
    department: "floor",
    experience: "Опыт: 10 лет",
    shiftInfo: "График: 5/2, 12:00 — 23:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-viktoria",
    name: "Виктория Петрова",
    role: "Сомелье",
    department: "floor",
    experience: "Опыт: 6 лет",
    shiftInfo: "График: 4/3, 17:00 — 01:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-bakyt",
    name: "Бакыт Турдиев",
    role: "Бариста",
    department: "bar",
    experience: "Опыт: 3 года",
    shiftInfo: "График: 2/2, 08:00 — 18:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-alina",
    name: "Алина Жунушалиева",
    role: "Официант",
    department: "floor",
    experience: "Опыт: 2 года",
    shiftInfo: "График: 2/2, 16:00 — 02:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-timur",
    name: "Тимур Касымов",
    role: "Бармен",
    department: "bar",
    experience: "Опыт: 4 года",
    shiftInfo: "График: 3/3, 18:00 — 03:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1582571767897-7cfeaa01da30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "st-zhanna",
    name: "Жанна Усенова",
    role: "Хостес",
    department: "floor",
    experience: "Опыт: 1 год",
    shiftInfo: "График: 5/2, 11:00 — 22:00",
    imagePlaceholder: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
];

export const DEPARTMENTS = [
  { id: "all",     label: "Вся команда" },
  { id: "kitchen", label: "Кухня" },
  { id: "floor",   label: "Зал" },
  { id: "bar",     label: "Бар" },
];

export const POSITION_OPTIONS = [
  { id: "cook",      label: "Повар" },
  { id: "waiter",    label: "Официант" },
  { id: "bartender", label: "Бармен" },
  { id: "hostess",   label: "Хостес" },
];
