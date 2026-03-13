-- ============================================================
-- 005_users_invitations.sql
-- Новые поля в users + таблица приглашений
-- ============================================================

-- ── 1. Новые поля в public.users ──────────────────────────────

alter table public.users
  add column if not exists position         text        null,
  add column if not exists access_level     text        not null default 'view_all',
  add column if not exists can_view_users   boolean     not null default false,
  add column if not exists can_manage_users boolean     not null default false;

alter table public.users
  add constraint users_access_level_check
  check (access_level in ('full_access', 'view_all', 'custom'));

-- owner и admin получают full_access при наличии
update public.users
set access_level = 'full_access',
    can_view_users = true,
    can_manage_users = true
where role in ('owner', 'admin');

-- ── 2. Таблица user_invitations ────────────────────────────────

create table if not exists public.user_invitations (
  id            uuid        primary key default gen_random_uuid(),
  invited_by    uuid        not null references public.users(id) on delete cascade,
  email         text        not null,
  full_name     text        null,
  position      text        null,
  access_level  text        not null default 'view_all',
  token_hash    text        not null unique,
  expires_at    timestamptz not null,
  used_at       timestamptz null,
  created_at    timestamptz not null default now()
);

alter table public.user_invitations
  add constraint invitations_access_level_check
  check (access_level in ('full_access', 'view_all', 'custom'));

create index if not exists ui_token_hash_idx  on public.user_invitations (token_hash);
create index if not exists ui_email_idx       on public.user_invitations (email);
create index if not exists ui_invited_by_idx  on public.user_invitations (invited_by);
