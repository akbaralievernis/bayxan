export const RESTAURANT = {
  name: "Bayhan",
  nameLocal: "Байхан",
  owner: "Bayhan Asanov",
  city: "Bishkek",
  phone: "+996 700 000 000",
  address: "ул. Чуй, 142",
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

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Booking" },
  { href: "/team", label: "Team" },
];
