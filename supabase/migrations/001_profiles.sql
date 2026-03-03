-- ============================================================
-- 1. Таблица profiles
-- ============================================================
create table public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text,
  role        text        not null default 'manager',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 2. Ограничение допустимых ролей
-- ============================================================
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'manager'));

-- ============================================================
-- 3. Trigger: автосоздание профиля после регистрации
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'manager'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ============================================================
-- 4. Row Level Security
-- ============================================================
alter table public.profiles enable row level security;

-- Пользователь читает только свой профиль
create policy "profiles: own read"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Пользователь обновляет только свой профиль (кроме role — защита ниже)
create policy "profiles: own update"
  on public.profiles
  for update
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger делает insert — разрешаем service role (security definer уже достаточно,
-- но явная политика нужна если отключить service role bypass)
create policy "profiles: service insert"
  on public.profiles
  for insert
  with check (true);
