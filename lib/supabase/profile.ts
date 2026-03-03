import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// ── Types ──────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "manager";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Возвращает текущего auth.User или null.
 * Безопасно: использует getUser() — проверяет токен на сервере Supabase.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

/**
 * Возвращает профиль текущего пользователя или null.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data as Profile;
}

/**
 * Возвращает текущего пользователя.
 * Если не залогинен — редиректит на /login.
 * Использовать в Server Components защищённых страниц.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Возвращает профиль текущего пользователя с нужной ролью.
 * Если не залогинен — редиректит на /login.
 * Если роль не совпадает — редиректит на /dashboard (403-like).
 *
 * @example
 * const profile = await requireRole("admin");
 */
export async function requireRole(role: UserRole): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (profile.role !== role) redirect("/dashboard");

  return profile;
}
