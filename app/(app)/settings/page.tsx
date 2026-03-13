import { requireAdminAccess } from "@/lib/auth/current-user";
import { EmptyState } from "@/components/empty-state";

export default async function SettingsPage() {
  await requireAdminAccess();

  return (
    <EmptyState
      title="Настройки"
      description="Управление организацией, пользователями и отделами."
      actionLabel="Открыть"
    />
  );
}
