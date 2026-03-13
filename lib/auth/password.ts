import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Хэширует пароль перед сохранением в БД.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Проверяет пароль против сохранённого хэша.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
