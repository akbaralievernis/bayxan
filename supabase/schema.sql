-- Bayhan — Supabase schema reference.
-- Single source of truth for the DB shape the app expects. Apply via the
-- Supabase SQL editor or via `supabase db push` if you wire up the CLI later.
--
-- Idempotent: every CREATE uses IF NOT EXISTS / IF NOT EXISTS guards so you
-- can re-run it on an already-populated database.

------------------------------------------------------------------
-- 1. Staff profiles
------------------------------------------------------------------
create table if not exists public.staff_profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null,
  department   text,
  pin          text not null,                  -- 4-digit, hashed in production
  is_admin     boolean not null default false, -- gate for /admin surface
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_staff_profiles_pin on public.staff_profiles(pin);

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
-- 5. updated_at triggers (DRY: one function, applied to every table)
------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_set_updated_at_shifts     on public.shifts;
drop trigger if exists trg_set_updated_at_menu_items on public.menu_items;
drop trigger if exists trg_set_updated_at_bookings   on public.bookings;

create trigger trg_set_updated_at_shifts     before update on public.shifts     for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_menu_items before update on public.menu_items for each row execute function public.set_updated_at();
create trigger trg_set_updated_at_bookings   before update on public.bookings   for each row execute function public.set_updated_at();

------------------------------------------------------------------
-- 6. PIN verification RPC (used by staff + admin login)
------------------------------------------------------------------
-- Single-row return shape matches the app's expectations in lib/api/staff.js:
--   { ok, profile_id, profile_name, profile_role, profile_department, is_admin }
create or replace function public.verify_staff_pin(p_pin text)
returns table (
  ok                  boolean,
  profile_id          uuid,
  profile_name        text,
  profile_role        text,
  profile_department  text,
  is_admin            boolean
) language sql security definer set search_path = public as $$
  select
    true as ok,
    sp.id,
    sp.name,
    sp.role,
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
insert into public.staff_profiles (name, role, department, pin, is_admin)
select * from (values
  ('Байхан Асанов',   'Владелец',                 'admin',   '0000', true),
  ('Эльдар Бекбаев',  'Старший администратор',    'admin',   '9012', true),
  ('Айгуль Сатарова', 'Су-шеф',                   'kitchen', '5678', false),
  ('Нурлан Каримов',  'Повар',                    'kitchen', '1234', false)
) as v(name, role, department, pin, is_admin)
where not exists (select 1 from public.staff_profiles);

insert into public.menu_items (name, description, price, category, active)
select * from (values
  ('Бешбармак «Хан»',  'Томлёная конина и говядина, домашняя сочни-лапша, 12 ч бульон.', 1200, 'main',     true),
  ('Каурдак на углях', 'Молодая баранина в чугуне, прокопчённая саксаулом.',             950,  'main',     true),
  ('Айран-сорпа',      'Ферментированный айран, маринованные коренья, ягнёнок.',         680,  'drinks',   true),
  ('Курут-десерт',     'Десерт из выдержанного курута с инжирным сиропом.',              420,  'desserts', true)
) as v(name, description, price, category, active)
where not exists (select 1 from public.menu_items);
