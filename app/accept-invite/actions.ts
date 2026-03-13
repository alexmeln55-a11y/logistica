"use server";

import { pool } from "@/lib/db/postgres";
import { validateInviteToken, consumeInvitation } from "@/lib/auth/invitations";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { defaultPermissionsForLevel } from "@/lib/permissions";
import { redirect } from "next/navigation";
import type { AccessLevel } from "@/lib/auth/types";

export type ValidateResult =
  | { valid: true; email: string; fullName: string | null; position: string | null; accessLevel: AccessLevel }
  | { valid: false; error: "not_found" | "expired" | "already_used" | "email_taken" };

/**
 * Только валидирует токен — без сайд-эффектов.
 * Вызывается при первом рендере страницы.
 */
export async function validateInviteAction(token: string): Promise<ValidateResult> {
  if (!token) return { valid: false, error: "not_found" };

  const result = await validateInviteToken(token);
  if (!result.success) return { valid: false, error: result.error };

  const inv = result.invitation;
  return {
    valid: true,
    email: inv.email,
    fullName: inv.full_name,
    position: inv.position,
    accessLevel: inv.access_level,
  };
}

/**
 * Создаёт пользователя и сессию. Вызывается при сабмите формы.
 */
export async function acceptInviteAction(formData: FormData) {
  const token    = (formData.get("token") as string).trim();
  const password = (formData.get("password") as string);
  const confirm  = (formData.get("confirm") as string);

  if (!token) return { error: "Токен не найден" };
  if (!password || password.length < 8) {
    return { error: "Пароль должен содержать минимум 8 символов" };
  }
  if (password !== confirm) {
    return { error: "Пароли не совпадают" };
  }

  const result = await validateInviteToken(token);
  if (!result.success) {
    const msgs = {
      not_found:    "Приглашение не найдено или уже использовано",
      expired:      "Срок действия приглашения истёк",
      already_used: "Приглашение уже использовано",
      email_taken:  "Этот email уже зарегистрирован",
    };
    return { error: msgs[result.error] };
  }

  const inv = result.invitation;
  const passwordHash = await hashPassword(password);
  const perms = defaultPermissionsForLevel(inv.access_level);

  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO users
       (email, password_hash, full_name, position, role,
        access_level, can_view_users, can_manage_users,
        email_verified, email_verified_at, is_active)
     VALUES ($1, $2, $3, $4, 'manager', $5, $6, $7, true, now(), true)
     RETURNING id`,
    [
      inv.email,
      passwordHash,
      inv.full_name,
      inv.position,
      inv.access_level,
      perms.can_view_users,
      perms.can_manage_users,
    ]
  );

  const newUser = rows[0];

  await consumeInvitation(inv.id);
  await createSession(newUser.id);

  redirect("/dashboard");
}
