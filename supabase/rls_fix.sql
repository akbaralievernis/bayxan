-- Fix Row-Level Security policies that block the admin panel from reading data.
-- Safe to run multiple times — every policy is dropped and recreated.

-- 1. Bookings — anon could INSERT but nobody could SELECT/UPDATE.
--    That's why online bookings appeared "broken" in the admin UI: rows existed
--    in the database but the admin client returned an empty list.
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

-- 2. Staff profiles — RLS was enabled with NO policy, so listStaff() returned [].
--    Open it up to anon for now (the app currently uses the anon key everywhere).
--    Tighten later when a real auth layer is added.
alter table public.staff_profiles enable row level security;

drop policy if exists "anyone can read staff" on public.staff_profiles;
create policy "anyone can read staff" on public.staff_profiles
  for select using (true);

drop policy if exists "anyone can write staff" on public.staff_profiles;
create policy "anyone can write staff" on public.staff_profiles
  for all using (true) with check (true);

-- 3. Shifts — same story, RLS on with no policies.
alter table public.shifts enable row level security;

drop policy if exists "anyone can read shifts" on public.shifts;
create policy "anyone can read shifts" on public.shifts
  for select using (true);

drop policy if exists "anyone can write shifts" on public.shifts;
create policy "anyone can write shifts" on public.shifts
  for all using (true) with check (true);

-- 4. Tables / orders / order_items — RLS is currently OFF for these, and grants
--    already cover anon. Leave RLS off but make the intent explicit so future
--    edits don't accidentally lock the waiter/cashier portals out.
alter table public.tables      disable row level security;
alter table public.orders      disable row level security;
alter table public.order_items disable row level security;

-- 5. Menu items — the original policy was SELECT-only with `active=true`. This
--    broke admin CRUD ("Cannot coerce the result to a single JSON object" on
--    save) because INSERT/UPDATE/DELETE were silently blocked and the admin
--    listing also couldn't see hidden items. Open it up; the public site already
--    filters by `active` in the query itself.
alter table public.menu_items enable row level security;

drop policy if exists "public read active menu" on public.menu_items;
drop policy if exists "anyone can read menu" on public.menu_items;
create policy "anyone can read menu" on public.menu_items
  for select using (true);

drop policy if exists "anyone can write menu" on public.menu_items;
create policy "anyone can write menu" on public.menu_items
  for all using (true) with check (true);
