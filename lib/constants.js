// Real-world location verified against the Google Maps listing for
// "Кафе Байхан". Coordinates pin the actual venue in с. Кашгар-Кыштак,
// Кара-Суйский район, Ошская область.
export const RESTAURANT = {
  name: "Bayhan",
  nameLocal: "Байхан",
  owner: "Bayhan Asanov",

  // Locality (used in marketing copy + structured data)
  city: "Osh",
  cityRu: "Ош",
  cityKy: "Ош",
  region: "Ошская область",
  regionKy: "Ош облусу",

  // Address — short form for chips/footer, long form for legal/contact
  address: "Кара-Суйская ул., 88/1",
  addressKy: "Кара-Суу көч., 88/1",
  addressFull: "Кара-Суйская ул., 88/1, с. Кашгар-Кыштак, Кара-Суйский район, Ошская область",
  addressFullKy: "Кара-Суу көч., 88/1, Кашкар-Кыштак айылы, Кара-Суу району, Ош облусу",

  // Phones — primary first, secondary as fallback
  phone:    "+996 553 30-04-01",
  phoneAlt: "+996 999 15-05-02",

  // Hours
  hoursRu: "Ежедневно · 09:00 — 24:00",
  hoursKy: "Күн сайын · 09:00 — 24:00",

  // Verified from https://maps.app.goo.gl/oBwssRJatnbPpwDY7
  geo: {
    lat: 40.6093468,
    lng: 72.8249193,
    placeId: "ChIJBeMbK0ip2zgRq7y7oIZJSV8",
    cid:     "0x38bda9482b1be305:0x5f494986a0bb3cab",
  },
  mapsUrl: "https://maps.app.goo.gl/oBwssRJatnbPpwDY7",
};

export const MENU_CATEGORIES = [
  { slug: "main", label: "Main Dishes", labelRu: "Горячее" },
  { slug: "seafood", label: "Seafood", labelRu: "Морепродукты" },
  { slug: "drinks", label: "Drinks", labelRu: "Напитки" },
  { slug: "pizza", label: "Pizza", labelRu: "Пицца" },
  { slug: "desserts", label: "Desserts", labelRu: "Десерты" },
  { slug: "sets", label: "Sushi & Rolls", labelRu: "Сеты" },
  { slug: "dairy", label: "Dairy", labelRu: "Молочное" },
  { slug: "kids", label: "Kids", labelRu: "Детское" },
  { slug: "burgers", label: "Burgers", labelRu: "Бургеры" },
];

export const TABLE_TYPES = [
  { id: "standard", label: "Standard", capacity: "2–4 guests" },
  { id: "vip", label: "VIP Cabin", capacity: "4–8 guests" },
  { id: "terrace", label: "Terrace", capacity: "2–6 guests" },
];

export const EVENT_TYPES = [
  { id: "casual", label: "Casual dining" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "business", label: "Business meeting" },
  { id: "corporate", label: "Corporate event" },
];

// Nav items reference i18n keys instead of hardcoded labels. Consumers call
// `useT()` and look up `t(link.labelKey)`.
export const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/menu", labelKey: "nav.menu" },
  { href: "/booking", labelKey: "nav.booking" },
  { href: "/team", labelKey: "nav.team" },
];
