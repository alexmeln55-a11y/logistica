"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db/postgres";
import { requireAdminAccess } from "@/lib/auth/current-user";
import { canManageUsers, canChangeAccess, defaultPermissionsForLevel } from "@/lib/permissions";
import { createInvitation } from "@/lib/auth/invitations";
import { sendInviteEmail } from "@/lib/email/send-invite";
import type { UserRole, AccessLevel } from "@/lib/auth/types";

// ── Приглашение ────────────────────────────────────────────────

export async function inviteUser(formData: FormData) {
  const current = await requireAdminAccess();

  if (!canManageUsers(current)) {
    return { error: "Недостаточно прав для приглашения пользователей" };
  }

  const email = (formData.get("email") as string).trim().toLowerCase();
  const full_name = ((formData.get("full_name") as string) || "").trim() || null;
  const position = ((formData.get("position") as string) || "").trim() || null;
  const access_level = (formData.get("access_level") as AccessLevel) || "view_all";

  if (!email) return { error: "Email обязателен" };

  const validLevels: AccessLevel[] = ["full_access", "view_all", "custom"];
  if (!validLevels.includes(access_level)) {
    return { error: "Недопустимый уровень доступа" };
  }

  // full_access могут давать только owner
  if (access_level === "full_access" && current.role !== "owner") {
    return { error: "Только владелец может выдавать полный доступ" };
  }

  // Проверяем, не зарегистрирован ли уже такой email
  const { rows: existing } = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  if (existing.length > 0) {
    return { error: "Пользователь с таким email уже существует" };
  }

  try {
    const token = await createInvitation({
      invitedBy: current.id,
      email,
      fullName: full_name,
      position,
      accessLevel: access_level,
    });

    await sendInviteEmail(email, token, current.full_name);
  } catch (err) {
    console.error("[inviteUser]", err);
    return { error: "Не удалось отправить приглашение. Попробуйте позже." };
  }

  revalidatePath("/settings/users");
  return { success: true };
}

// ── Изменение уровня доступа ───────────────────────────────────

export async function updateAccessLevel(userId: string, accessLevel: AccessLevel) {
  const current = await requireAdminAccess();

  const { rows } = await pool.query<{ role: UserRole }>(
    `SELECT role FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const target = rows[0];
  if (!target) return { error: "Пользователь не найден" };

  if (!canChangeAccess(current, target.role)) {
    return { error: "Недостаточно прав для изменения доступа" };
  }

  if (current.id === userId) {
    return { error: "Нельзя изменить собственный уровень доступа" };
  }

  if (accessLevel === "full_access" && current.role !== "owner") {
    return { error: "Только владелец может выдавать полный доступ" };
  }

  const perms = defaultPermissionsForLevel(accessLevel);

  await pool.query(
    `UPDATE users
     SET access_level = $1, can_view_users = $2, can_manage_users = $3
     WHERE id = $4`,
    [accessLevel, perms.can_view_users, perms.can_manage_users, userId]
  );

  revalidatePath("/settings/users");
  return { success: true };
}

// ── Деактивация / активация ────────────────────────────────────

export async function deactivateUser(userId: string) {
  const current = await requireAdminAccess();

  if (current.id === userId) {
    return { error: "Нельзя деактивировать собственный аккаунт" };
  }

  const { rows } = await pool.query<{ role: UserRole }>(
    `SELECT role FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const target = rows[0];
  if (!target) return { error: "Пользователь не найден" };

  if (!canChangeAccess(current, target.role)) {
    return { error: "Недостаточно прав для деактивации" };
  }

  // Инвалидируем все сессии пользователя
  await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
  await pool.query(`UPDATE users SET is_active = false WHERE id = $1`, [userId]);

  revalidatePath("/settings/users");
  return { success: true };
}

export async function activateUser(userId: string) {
  const current = await requireAdminAccess();

  const { rows } = await pool.query<{ role: UserRole }>(
    `SELECT role FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const target = rows[0];
  if (!target) return { error: "Пользователь не найден" };

  if (!canChangeAccess(current, target.role)) {
    return { error: "Недостаточно прав" };
  }

  await pool.query(`UPDATE users SET is_active = true WHERE id = $1`, [userId]);

  revalidatePath("/settings/users");
  return { success: true };
}

// ── Изменение роли (owner/admin only) ─────────────────────────

export async function updateUserRole(userId: string, newRole: UserRole) {
  const current = await requireAdminAccess();

  const ALLOWED_ROLES: UserRole[] = ["owner", "admin", "manager"];
  if (!ALLOWED_ROLES.includes(newRole)) return { error: "Недопустимая роль" };

  if (current.id === userId) return { error: "Нельзя изменить собственную роль" };

  if (current.role === "admin" && (newRole === "owner" || newRole === "admin")) {
    return { error: "Недостаточно прав для назначения этой роли" };
  }

  const { rows } = await pool.query<{ role: UserRole }>(
    `SELECT role FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const target = rows[0];
  if (!target) return { error: "Пользователь не найден" };

  if (target.role === "owner" && current.role !== "owner") {
    return { error: "Нельзя изменить роль владельца" };
  }

  await pool.query(`UPDATE users SET role = $1 WHERE id = $2`, [newRole, userId]);

  revalidatePath("/settings/users");
  return { success: true };
}
