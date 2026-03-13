import crypto from "crypto";
import { pool } from "@/lib/db/postgres";
import type { AccessLevel } from "@/lib/auth/types";

const INVITE_TTL_DAYS = 7;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashInviteToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface CreateInvitationInput {
  invitedBy: string;
  email: string;
  fullName: string | null;
  position: string | null;
  accessLevel: AccessLevel;
}

/**
 * Создаёт приглашение. Инвалидирует старые неиспользованные для этого email.
 * Возвращает сырой токен для вставки в ссылку.
 */
export async function createInvitation(
  input: CreateInvitationInput
): Promise<string> {
  const token = generateToken();
  const tokenHash = hashInviteToken(token);
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

  // Инвалидируем старые приглашения на этот email
  await pool.query(
    `UPDATE user_invitations
     SET    used_at = now()
     WHERE  email = $1 AND used_at IS NULL`,
    [input.email]
  );

  await pool.query(
    `INSERT INTO user_invitations
       (invited_by, email, full_name, position, access_level, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.invitedBy,
      input.email.toLowerCase(),
      input.fullName,
      input.position,
      input.accessLevel,
      tokenHash,
      expiresAt,
    ]
  );

  return token;
}

export interface InvitationRow {
  id: string;
  invited_by: string;
  email: string;
  full_name: string | null;
  position: string | null;
  access_level: AccessLevel;
  expires_at: Date;
  used_at: Date | null;
}

export type AcceptInviteResult =
  | { success: true; invitation: InvitationRow }
  | { success: false; error: "not_found" | "expired" | "already_used" | "email_taken" };

/**
 * Валидирует токен приглашения.
 * Не помечает использованным — это делается после создания пользователя.
 */
export async function validateInviteToken(
  token: string
): Promise<AcceptInviteResult> {
  const tokenHash = hashInviteToken(token);

  const { rows } = await pool.query<InvitationRow>(
    `SELECT id, invited_by, email, full_name, position, access_level, expires_at, used_at
     FROM   user_invitations
     WHERE  token_hash = $1
     LIMIT  1`,
    [tokenHash]
  );

  const inv = rows[0];
  if (!inv) return { success: false, error: "not_found" };
  if (inv.used_at) return { success: false, error: "already_used" };
  if (inv.expires_at < new Date()) return { success: false, error: "expired" };

  // Проверяем, не зарегистрирован ли уже такой email
  const { rows: existing } = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [inv.email]
  );
  if (existing.length > 0) return { success: false, error: "email_taken" };

  return { success: true, invitation: inv };
}

/**
 * Помечает приглашение использованным.
 */
export async function consumeInvitation(invitationId: string): Promise<void> {
  await pool.query(
    `UPDATE user_invitations SET used_at = now() WHERE id = $1`,
    [invitationId]
  );
}
