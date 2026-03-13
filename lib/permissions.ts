import type { CurrentUser, AccessLevel } from "@/lib/auth/types";

/**
 * Может ли пользователь видеть список пользователей.
 */
export function canViewUsers(user: CurrentUser): boolean {
  if (user.role === "owner" || user.role === "admin") return true;
  return user.can_view_users;
}

/**
 * Может ли пользователь управлять пользователями (приглашать, деактивировать, менять доступ).
 */
export function canManageUsers(user: CurrentUser): boolean {
  if (user.role === "owner" || user.role === "admin") return true;
  return user.can_manage_users;
}

/**
 * Может ли текущий пользователь изменить доступ целевому пользователю.
 * owner — может всё.
 * admin — не может трогать owner и других admin.
 * остальные — только если есть can_manage_users.
 */
export function canChangeAccess(
  actor: CurrentUser,
  targetRole: string
): boolean {
  if (actor.role === "owner") return true;
  if (targetRole === "owner") return false;
  if (actor.role === "admin" && targetRole === "admin") return false;
  if (actor.role === "admin") return true;
  return actor.can_manage_users;
}

/**
 * Лейблы уровней доступа для UI.
 */
export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  full_access: "Полный доступ",
  view_all:    "Просмотр",
  custom:      "Настраиваемый",
};

/**
 * Дефолтные permission-флаги при создании пользователя с данным уровнем доступа.
 */
export function defaultPermissionsForLevel(level: AccessLevel): {
  can_view_users: boolean;
  can_manage_users: boolean;
} {
  switch (level) {
    case "full_access":
      return { can_view_users: true, can_manage_users: true };
    case "view_all":
      return { can_view_users: true, can_manage_users: false };
    case "custom":
      return { can_view_users: false, can_manage_users: false };
  }
}
