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
  pin          text not null,                  -- 4-digit, hashed in production
  is_admin     boolean not null default false, -- gate for /admin surface
  active       boolean not null default true,
  hired_at     date default current_date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_staff_profiles_pin on public.staff_profiles(pin);
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
create or replace function public.verify_staff_pin(p_pin text)
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
  where sp.pin = p_pin
    and sp.active = true
  limit 1
$$;

------------------------------------------------------------------
-- 7. Row-Level Security
------------------------------------------------------------------
-- Public read on menu_items (so the marketing site works without auth).
alter table public.menu_items enable row level security;
drop policy if exists "public read active menu" on public.menu_items;
create policy "public read active menu" on public.menu_items
  for select using (active = true);

-- Bookings: anyone can insert (booking form), only authenticated reads.
-- In production, prefer a Postgres function with restricted columns.
alter table public.bookings enable row level security;
drop policy if exists "anon can create booking" on public.bookings;
create policy "anon can create booking" on public.bookings
  for insert with check (true);

-- Staff tables — admin/service-role only. Don't expose to anon clients.
alter table public.staff_profiles enable row level security;
alter table public.shifts         enable row level security;

------------------------------------------------------------------
-- 8. Seed data (only inserted if tables are empty)
------------------------------------------------------------------
insert into public.staff_profiles (name, role, title, department, pin, is_admin)
select * from (values
  ('Байхан Асанов',   'admin'::staff_role,   'Владелец',                  'admin',   '0000', true),
  ('Эльдар Бекбаев',  'manager'::staff_role, 'Старший администратор',     'admin',   '9012', true),
  ('Айгуль Сатарова', 'cook'::staff_role,    'Су-шеф',                    'kitchen', '5678', false),
  ('Нурлан Каримов',  'cook'::staff_role,    'Повар',                     'kitchen', '1234', false),
  ('Алия Жунушева',   'waiter'::staff_role,  'Старший официант',          'hall',    '2222', false),
  ('Тимур Абдылдаев', 'waiter'::staff_role,  'Официант',                  'hall',    '3333', false),
  ('Назгуль Орозова', 'cashier'::staff_role, 'Кассир',                    'hall',    '4444', false)
) as v(name, role, title, department, pin, is_admin)
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

insert into public.menu_items (name, description, price, category, active)
select * from (values
  ('Бешбармак «Хан»',  'Томлёная конина и говядина, домашняя сочни-лапша, 12 ч бульон.', 1200, 'main',     true),
  ('Каурдак на углях', 'Молодая баранина в чугуне, прокопчённая саксаулом.',             950,  'main',     true),
  ('Айран-сорпа',      'Ферментированный айран, маринованные коренья, ягнёнок.',         680,  'drinks',   true),
  ('Курут-десерт',     'Десерт из выдержанного курута с инжирным сиропом.',              420,  'desserts', true)
) as v(name, description, price, category, active)
where not exists (select 1 from public.menu_items);
