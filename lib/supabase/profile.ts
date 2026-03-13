/**
 * Bridge-адаптер: перенаправляет старые импорты из lib/supabase/profile
 * на новый PostgreSQL auth-layer.
 *
 * Файл оставлен для совместимости. Не удалять до полного cleanup Supabase.
 */

export {
  getCurrentUser,
  requireUser,
  requireRole,
  requireAdminAccess,
} from "@/lib/auth/current-user";

export type { CurrentUser, UserRole } from "@/lib/auth/types";
