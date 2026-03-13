import crypto from "crypto";
import { cookies } from "next/headers";
import { pool } from "@/lib/db/postgres";
import type { CurrentUser, DbUser } from "@/lib/auth/types";

// ── Константы ──────────────────────────────────────────────────

const COOKIE_NAME = "session_token";
const SESSION_TTL_DAYS = 30;

// ── Token helpers ──────────────────────────────────────────────

/**
 * Генерирует случайный токен сессии (сырой, отдаётся клиенту в cookie).
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Хэширует токен для хранения в БД.
 * SHA-256 достаточно: токен длинный и случайный, bcrypt здесь избыточен.
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ── Session CRUD ───────────────────────────────────────────────

/**
 * Создаёт сессию в БД и записывает токен в cookie.
 * Вызывать после успешной проверки пароля.
 */
export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  await pool.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Возвращает CurrentUser по токену из cookie, или null.
 * Также проверяет, что сессия не истекла и пользователь активен.
 */
export async function getSessionUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);

  const { rows } = await pool.query<CurrentUser & Pick<DbUser, "is_active">>(
    `SELECT u.id, u.email, u.full_name, u.role, u.is_active,
            u.position, u.access_level, u.can_view_users, u.can_manage_users
     FROM   sessions s
     JOIN   users u ON u.id = s.user_id
     WHERE  s.token_hash = $1
       AND  s.expires_at > now()`,
    [tokenHash]
  );

  const user = rows[0];
  if (!user || !user.is_active) return null;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    position: user.position,
    access_level: user.access_level,
    can_view_users: user.can_view_users,
    can_manage_users: user.can_manage_users,
  };
}

/**
 * Удаляет сессию из БД и очищает cookie (logout).
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashToken(token);
    await pool.query(`DELETE FROM sessions WHERE token_hash = $1`, [tokenHash]);
    cookieStore.delete(COOKIE_NAME);
  }
}
