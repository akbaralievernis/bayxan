-- Bayhan — Supabase schema reference.
-- Single source of truth for the DB shape the app expects. Apply via the
-- Supabase SQL editor or via `supabase db push` if you wire up the CLI later.
--
-- Idempotent: every CREATE uses IF NOT EXISTS / IF NOT EXISTS guards so you
-- can re-run it on an already-populated database.
--
-- NOTE ON SCHEMA UPDATES:
-- If you previously ran an older version of this script, tables like `staff_profiles`
-- will already exist. In PostgreSQL, `CREATE TABLE IF NOT EXISTS` will NOT add new
-- columns (like `pin`) to an existing table. This results in "column does not exist" errors.
--
-- To resolve this:
-- 
-- Option A: If development data can be deleted (RECOMMENDED):
--   Run this in the SQL editor:
--     DROP TABLE IF EXISTS public.shifts, public.orders, public.order_items, public.staff_profiles CASCADE;
--   Then re-run this entire script.
--
-- Option B: If you must preserve existing data:
--   Run these migrations in the SQL editor to add the new columns:
--     ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS pin text;
--     UPDATE public.staff_profiles SET pin = '0000' WHERE pin IS NULL;
--     ALTER TABLE public.staff_profiles ALTER COLUMN pin SET NOT NULL;
--
--     ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS title text;
--     ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS department text;
--     ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
--     ALTER TABLE public.staff_profiles ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

------------------------------------------------------------------
-- 1. Staff profiles + role enum
------------------------------------------------------------------
-- staff_role drives which portal a user can access after PIN login:
--   admin    → /admin (full panel)
--   manager  → /admin (read-mostly subset)
--   waiter   → /waiter
--   cashier  → /cashier
--   kitchen  → /kitchen (future)
--   cook     → kitchen line crew (back-office only)
do $$ begin
  create type staff_role as enum ('admin','manager','waiter','cashier','kitchen','cook');
exception when duplicate_object then null; end $$;

create table if not exists public.staff_profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         staff_role not null default 'cook',
  -- Free-text role label kept for UI display; e.g. "Шеф-повар", "Старший официант"
  title        text,
  department   text,
  phone        text,
  avatar_url   text,
  login        text unique not null,
  password     text not null,
  is_admin     boolean not null default false, -- gate for /admin surface
  active       boolean not null default true,
  hired_at     date default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_staff_profiles_login on public.staff_profiles(login);
create index if not exists idx_staff_profiles_role on public.staff_profiles(role);

------------------------------------------------------------------
-- 2. Shifts (used by the staff exchange board)
------------------------------------------------------------------
do $$ begin
  create type shift_status as enum ('mine', 'offered', 'claimed');
exception when duplicate_object then null; end $$;

