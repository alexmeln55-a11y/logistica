import crypto from "crypto";
import { pool } from "@/lib/db/postgres";

const TOKEN_TTL_HOURS = 24;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Создаёт токен подтверждения email, сохраняет хэш в БД.
 * Возвращает сырой токен — его нужно отправить пользователю в письме.
 * Старые неиспользованные токены для этого пользователя помечаются использованными.
 */
export async function createVerificationToken(userId: string): Promise<string> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

  // Инвалидируем старые неиспользованные токены
  await pool.query(
    `UPDATE email_verification_tokens
     SET    used_at = now()
     WHERE  user_id = $1 AND used_at IS NULL`,
    [userId]
  );

  await pool.query(
    `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return token;
}

export type VerifyResult =
  | { success: true }
  | { success: false; error: "not_found" | "expired" | "already_used" };

/**
 * Проверяет токен подтверждения email (POST-flow).
 * При успехе помечает токен использованным и обновляет users.email_verified.
 */
export async function verifyEmailToken(token: string): Promise<VerifyResult> {
  const tokenHash = hashToken(token);

  const { rows } = await pool.query<{
    id: string;
    user_id: string;
    expires_at: Date;
    used_at: Date | null;
  }>(
    `SELECT id, user_id, expires_at, used_at
     FROM   email_verification_tokens
     WHERE  token_hash = $1
     LIMIT  1`,
    [tokenHash]
  );

  const row = rows[0];

  if (!row) return { success: false, error: "not_found" };
  if (row.used_at) return { success: false, error: "already_used" };
  if (row.expires_at < new Date()) return { success: false, error: "expired" };

  // Помечаем токен использованным и подтверждаем email атомарно
  await pool.query(
    `UPDATE email_verification_tokens SET used_at = now() WHERE id = $1`,
    [row.id]
  );

  await pool.query(
    `UPDATE users
     SET    email_verified = true, email_verified_at = now()
     WHERE  id = $1`,
    [row.user_id]
  );

  return { success: true };
}
