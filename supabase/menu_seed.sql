-- Standalone menu refresh. Safe to run multiple times.
--   • Adds image_url for the original 4 dishes (if missing)
--   • Replaces айран-сорпа image with a real ayran photo
--   • Realigns categories to the UI tabs ('national' / 'european' / 'fastfood' / 'drinks')
--   • Inserts ~25 additional dishes; duplicates by name are skipped

-- 1. Fix existing rows --------------------------------------------------------
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/1024px-Beshbarmak1.jpg'
  where name = 'Бешбармак «Хан»'  and (image_url is null or image_url = '');
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Kazakh_quwyrdaq.jpg/1024px-Kazakh_quwyrdaq.jpg'
  where name = 'Каурдак на углях' and (image_url is null or image_url = '');
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fresh_ayran.jpg/1024px-Fresh_ayran.jpg'
  where name = 'Айран-сорпа';
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Fromage_kyrghize.jpg/1024px-Fromage_kyrghize.jpg'
  where name = 'Курут-десерт'     and (image_url is null or image_url = '');

update public.menu_items
  set category = 'national'
  where name in ('Бешбармак «Хан»', 'Каурдак на углях', 'Айран-сорпа', 'Курут-десерт')
    and category in ('main', 'desserts', 'drinks');

-- 2. Insert the rest of the menu (only rows whose name is not already present) -
insert into public.menu_items (name, description, price, category, image_url, active)
select * from (values
  -- Национальные блюда
  ('Шорпо',                'Прозрачный наваристый бульон с бараниной, картофелем и зеленью.', 320,  'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Shorpo.jpg/1024px-Shorpo.jpg',                    true),
  ('Плов по-байхански',    'Длиннозёрный рис, томлёная баранина, сладкая морковь и нут.',     380,  'national', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80',              true),
  ('Манты (5 шт)',         'Сочные манты ручной лепки с рубленой бараниной и луком.',         320,  'national', 'https://images.unsplash.com/photo-1626100134240-83eb02f43e98?auto=format&fit=crop&w=900&q=80',              true),
  ('Лагман уйгурский',     'Лапша ручного вытягивания, говядина, болгарский перец, дайкон.',  340,  'national', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',              true),
  ('Самса с бараниной',    'Хрустящая слоёная самса из тандыра.',                             90,   'national', 'https://images.unsplash.com/photo-1601001815853-3835274403b3?auto=format&fit=crop&w=900&q=80',              true),
  ('Чучук',                'Конская колбаса домашнего копчения, тонкая нарезка.',             520,  'national', 'https://images.unsplash.com/photo-1601314002592-b8734bca6604?auto=format&fit=crop&w=900&q=80',              true),
  -- Европейская кухня
  ('Цезарь с курицей',     'Романо, гриль-курица, бекон, пармезан, фирменный соус.',          420,  'european', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80',              true),
  ('Паста Карбонара',      'Спагетти, гуанчиале, желток, пекорино — без сливок, как положено.', 460, 'european', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80',              true),
  ('Стейк Стриплойн',      'Австралийская говядина, прожарка по выбору, перечный соус.',      1350, 'european', 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80',              true),
  ('Рибай мраморный',      'Толстый край с мраморной прослойкой, сливочное масло с тимьяном.', 1600, 'european', 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',              true),
  ('Ризотто с белыми грибами', 'Карнароли, белые грибы, пармезан, трюфельное масло.',         520,  'european', 'https://images.unsplash.com/photo-1633964913849-96bb09cfdf1a?auto=format&fit=crop&w=900&q=80',              true),
  ('Том ям с креветками',  'Острый тайский суп на курином бульоне с лемонграссом и кокосом.', 480,  'european', 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=900&q=80',              true),
  -- Фаст-фуд
  ('Бургер Bayhan Signature', 'Двойная котлета смэш, чеддер, бекон, фирменный соус, бриошь.', 560,  'fastfood', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',              true),
  ('Чизбургер классический',  'Говяжья котлета, плавленый чеддер, маринованный огурец.',      380,  'fastfood', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80',              true),
  ('Пицца Маргарита',      'Тонкое тесто, томаты San Marzano, моцарелла фиор-ди-латте, базилик.', 480, 'fastfood', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80',              true),
  ('Пицца Пепперони',      'Острая пепперони, моцарелла, томатная база.',                     560,  'fastfood', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80',              true),
  ('Хот-дог Bayhan',       'Венская сосиска, бриошь, жареный лук, дижонский соус.',           240,  'fastfood', 'https://images.unsplash.com/photo-1612392061787-2d078b3e573e?auto=format&fit=crop&w=900&q=80',              true),
  ('Картофель фри',        'Хрустящий фри с морской солью, фирменный кетчуп.',                160,  'fastfood', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',              true),
  ('Шаурма по-байхански',  'Маринованная курица, лаваш-гриль, чесночный соус, овощи.',        280,  'fastfood', 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=900&q=80',              true),
  -- Напитки
  ('Кымыз',                'Кобылье молоко холодного брожения — традиционный напиток.',       200,  'drinks',   'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=900&q=80',              true),
  ('Максым',               'Освежающий напиток из талкана, лёгкая кислинка.',                 140,  'drinks',   'https://images.unsplash.com/photo-1620063633168-8014b1c45bd6?auto=format&fit=crop&w=900&q=80',              true),
  ('Лимонад облепиховый',  'Облепиха, мёд, имбирь, лайм. Подаётся охлаждённым.',              180,  'drinks',   'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80',              true),
  ('Эспрессо',             'Сезонная обжарка от локальной ростерии.',                         130,  'drinks',   'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80',              true),
  ('Капучино',             'Двойной эспрессо с шёлковой молочной пеной.',                     180,  'drinks',   'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80',              true),
  ('Морс брусничный',      'Домашний морс из дикой брусники, без сахара.',                    150,  'drinks',   'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',              true),
  ('Чай чёрный с чабрецом', 'Цейлонский чай с горным чабрецом, подача в чайнике.',            220,  'drinks',   'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80',              true)
) as v(name, description, price, category, image_url, active)
where not exists (select 1 from public.menu_items mi where mi.name = v.name);
