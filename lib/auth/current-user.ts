import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { CurrentUser, UserRole } from "@/lib/auth/types";

/**
 * Возвращает CurrentUser или null — без редиректа.
 * Использовать там, где нужна условная логика.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  return getSessionUser();
}

/**
 * Возвращает CurrentUser или редиректит на /login.
 * Использовать в защищённых Server Components / layouts.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Возвращает CurrentUser с нужной ролью.
 * Если не залогинен — редирект на /login.
 * Если роль не совпадает — редирект на /dashboard.
 */
export async function requireRole(role: UserRole): Promise<CurrentUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== role) redirect("/dashboard");
  return user;
}

/**
 * Проверяет, что пользователь имеет роль owner или admin.
 * Используется для защиты страниц настроек.
 * Если не залогинен — редирект на /login.
 * Если роль manager — редирект на /dashboard.
 */
export async function requireAdminAccess(): Promise<CurrentUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "owner" && user.role !== "admin") redirect("/dashboard");
  return user;
}
