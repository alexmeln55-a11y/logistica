-- ============================================================
-- 004_email_verification.sql
-- Подтверждение email: поля в users + таблица токенов
-- ============================================================

alter table public.users
  add column if not exists email_verified    boolean     not null default false,
  add column if not exists email_verified_at timestamptz null;

create table if not exists public.email_verification_tokens (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  token_hash text        not null unique,
  expires_at timestamptz not null,
  used_at    timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists evt_token_hash_idx on public.email_verification_tokens (token_hash);
create index if not exists evt_user_id_idx    on public.email_verification_tokens (user_id);
