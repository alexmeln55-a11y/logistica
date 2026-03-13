// ── Роли ──────────────────────────────────────────────────────

export type UserRole = "owner" | "admin" | "manager";

// ── Уровни доступа ─────────────────────────────────────────────

export type AccessLevel = "full_access" | "view_all" | "custom";

// ── Пользователь из БД ─────────────────────────────────────────

export interface DbUser {
  id: string;
  created_at: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  position: string | null;
  access_level: AccessLevel;
  can_view_users: boolean;
  can_manage_users: boolean;
}

// ── Пользователь, доступный в приложении (без hash) ────────────

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  position: string | null;
  access_level: AccessLevel;
  can_view_users: boolean;
  can_manage_users: boolean;
}

// ── Строка в таблице users для страницы управления ─────────────

export interface UserListRow {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  position: string | null;
  access_level: AccessLevel;
  is_active: boolean;
  email_verified: boolean;
  can_view_users: boolean;
  can_manage_users: boolean;
  created_at: string;
}
