// Central source of truth for the menu while Supabase is being wired.
// Each item: { id, name, description, price, category, imagePlaceholder }
// `imagePlaceholder` can be any URL — DishCard falls back to a gradient + initial if it fails.

export const CATEGORIES = [
  { id: "all",       label: "Всё меню",            short: "Всё" },
  { id: "national",  label: "Национальные блюда", short: "Национальные" },
  { id: "european",  label: "Европейская кухня",  short: "Европейская" },
  { id: "fastfood",  label: "Фаст-фуд",            short: "Фаст-фуд" },
  { id: "drinks",    label: "Напитки",             short: "Напитки" },
];

export const MOCK_MENU = [
  // ───────────── Национальные блюда ─────────────
  {
    id: "nat-plov",
    name: "Плов по-байхански",
    description: "Длиннозёрный рис, томлёная баранина, сладкая морковь и нут — наша подача.",
    price: 320,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "nat-manti",
    name: "Манты (5 шт)",
    description: "Сочные манты ручной лепки с рубленой бараниной и луком.",
    price: 280,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1626100134240-83eb02f43e98?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "nat-besh",
    name: "Бешбармак",
    description: "Тонко раскатанное тесто, томлёное мясо и насыщенный бульон сорпо.",
    price: 650,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1547928576-b822bc410bdf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "nat-lagman",
    name: "Лагман уйгурский",
    description: "Лапша ручного вытягивания, говядина, болгарский перец, дайкон.",
    price: 290,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "nat-shorpo",
    name: "Шорпо",
    description: "Прозрачный наваристый бульон с бараниной, картофелем и зеленью.",
    price: 220,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "nat-samsa",
    name: "Самса с бараниной",
    description: "Хрустящая слоёная самса из тандыра.",
    price: 80,
    category: "national",
    imagePlaceholder: "https://images.unsplash.com/photo-1601001815853-3835274403b3?auto=format&fit=crop&w=900&q=80",
  },

  // ───────────── Европейская кухня ─────────────
  {
    id: "eu-caesar",
    name: "Цезарь с курицей",
    description: "Романо, гриль-курица, бекон, пармезан, фирменный соус.",
    price: 380,
    category: "european",
    imagePlaceholder: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "eu-carbonara",
    name: "Паста Карбонара",
    description: "Спагетти, гуанчиале, желток, пекорино — без сливок, как положено.",
    price: 420,
    category: "european",
    imagePlaceholder: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "eu-steak",
    name: "Стейк Стриплойн",
    description: "Австралийская говядина, прожарка по выбору, перечный соус.",
    price: 1200,
    category: "european",
    imagePlaceholder: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "eu-ribeye",
    name: "Рибай мраморный",
    description: "Толстый край с мраморной прослойкой, сливочное масло с тимьяном.",
    price: 1450,
    category: "european",
    imagePlaceholder: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "eu-risotto",
    name: "Ризотто с белыми грибами",
    description: "Карнароли, белые грибы, пармезан, трюфельное масло.",
    price: 480,
    category: "european",
    imagePlaceholder: "https://images.unsplash.com/photo-1633964913849-96bb09cfdf1a?auto=format&fit=crop&w=900&q=80",
  },

  // ───────────── Фаст-фуд ─────────────
  {
    id: "ff-bayhan",
    name: "Бургер Bayhan Signature",
    description: "Двойная котлета смэш, чеддер, бекон, фирменный соус, бриошь.",
    price: 520,
    category: "fastfood",
    imagePlaceholder: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ff-cheese",
    name: "Чизбургер классический",
    description: "Говяжья котлета, плавленый чеддер, маринованный огурец.",
    price: 350,
    category: "fastfood",
    imagePlaceholder: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ff-margherita",
    name: "Пицца Маргарита",
    description: "Тонкое тесто, томаты San Marzano, моцарелла фиор-ди-латте, базилик.",
    price: 450,
    category: "fastfood",
    imagePlaceholder: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ff-pepperoni",
    name: "Пицца Пепперони",
    description: "Острая пепперони, моцарелла, томатная база.",
    price: 520,
    category: "fastfood",
    imagePlaceholder: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "ff-hotdog",
    name: "Хот-дог Bayhan",
    description: "Венская сосиска, бриошь, жареный лук, дижонский соус.",
    price: 220,
    category: "fastfood",
    imagePlaceholder: "https://images.unsplash.com/photo-1612392061787-2d078b3e573e?auto=format&fit=crop&w=900&q=80",
  },

  // ───────────── Напитки ─────────────
  {
    id: "dr-kymyz",
    name: "Кымыз",
    description: "Кобылье молоко холодного брожения — традиционный напиток.",
    price: 180,
    category: "drinks",
    imagePlaceholder: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dr-maksym",
    name: "Максым",
    description: "Освежающий напиток из талкана, лёгкая кислинка.",
    price: 120,
    category: "drinks",
    imagePlaceholder: "https://images.unsplash.com/photo-1620063633168-8014b1c45bd6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dr-lemonade",
    name: "Лимонад облепиховый",
    description: "Облепиха, мёд, имбирь, лайм. Подаётся охлаждённым.",
    price: 150,
    category: "drinks",
    imagePlaceholder: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dr-espresso",
    name: "Эспрессо",
    description: "Сезонная обжарка от локальной ростерии.",
    price: 110,
    category: "drinks",
    imagePlaceholder: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dr-mors",
    name: "Морс брусничный",
    description: "Домашний морс из дикой брусники, без сахара.",
    price: 130,
    category: "drinks",
    imagePlaceholder: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
  },
];
