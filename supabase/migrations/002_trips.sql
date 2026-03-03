-- ============================================================
-- 1. Таблица trips
-- ============================================================
create table public.trips (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  trip_number  text        not null,
  status       text        not null    default 'planned',
  date         date,
  origin       text        not null,
  destination  text        not null
);

-- ============================================================
-- 2. Ограничение допустимых статусов
-- ============================================================
alter table public.trips
  add constraint trips_status_check
  check (status in ('planned', 'in_progress', 'completed', 'cancelled'));

-- ============================================================
-- 3. Row Level Security
-- ============================================================
alter table public.trips enable row level security;

-- Авторизованные пользователи читают все рейсы
create policy "trips: authenticated select"
  on public.trips
  for select
  to authenticated
  using (true);

-- Авторизованные пользователи создают рейсы
create policy "trips: authenticated insert"
  on public.trips
  for insert
  to authenticated
  with check (true);

-- Авторизованные пользователи обновляют рейсы
create policy "trips: authenticated update"
  on public.trips
  for update
  to authenticated
  using (true)
  with check (true);
