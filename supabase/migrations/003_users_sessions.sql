-- ============================================================
-- 003_users_sessions.sql
-- Собственная auth-схема: users + sessions
-- ============================================================

-- ── 1. Таблица users ──────────────────────────────────────────
create table public.users (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  email         text        not null    unique,
  password_hash text        not null,
  full_name     text,
  role          text        not null    default 'manager',
  is_active     boolean     not null    default true
);

alter table public.users
  add constraint users_role_check
  check (role in ('owner', 'admin', 'manager'));

create index users_email_idx on public.users (email);

-- ── 2. Таблица sessions ───────────────────────────────────────
create table public.sessions (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null    default now(),
  user_id      uuid        not null    references public.users(id) on delete cascade,
  token_hash   text        not null    unique,
  expires_at   timestamptz not null
);

create index sessions_token_hash_idx on public.sessions (token_hash);
create index sessions_user_id_idx    on public.sessions (user_id);
create index sessions_expires_at_idx on public.sessions (expires_at);

-- ── 3. Автоудаление истёкших сессий (опционально, через pg_cron) ──
-- select cron.schedule('delete-expired-sessions', '0 * * * *',
--   $$delete from public.sessions where expires_at < now()$$);
