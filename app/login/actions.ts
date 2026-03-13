"use server";

import { redirect } from "next/navigation";
import { pool } from "@/lib/db/postgres";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { createVerificationToken } from "@/lib/auth/email-verification";
import { sendVerificationEmail } from "@/lib/email/send";
import type { DbUser } from "@/lib/auth/types";

export async function login(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  const { rows } = await pool.query<DbUser & { email_verified: boolean }>(
    `SELECT id, password_hash, is_active, email_verified
     FROM   users
     WHERE  email = $1
     LIMIT  1`,
    [email]
  );

  const user = rows[0];
  const INVALID = "Неверный email или пароль";

  // 1. Пользователь существует?
  if (!user) return { error: INVALID };

  // 2. Проверяем пароль до любых других проверок — защита от user enumeration
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return { error: INVALID };

  // 3. Активен?
  if (!user.is_active) return { error: "Учётная запись заблокирована" };

  // 4. Email подтверждён?
  if (!user.email_verified) {
    return { error: "Подтвердите email. Проверьте почту или запросите новое письмо." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const full_name = ((formData.get("full_name") as string) || "").trim() || null;

  if (!email || !password) {
    return { error: "Email и пароль обязательны" };
  }

  if (password.length < 8) {
    return { error: "Пароль должен быть не менее 8 символов" };
  }

  const { rows: existing } = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  if (existing.length > 0) {
    return { error: "Пользователь с таким email уже существует" };
  }

  // Первый пользователь — owner, остальные — manager
  const { rows: countRows } = await pool.query<{ count: string }>(
    `SELECT count(*)::text FROM users`
  );
  const role = parseInt(countRows[0].count, 10) === 0 ? "owner" : "manager";

  const password_hash = await hashPassword(password);

  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, full_name, role, email_verified)
     VALUES ($1, $2, $3, $4, false)
     RETURNING id`,
    [email, password_hash, full_name, role]
  );

  const user = rows[0];
  if (!user) return { error: "Не удалось создать пользователя" };

  // Отправляем письмо с подтверждением.
  // Если SMTP не настроен — удаляем пользователя и возвращаем ошибку,
  // чтобы нельзя было войти с неподтверждённым email.
  try {
    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(email, token);
  } catch (err) {
    console.error("[signUp] Ошибка отправки письма:", err);
    await pool.query(`DELETE FROM users WHERE id = $1`, [user.id]);
    return {
      error:
        "Не удалось отправить письмо с подтверждением. " +
        "Проверьте настройки SMTP или обратитесь к администратору.",
    };
  }

  return { confirm: true };
}

export async function resendVerification(formData: FormData) {
  const email = (formData.get("email") as string).trim().toLowerCase();

  const { rows } = await pool.query<{ id: string; email_verified: boolean }>(
    `SELECT id, email_verified FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );

  const user = rows[0];

  // Не сообщаем существует ли email — защита от enumeration
  if (!user || user.email_verified) {
    return { sent: true };
  }

  try {
    const token = await createVerificationToken(user.id);
    await sendVerificationEmail(email, token);
  } catch (err) {
    console.error("[resendVerification] Ошибка отправки письма:", err);
    return { error: "Не удалось отправить письмо. Попробуйте позже." };
  }

  return { sent: true };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
