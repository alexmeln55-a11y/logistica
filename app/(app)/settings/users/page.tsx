import { requireRole } from "@/lib/supabase/profile";
import { EmptyState } from "@/components/empty-state";

export default async function UsersPage() {
  await requireRole("admin");

  return (
    <EmptyState
      title="Пользователи"
      description="Управление доступами, ролями и приглашениями."
      actionLabel="Пригласить"
    />
  );
}
