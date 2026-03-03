import { requireRole } from "@/lib/supabase/profile";
import { EmptyState } from "@/components/empty-state";

export default async function SettingsPage() {
  await requireRole("admin");

  return (
    <EmptyState
      title="Настройки"
      description="Управление организацией, пользователями и отделами."
      actionLabel="Открыть"
    />
  );
}
