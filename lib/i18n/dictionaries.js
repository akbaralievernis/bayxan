/**
 * Flat-key dictionary for RU + KY. Keys use dot-notation grouped by surface
 * (nav.*, hero.*, menu.*) so missing keys are easy to spot.
 *
 * KY translations are best-effort literary Kyrgyz — please have a native
 * speaker review before launch.
 */
export const SUPPORTED_LOCALES = ["ru", "ky"];
export const DEFAULT_LOCALE = "ru";

export const LOCALE_META = {
  ru: { label: "Русский", short: "RU", flag: "🇷🇺" },
  ky: { label: "Кыргызча", short: "KY", flag: "🇰🇬" },
};

export const dict = {
  ru: {
    // ── Navbar ─────────────────────────────────────────────────
    "nav.home": "Главная",
    "nav.menu": "Меню",
    "nav.booking": "Бронь",
    "nav.team": "Команда",
    "nav.book_cta": "Забронировать",
    "nav.cart_aria": "Открыть корзину",
    "nav.menu_aria": "Открыть меню",
    "nav.close_aria": "Закрыть меню",

    // ── Hero ───────────────────────────────────────────────────
    "hero.eyebrow": "Открыты в Оше",
    "hero.reviews": "4.9 · 1 240 отзывов",
    "hero.heading.l1": "Вкус, который",
    "hero.heading.l2": "помнит",
    "hero.heading.l3": "поколения.",
    "hero.tagline":
      "Древние рецепты степи в современной подаче. Каждое блюдо — это история, поданная с уважением к традиции. Открыты ежедневно, по предварительной брони.",
    "hero.cta.book": "Забронировать стол",
    "hero.cta.menu": "Посмотреть меню",
    "hero.scroll": "Вниз",
    "hero.stats.dishes_k": "12+",
    "hero.stats.dishes_l": "Авторских блюд",
    "hero.stats.years_k": "9",
    "hero.stats.years_l": "Лет мастерства",
    "hero.stats.vip_k": "VIP",
    "hero.stats.vip_l": "Кабины · терраса",

    // ── Philosophy ─────────────────────────────────────────────
    "philosophy.eyebrow": "Наследие",
    "philosophy.heading.p1": "Память степи —",
    "philosophy.heading.p2": "вкус новой эпохи.",
    "philosophy.body.p1":
      "Байхан — это диалог между традицией и временем. Мы берём то, что кочевники передавали из поколения в поколение: томление мяса на углях, ферментированные молочные ноты, дым саксаула — и переосмысляем это в современной подаче.",
    "philosophy.body.p2":
      "Здесь нет случайных блюд. Каждый рецепт прошёл проверку временем — и нашими шеф-поварами, которые довели его до ресторанной точности.",
    "philosophy.quote":
      "Огонь не помнит языков — он говорит со всеми. Мы лишь продолжаем этот разговор.",
    "philosophy.quote.author": "— Шеф-повар · Байхан",
    "philosophy.caption.live": "Открытый очаг",
    "philosophy.caption.zone": "Главный зал",

    // ── Footer ─────────────────────────────────────────────────
    "footer.tagline":
      "Кафе Байхан в Оше — вкусы степи, поданные с точностью.",
    "footer.navigation": "Навигация",
    "footer.contacts": "Контакты",
    "footer.hours": "Часы работы",
    "footer.hours.mon_thu": "Ежедневно · 09:00 — 24:00",
    "footer.hours.fri_sun": "Без выходных",
    "footer.copyright": "Все права защищены.",

    // ── Menu page ──────────────────────────────────────────────
    "menu.eyebrow": "· Меню ·",
    "menu.heading.l1": "Каждое блюдо —",
    "menu.heading.l2": "наш почерк.",
    "menu.tagline":
      "Двадцать одна позиция, отобранная шеф-командой Bayhan. Цены указаны в киргизских сомах (KGS).",
    "menu.loading": "Загрузка…",
    "menu.title_fallback": "Меню",

    // ── Booking page ───────────────────────────────────────────
    "booking.eyebrow": "· Бронирование ·",
    "booking.heading.l1": "Стол ждёт",
    "booking.heading.l2": "именно вас.",
    "booking.tagline":
      "Заполните форму — мы подтвердим бронь в течение нескольких минут. Можно добавить блюда из меню как предзаказ.",
    "booking.section.contact": "Контактные данные",
    "booking.section.when": "Дата · время · гости",
    "booking.section.zone": "Зона и повод",
    "booking.section.requests": "Особые пожелания",
    "booking.field.name": "Имя",
    "booking.field.phone": "Телефон",
    "booking.field.phone_hint": "Формат: +996 …",
    "booking.field.date": "Дата",
    "booking.field.time": "Время",
    "booking.field.guests": "Гостей",
    "booking.field.tabletype": "Тип стола",
    "booking.field.eventtype": "Тип мероприятия",
    "booking.field.requests": "Пожелания (аллергии, рассадка и т.д.)",
    "booking.submit.idle.plain": "Подтвердить бронирование",
    "booking.submit.idle.preorder": "Подтвердить бронь и предзаказ",
    "booking.submit.loading": "Подтверждаем бронь…",
    "booking.terms": "Нажимая «Подтвердить», вы соглашаетесь с условиями обслуживания.",
    "booking.error.generic": "Не удалось отправить бронь. Попробуйте ещё раз.",

    // ── Team page ──────────────────────────────────────────────
    "team.eyebrow": "· Команда ·",
    "team.heading.l1": "Наша",
    "team.heading.l2": "Команда.",
    "team.tagline":
      "Двадцать человек, у каждого своё дело. Шеф-команда, зал и бар работают как единый организм — это и есть Bayhan.",
    "team.careers.eyebrow": "· Открытые позиции ·",
    "team.careers.heading.l1": "Мы ищем тех,",
    "team.careers.heading.l2": "кто",
    "team.careers.heading.l3": "любит дело.",
    "team.careers.bullet1": "Стабильная зарплата + чаевые, выплачиваемые ежедневно.",
    "team.careers.bullet2": "Питание и форма за счёт ресторана.",
    "team.careers.bullet3": "Обучение у шеф-команды с опытом работы за рубежом.",
    "team.careers.bullet4": "Гибкий график, возможность роста до старших позиций.",

    // ── Order summary (booking right column) ───────────────────
    "order.empty.title": "Без предзаказа",
    "order.empty.body":
      "Вы можете добавить блюда из меню для предзаказа к вашему столу.",
    "order.empty.cta": "К меню",
    "order.header.title": "Предзаказ к столу",
    "order.footer.total": "Итого",

    // ── Achievements strip ─────────────────────────────────────
    "ach.years.k": "9",
    "ach.years.l": "Лет на сцене",
    "ach.dishes.k": "120+",
    "ach.dishes.l": "Авторских блюд",
    "ach.guests.k": "180k",
    "ach.guests.l": "Гостей за год",
    "ach.rating.k": "4.9",
    "ach.rating.l": "Средний рейтинг",

    // ── Signature dishes ───────────────────────────────────────
    "sig.eyebrow": "· Выбор шеф-повара ·",
    "sig.heading.l1": "Гастрономический",
    "sig.heading.l2": "почерк.",
    "sig.tagline":
      "Четыре блюда, ради которых сюда возвращаются. Каждое — диалог с памятью степи, переосмысленный на современной кухне.",
    "sig.cta": "Смотреть всё меню",
    "sig.d1.name": "Бешбармак «Хан»",
    "sig.d1.desc":
      "Томлёная конина и говядина, домашняя сочни-лапша, бульон на 12 часах.",
    "sig.d1.price": "1 200 с",
    "sig.d2.name": "Каурдак на углях",
    "sig.d2.desc":
      "Молодая баранина в чугуне, прокопчённая саксаулом — подача с домашним нааном.",
    "sig.d2.price": "950 с",
    "sig.d3.name": "Айран-сорпа",
    "sig.d3.desc":
      "Ферментированный домашний айран, маринованные коренья, ягнёнок холодного копчения.",
    "sig.d3.price": "680 с",
    "sig.d4.name": "Сладость «Курут»",
    "sig.d4.desc":
      "Десерт из выдержанного курута с инжирным сиропом и грецким орехом.",
    "sig.d4.price": "420 с",
    "sig.badge.hit": "Хит",
    "sig.badge.new": "Новое",
    "sig.badge.chef": "Выбор шефа",

    // ── Spaces (zones) ─────────────────────────────────────────
    "spaces.eyebrow": "· Залы и атмосфера ·",
    "spaces.heading.l1": "Каждый зал —",
    "spaces.heading.l2": "своя история.",
    "spaces.tagline":
      "Три пространства, три настроения. Выберите, в каком из них вас встретит огонь.",
    "spaces.s1.name": "Главный зал",
    "spaces.s1.desc":
      "Высокие потолки, открытый очаг и живой свет ламп — для ужинов, которые помнят долго.",
    "spaces.s1.cap": "40 мест",
    "spaces.s2.name": "Ханская ложа",
    "spaces.s2.desc":
      "Приватная VIP-кабина с собственным сомелье и закрытыми ширмами. Для важных встреч.",
    "spaces.s2.cap": "до 8 гостей",
    "spaces.s3.name": "Терраса",
    "spaces.s3.desc":
      "Открытая летняя зона с видом на город и дровяной мангал. Сезонное меню.",
    "spaces.s3.cap": "24 места",
    "spaces.cta": "Забронировать зал",

    // ── Testimonials marquee ───────────────────────────────────
    "test.eyebrow": "· Что говорят гости ·",
    "test.heading.l1": "Голоса,",
    "test.heading.l2": "которым верим.",
    "test.t1.quote":
      "Лучший бешбармак в Оше. Атмосфера — будто оказался в юрте у деда.",
    "test.t1.name": "Айгуль К.",
    "test.t1.role": "Гость · Ноябрь",
    "test.t2.quote":
      "Каждое блюдо — продуманная история. Сервис на уровне европейских ресторанов.",
    "test.t2.name": "Максим Д.",
    "test.t2.role": "Гость · Октябрь",
    "test.t3.quote":
      "Идеальное место для делового ужина. Тихая ложа, превосходное вино.",
    "test.t3.name": "Дамир С.",
    "test.t3.role": "Гость · Декабрь",
    "test.t4.quote":
      "Терраса летом — это магия. Огни города, мангал, свежий хлеб.",
    "test.t4.name": "Алия М.",
    "test.t4.role": "Гость · Август",
    "test.t5.quote":
      "Привожу сюда всех, кто впервые в Кыргызстане. Это лучшая визитка страны.",
    "test.t5.name": "Эрлан Т.",
    "test.t5.role": "Гость · Сентябрь",
    "test.t6.quote":
      "Десерт «Курут» — открытие года. Никогда не думала, что курут может быть таким нежным.",
    "test.t6.name": "Назгуль А.",
    "test.t6.role": "Гость · Июль",

    // ── Visit CTA (final block) ────────────────────────────────
    "visit.eyebrow": "· Приходите ·",
    "visit.heading.l1": "Стол ждёт",
    "visit.heading.l2": "вас сегодня.",
    "visit.tagline":
      "Бронируйте заранее — мы любим, когда нас ждут, и готовимся к каждому гостю.",
    "visit.address.title": "Адрес",
    "visit.address.body": "Кара-Суйская ул., 88/1",
    "visit.address.line2": "с. Кашгар-Кыштак, Ошская область",
    "visit.address.maps_cta": "Открыть в Google Картах",
    "visit.map.label": "Мы здесь",
    "visit.hours.title": "Часы работы",
    "visit.hours.body": "Ежедневно · 09:00 — 24:00",
    "visit.phone.title": "Телефон",
    "visit.phone.body": "+996 553 30-04-01",
    "visit.phone.alt":  "+996 999 15-05-02",
    "visit.cta": "Забронировать стол",
  },

  ky: {
    // ── Navbar ─────────────────────────────────────────────────
    "nav.home": "Башкы",
    "nav.menu": "Меню",
    "nav.booking": "Брондоо",
    "nav.team": "Жамаат",
    "nav.book_cta": "Брондоо",
    "nav.cart_aria": "Себетти ачуу",
    "nav.menu_aria": "Менюну ачуу",
    "nav.close_aria": "Жабуу",

    // ── Hero ───────────────────────────────────────────────────
    "hero.eyebrow": "Ошто ачылды",
    "hero.reviews": "4.9 · 1 240 пикир",
    "hero.heading.l1": "Муундардын",
    "hero.heading.l2": "эсинде калган",
    "hero.heading.l3": "даам.",
    "hero.tagline":
      "Талаанын байыркы рецепттери — заманбап подачада. Ар бир тамак — салт-санааны урматтап жасалган баян. Күн сайын ачыкпыз, алдын ала брондоо менен.",
    "hero.cta.book": "Стол брондоо",
    "hero.cta.menu": "Менюну көрүү",
    "hero.scroll": "Төмөн",
    "hero.stats.dishes_k": "12+",
    "hero.stats.dishes_l": "Авторлук тамактар",
    "hero.stats.years_k": "9",
    "hero.stats.years_l": "Жыл уста жолу",
    "hero.stats.vip_k": "VIP",
    "hero.stats.vip_l": "Кабиналар · терраса",

    // ── Philosophy ─────────────────────────────────────────────
    "philosophy.eyebrow": "Мурас",
    "philosophy.heading.p1": "Талаанын эси —",
    "philosophy.heading.p2": "жаңы доордун даамы.",
    "philosophy.body.p1":
      "Байхан — салт менен заман ортосундагы маек. Көчмөндөр муундан муунга өткөргөн нерсени — чокто бышырылган эт, ачыткылуу сүт ноталары, сексөөлдүн түтүнү — заманбап подачада кайра ойлоп чыгабыз.",
    "philosophy.body.p2":
      "Бул жерде кокусунан коюлган тамак жок. Ар бир рецепт убакыт сыноосунан өткөн — жана аны ресторандык тактыкка жеткирген биздин шеф-аш бышыруучулардан.",
    "philosophy.quote":
      "От тилдерди билбейт — ал баары менен сүйлөшөт. Биз болсо ушул маекти улантабыз.",
    "philosophy.quote.author": "— Шеф-аш бышыруучу · Байхан",
    "philosophy.caption.live": "Ачык очок",
    "philosophy.caption.zone": "Башкы зал",

    // ── Footer ─────────────────────────────────────────────────
    "footer.tagline":
      "Оштогу Кафе Байхан — талаанын даамдары, тактык менен сунушталат.",
    "footer.navigation": "Багыттоо",
    "footer.contacts": "Байланыш",
    "footer.hours": "Иш убактысы",
    "footer.hours.mon_thu": "Күн сайын · 09:00 — 24:00",
    "footer.hours.fri_sun": "Дем алыш жок",
    "footer.copyright": "Бардык укуктар корголгон.",

    // ── Menu page ──────────────────────────────────────────────
    "menu.eyebrow": "· Меню ·",
    "menu.heading.l1": "Ар бир тамак —",
    "menu.heading.l2": "биздин кол тамга.",
    "menu.tagline":
      "Bayhan шеф-командасы тандаган жыйырма бир позиция. Баалар кыргыз сомунда (KGS) көрсөтүлгөн.",
    "menu.loading": "Жүктөлүүдө…",
    "menu.title_fallback": "Меню",

    // ── Booking page ───────────────────────────────────────────
    "booking.eyebrow": "· Брондоо ·",
    "booking.heading.l1": "Стол",
    "booking.heading.l2": "сизди күтөт.",
    "booking.tagline":
      "Форманы толтуруңуз — биз бир нече мүнөттө бронуңузду тастыктайбыз. Менюдан тамактарды алдын ала тапшырыкка кошсо болот.",
    "booking.section.contact": "Байланыш маалыматы",
    "booking.section.when": "Күнү · убактысы · конокторду",
    "booking.section.zone": "Зона жана себеби",
    "booking.section.requests": "Атайын каалоолор",
    "booking.field.name": "Аты",
    "booking.field.phone": "Телефон",
    "booking.field.phone_hint": "Формат: +996 …",
    "booking.field.date": "Күнү",
    "booking.field.time": "Убактысы",
    "booking.field.guests": "Конокторду",
    "booking.field.tabletype": "Стол түрү",
    "booking.field.eventtype": "Иш-чара түрү",
    "booking.field.requests": "Каалоолор (аллергия, отургузуу ж.б.)",
    "booking.submit.idle.plain": "Бронду ырастоо",
    "booking.submit.idle.preorder": "Бронду жана тапшырыкты ырастоо",
    "booking.submit.loading": "Бронду ырастап жатабыз…",
    "booking.terms":
      "«Ырастоо» баскычын басуу менен сиз тейлөө шарттарын кабыл аласыз.",
    "booking.error.generic": "Бронду жөнөтүү ишке ашпады. Кайра аракет кылыңыз.",

    // ── Team page ──────────────────────────────────────────────
    "team.eyebrow": "· Жамаат ·",
    "team.heading.l1": "Биздин",
    "team.heading.l2": "Жамаат.",
    "team.tagline":
      "Жыйырма адам, ар биринин өз иши. Шеф-команда, зал жана бар бирдиктүү организм катары иштешет — бул Bayhan.",
    "team.careers.eyebrow": "· Ачык позициялар ·",
    "team.careers.heading.l1": "Биз ишин",
    "team.careers.heading.l2": "сүйгөндөрдү",
    "team.careers.heading.l3": "издейбиз.",
    "team.careers.bullet1": "Туруктуу маяна + чай акча, күнүмдүк төлөнөт.",
    "team.careers.bullet2": "Тамак-аш жана форма ресторандын эсебинен.",
    "team.careers.bullet3": "Чет элде иштеген шеф-командадан үйрөнүү.",
    "team.careers.bullet4": "Ийкемдүү график, жогорку позицияга чейин өсүү мүмкүнчүлүгү.",

    // ── Order summary ──────────────────────────────────────────
    "order.empty.title": "Алдын ала тапшырык жок",
    "order.empty.body":
      "Менюдан тамактарды столуңузга алдын ала тапшырык катары кошсоңуз болот.",
    "order.empty.cta": "Менюга",
    "order.header.title": "Столго алдын ала тапшырык",
    "order.footer.total": "Жыйынтыгы",

    // ── Achievements strip ─────────────────────────────────────
    "ach.years.k": "9",
    "ach.years.l": "Жыл сахнада",
    "ach.dishes.k": "120+",
    "ach.dishes.l": "Авторлук тамактар",
    "ach.guests.k": "180k",
    "ach.guests.l": "Жылдык конок",
    "ach.rating.k": "4.9",
    "ach.rating.l": "Орточо рейтинг",

    // ── Signature dishes ───────────────────────────────────────
    "sig.eyebrow": "· Шеф-аш бышыруучунун тандоосу ·",
    "sig.heading.l1": "Гастрономиялык",
    "sig.heading.l2": "кол тамга.",
    "sig.tagline":
      "Бул жакка кайра келүү үчүн төрт тамак. Ар бири — заманбап ашканада кайра ойлоп чыгылган талаа эси менен маек.",
    "sig.cta": "Бардык менюну көрүү",
    "sig.d1.name": "Бешбармак «Хан»",
    "sig.d1.desc":
      "Чокто бышырылган жылкы жана уй эти, үй жасаган сочни-лапша, 12 саат кайнаган сорпо.",
    "sig.d1.price": "1 200 с",
    "sig.d2.name": "Чокто куурдак",
    "sig.d2.desc":
      "Чоюнда жаш кой эти, сексөөл түтүнү менен — үй нааны менен сунушталат.",
    "sig.d2.price": "950 с",
    "sig.d3.name": "Айран-сорпо",
    "sig.d3.desc":
      "Үй айраны, маринаддалган тамырлар, муздак ысталган кой эти.",
    "sig.d3.price": "680 с",
    "sig.d4.name": "Курут таттуусу",
    "sig.d4.desc":
      "Эскитилген куруттан жасалган десерт, анжыр сиропу жана грек жаңгагы менен.",
    "sig.d4.price": "420 с",
    "sig.badge.hit": "Хит",
    "sig.badge.new": "Жаңы",
    "sig.badge.chef": "Шеф тандоосу",

    // ── Spaces (zones) ─────────────────────────────────────────
    "spaces.eyebrow": "· Залдар жана атмосфера ·",
    "spaces.heading.l1": "Ар бир зал —",
    "spaces.heading.l2": "өзүнүн баяны.",
    "spaces.tagline":
      "Үч мейкиндик, үч маанай. Сизди кайсы жерде от тосуп аларын тандаңыз.",
    "spaces.s1.name": "Башкы зал",
    "spaces.s1.desc":
      "Бийик шыптар, ачык очок жана лампалардын тирүү жарыгы — узакка эстелүүчү кечтер үчүн.",
    "spaces.s1.cap": "40 орун",
    "spaces.s2.name": "Хандын ложасы",
    "spaces.s2.desc":
      "Жекече VIP-кабина, өзүнчө сомелье жана жабылган ширмалар менен. Маанилүү жолугушуулар үчүн.",
    "spaces.s2.cap": "8 конокко чейин",
    "spaces.s3.name": "Терраса",
    "spaces.s3.desc":
      "Шаарга караган ачык жайкы аймак жана отунда жасалган мангал. Сезондук меню.",
    "spaces.s3.cap": "24 орун",
    "spaces.cta": "Залды брондоо",

    // ── Testimonials marquee ───────────────────────────────────
    "test.eyebrow": "· Конокторубуз эмне дейт ·",
    "test.heading.l1": "Биз ишенген",
    "test.heading.l2": "үндөр.",
    "test.t1.quote":
      "Оштогу эң мыкты бешбармак. Атмосферасы — атамдын боз үйүндө отургандай.",
    "test.t1.name": "Айгүл К.",
    "test.t1.role": "Конок · Ноябрь",
    "test.t2.quote":
      "Ар бир тамак — ойлонулган баян. Сервис европалык ресторандардын деңгээлинде.",
    "test.t2.name": "Максим Д.",
    "test.t2.role": "Конок · Октябрь",
    "test.t3.quote":
      "Иш кечеси үчүн идеалдуу жер. Тынч ложа, мыкты шарап.",
    "test.t3.name": "Дамир С.",
    "test.t3.role": "Конок · Декабрь",
    "test.t4.quote":
      "Жайкы терраса — бул сыйкыр. Шаардын оттору, мангал, жаңы нан.",
    "test.t4.name": "Алия М.",
    "test.t4.role": "Конок · Август",
    "test.t5.quote":
      "Кыргызстанга биринчи жолу келгендердин баарын ушул жакка алып келем. Бул өлкөнүн эң мыкты визиткасы.",
    "test.t5.name": "Эрлан Т.",
    "test.t5.role": "Конок · Сентябрь",
    "test.t6.quote":
      "«Курут» десерти — жылдын ачылышы. Курут мынчалык назик болот деп ойлогон эмесмин.",
    "test.t6.name": "Назгүл А.",
    "test.t6.role": "Конок · Июль",

    // ── Visit CTA (final block) ────────────────────────────────
    "visit.eyebrow": "· Келиңиз ·",
    "visit.heading.l1": "Стол",
    "visit.heading.l2": "сизди бүгүн күтөт.",
    "visit.tagline":
      "Алдын ала брондоп коюңуз — биз күтүүнү жакшы көрөбүз жана ар бир конокко даярданабыз.",
    "visit.address.title": "Дарек",
    "visit.address.body": "Кара-Суу көч., 88/1",
    "visit.address.line2": "Кашкар-Кыштак айылы, Ош облусу",
    "visit.address.maps_cta": "Google Карталардан ачуу",
    "visit.map.label": "Биз ушул жердебиз",
    "visit.hours.title": "Иш убактысы",
    "visit.hours.body": "Күн сайын · 09:00 — 24:00",
    "visit.phone.title": "Телефон",
    "visit.phone.body": "+996 553 30-04-01",
    "visit.phone.alt":  "+996 999 15-05-02",
    "visit.cta": "Стол брондоо",
  },
};

/** Safe lookup — returns the key itself if missing so dev sees holes. */
export function translate(locale, key) {
  return dict[locale]?.[key] ?? dict[DEFAULT_LOCALE]?.[key] ?? key;
}