create table if not exists public.shifts (
  id           uuid primary key default gen_random_uuid(),
  staff_id     uuid references public.staff_profiles(id) on delete set null,
  date         date not null,
  start_time   time not null,
  end_time     time not null,
  status       shift_status not null default 'mine',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_shifts_staff on public.shifts(staff_id);
create index if not exists idx_shifts_status on public.shifts(status);
create index if not exists idx_shifts_date on public.shifts(date);

------------------------------------------------------------------
-- 3. Menu items
------------------------------------------------------------------
create table if not exists public.menu_items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  price         numeric(10, 2) not null check (price >= 0),
  category      text not null,
  image_url     text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_menu_items_category on public.menu_items(category);
create index if not exists idx_menu_items_active on public.menu_items(active);

------------------------------------------------------------------
-- 4. Bookings
------------------------------------------------------------------
do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null; end $$;

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  booking_id   text unique not null,           -- human-readable "BAY-4829"
  name         text not null,
  phone        text not null,
  date         date not null,
  time         time not null,
  guests       int not null check (guests > 0),
  table_type   text not null,
  event_type   text default 'casual',
  requests     text,
  pre_order    jsonb default '[]'::jsonb,
  total        numeric(10, 2) default 0,
  status       booking_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_bookings_date on public.bookings(date);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_booking_id on public.bookings(booking_id);

------------------------------------------------------------------
-- 4b. Tables (physical seats in the restaurant)
------------------------------------------------------------------
do $$ begin
  create type table_zone as enum ('main','vip','terrace');
exception when duplicate_object then null; end $$;

do $$ begin
  create type table_status as enum ('free','occupied','reserved','cleaning','closed');
exception when duplicate_object then null; end $$;

create table if not exists public.tables (
  id           uuid primary key default gen_random_uuid(),
  number       int unique not null,
  zone         table_zone not null default 'main',
  seats        int not null default 2 check (seats > 0),
  status       table_status not null default 'free',
  note         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_tables_status on public.tables(status);

------------------------------------------------------------------
-- 4c. Orders (active checks at a table — separate from `bookings`,
--     which represent reservations made before arrival)
------------------------------------------------------------------
do $$ begin
  create type order_status as enum ('open','preparing','served','paying','closed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cash','card','qr','transfer');
exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_code    text unique not null,   -- "ORD-4021" — human-friendly
  table_id      uuid references public.tables(id) on delete set null,
  table_number  int,                    -- denormalized for fast lookup
  waiter_id     uuid references public.staff_profiles(id) on delete set null,
  waiter_name   text,                   -- denormalized
  cashier_id    uuid references public.staff_profiles(id) on delete set null,
  status        order_status not null default 'open',
  guests        int default 1 check (guests > 0),
  total         numeric(10,2) not null default 0,
  notes         text,
  payment_method payment_method,
  opened_at     timestamptz not null default now(),
  closed_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_table on public.orders(table_id);
create index if not exists idx_orders_waiter on public.orders(waiter_id);
create index if not exists idx_orders_opened on public.orders(opened_at desc);

------------------------------------------------------------------
-- 4d. Order items (line items in an active order)
------------------------------------------------------------------
do $$ begin
  create type item_status as enum ('pending','preparing','ready','served','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  menu_item_id  uuid references public.menu_items(id) on delete set null,
  name          text not null,         -- denormalized
  price         numeric(10,2) not null,
  quantity      int not null default 1 check (quantity > 0),
  status        item_status not null default 'pending',
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

------------------------------------------------------------------
-- 4e. Order total recalculation trigger
------------------------------------------------------------------
create or replace function public.recalc_order_total()
returns trigger language plpgsql as $$
declare
  oid uuid := coalesce(new.order_id, old.order_id);
begin
  update public.orders
     set total = coalesce((
           select sum(price * quantity)
             from public.order_items
            where order_id = oid and status <> 'cancelled'
         ), 0),
         updated_at = now()
   where id = oid;
  return null;
end $$;

drop trigger if exists trg_recalc_order_total on public.order_items;
create trigger trg_recalc_order_total
  after insert or update or delete on public.order_items
  for each row execute function public.recalc_order_total();

------------------------------------------------------------------
-- 4f. Chat Messages
------------------------------------------------------------------
create table if not exists public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  thread_id    text not null,
  sender       text not null check (sender in ('guest', 'waiter', 'staff', 'admin')),
  body         text not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_chat_messages_thread_id on public.chat_messages(thread_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at);

------------------------------------------------------------------
-- 5. updated_at triggers (DRY: one function, applied to every table)
------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_set_updated_at_shifts         on public.shifts;
drop trigger if exists trg_set_updated_at_menu_items     on public.menu_items;
drop trigger if exists trg_set_updated_at_bookings       on public.bookings;
drop trigger if exists trg_set_updated_at_staff_profiles on public.staff_profiles;
drop trigger if exists trg_set_updated_at_tables         on public.tables;
drop trigger if exists trg_set_updated_at_orders         on public.orders;

create trigger trg_set_updated_at_shifts         before update on public.shifts         for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_menu_items     before update on public.menu_items     for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_bookings       before update on public.bookings       for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_staff_profiles before update on public.staff_profiles for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_tables         before update on public.tables         for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_orders         before update on public.orders         for each row execute function public.set_updated_at();

------------------------------------------------------------------
-- 6. PIN verification RPC (used by staff + admin login)
------------------------------------------------------------------
-- Single-row return shape matches the app's expectations in lib/api/staff.js:
--   { ok, profile_id, profile_name, profile_role, profile_department, is_admin }
drop function if exists public.verify_staff_pin(text);
drop function if exists public.verify_staff_credentials(text, text);
create or replace function public.verify_staff_credentials(p_login text, p_password text)
returns table (
  ok                  boolean,
  profile_id          uuid,
  profile_name        text,
  profile_role        text,
  profile_title       text,
  profile_department  text,
  is_admin            boolean
) language sql security definer set search_path = public as $$
  select
    true as ok,
    sp.id,
    sp.name,
    sp.role::text,
    coalesce(sp.title, sp.role::text) as profile_title,
    sp.department,
    sp.is_admin
  from public.staff_profiles sp
  where sp.login = p_login
    and sp.password = p_password
    and sp.active = true
  limit 1
$$;

------------------------------------------------------------------
-- 7. Row-Level Security
------------------------------------------------------------------
-- Menu items — anyone can read every row (the public site filters by `active`
-- in the query itself; admin needs to see hidden items too). Anon can also
-- INSERT/UPDATE/DELETE because the admin panel currently uses the anon key.
-- Tighten when a real auth layer arrives.
alter table public.menu_items enable row level security;

drop policy if exists "public read active menu" on public.menu_items;
drop policy if exists "anyone can read menu" on public.menu_items;
create policy "anyone can read menu" on public.menu_items
  for select using (true);

drop policy if exists "anyone can write menu" on public.menu_items;
create policy "anyone can write menu" on public.menu_items
  for all using (true) with check (true);

-- Bookings: anyone can insert (booking form) AND read/update — admin panel
-- uses the anon key today. In production, scope these to authenticated roles.
alter table public.bookings enable row level security;
drop policy if exists "anon can create booking" on public.bookings;
create policy "anon can create booking" on public.bookings
  for insert with check (true);
drop policy if exists "anyone can read bookings" on public.bookings;
create policy "anyone can read bookings" on public.bookings
  for select using (true);
drop policy if exists "anyone can update bookings" on public.bookings;
create policy "anyone can update bookings" on public.bookings
  for update using (true) with check (true);
drop policy if exists "anyone can delete bookings" on public.bookings;
create policy "anyone can delete bookings" on public.bookings
  for delete using (true);

-- Chat messages: anyone can insert and read for now
alter table public.chat_messages enable row level security;
drop policy if exists "anyone can manage chat_messages" on public.chat_messages;
create policy "anyone can manage chat_messages" on public.chat_messages
  for all using (true) with check (true);

-- Staff tables — open to anon for now (the app uses the anon key end-to-end).
-- Tighten when a real auth layer lands.
alter table public.staff_profiles enable row level security;
drop policy if exists "anyone can read staff" on public.staff_profiles;
create policy "anyone can read staff" on public.staff_profiles
  for select using (true);
drop policy if exists "anyone can write staff" on public.staff_profiles;
create policy "anyone can write staff" on public.staff_profiles
  for all using (true) with check (true);

alter table public.shifts enable row level security;
drop policy if exists "anyone can read shifts" on public.shifts;
create policy "anyone can read shifts" on public.shifts
  for select using (true);
drop policy if exists "anyone can write shifts" on public.shifts;
create policy "anyone can write shifts" on public.shifts
  for all using (true) with check (true);

-- Explicit Table Grants for robust anonymous/client execution
grant all privileges on table public.bookings to anon, authenticated, service_role;
grant all privileges on table public.chat_messages to anon, authenticated, service_role;
grant all privileges on table public.menu_items to anon, authenticated, service_role;
grant all privileges on table public.tables to anon, authenticated, service_role;
grant all privileges on table public.orders to anon, authenticated, service_role;
grant all privileges on table public.order_items to anon, authenticated, service_role;
grant all privileges on table public.staff_profiles to anon, authenticated, service_role;
grant all privileges on table public.shifts to anon, authenticated, service_role;

------------------------------------------------------------------
-- 8. Seed data (only inserted if tables are empty)
------------------------------------------------------------------
insert into public.staff_profiles (name, role, title, department, login, password, is_admin)
select * from (values
  ('Байхан Асанов',   'admin'::staff_role,   'Владелец',                  'admin',   'asanov',     '0000', true),
  ('Эльдар Бекбаев',  'manager'::staff_role, 'Старший администратор',     'admin',   'bekbaev',    '9012', true),
  ('Айгуль Сатарова', 'cook'::staff_role,    'Су-шеф',                    'kitchen', 'satarova',   '5678', false),
  ('Нурлан Каримов',  'cook'::staff_role,    'Повар',                     'kitchen', 'karimov',    '1234', false),
  ('Алия Жунушева',   'waiter'::staff_role,  'Старший официант',          'hall',    'zhunusheva', '2222', false),
  ('Тимур Абдылдаев', 'waiter'::staff_role,  'Официант',                  'hall',    'abdyldaev',  '3333', false),
  ('Назгуль Орозова', 'cashier'::staff_role, 'Кассир',                    'hall',    'orozova',    '4444', false)
) as v(name, role, title, department, login, password, is_admin)
where not exists (select 1 from public.staff_profiles);

-- Sample restaurant tables: 6 mains, 2 VIP, 4 terrace.
insert into public.tables (number, zone, seats, status)
select * from (values
  (1,  'main'::table_zone,    4, 'free'::table_status),
  (2,  'main'::table_zone,    4, 'free'::table_status),
  (3,  'main'::table_zone,    2, 'free'::table_status),
  (4,  'main'::table_zone,    2, 'free'::table_status),
  (5,  'main'::table_zone,    6, 'free'::table_status),
  (6,  'main'::table_zone,    4, 'free'::table_status),
  (7,  'vip'::table_zone,     8, 'free'::table_status),
  (8,  'vip'::table_zone,     6, 'free'::table_status),
  (9,  'terrace'::table_zone, 2, 'free'::table_status),
  (10, 'terrace'::table_zone, 4, 'free'::table_status),
  (11, 'terrace'::table_zone, 4, 'free'::table_status),
  (12, 'terrace'::table_zone, 6, 'free'::table_status)
) as v(number, zone, seats, status)
where not exists (select 1 from public.tables);

-- Categories used here ('national' / 'european' / 'fastfood' / 'drinks') match
-- the UI tabs in lib/mockData.js → CATEGORIES so the menu filter works.
insert into public.menu_items (name, description, price, category, image_url, active)
select * from (values
  -- Национальные блюда
  ('Бешбармак «Хан»',      'Томлёная конина и говядина, домашняя сочни-лапша, 12 ч бульон.', 1200, 'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/1024px-Beshbarmak1.jpg',          true),
  ('Каурдак на углях',     'Молодая баранина в чугуне, прокопчённая саксаулом.',             950,  'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Kazakh_quwyrdaq.jpg/1024px-Kazakh_quwyrdaq.jpg',   true),
  ('Айран-сорпа',          'Ферментированный айран, маринованные коренья, ягнёнок.',         680,  'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fresh_ayran.jpg/1024px-Fresh_ayran.jpg',          true),
  ('Курут-десерт',         'Десерт из выдержанного курута с инжирным сиропом.',              420,  'national', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Fromage_kyrghize.jpg/1024px-Fromage_kyrghize.jpg', true),
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

-- Backfill / fix existing rows (for installs seeded before image_url / before the
-- categories were aligned with the UI tabs). Updates touch only rows where the
-- value still needs fixing, so re-running is safe.
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Beshbarmak1.jpg/1024px-Beshbarmak1.jpg'          where name = 'Бешбармак «Хан»'  and (image_url is null or image_url = '');
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Kazakh_quwyrdaq.jpg/1024px-Kazakh_quwyrdaq.jpg'   where name = 'Каурдак на углях' and (image_url is null or image_url = '');
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Fresh_ayran.jpg/1024px-Fresh_ayran.jpg'           where name = 'Айран-сорпа';
update public.menu_items set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Fromage_kyrghize.jpg/1024px-Fromage_kyrghize.jpg' where name = 'Курут-десерт'     and (image_url is null or image_url = '');

update public.menu_items set category = 'national' where name in ('Бешбармак «Хан»', 'Каурдак на углях', 'Айран-сорпа', 'Курут-десерт') and category in ('main', 'desserts', 'drinks');
