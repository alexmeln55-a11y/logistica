import { requireAdminAccess } from "@/lib/auth/current-user";
import { EmptyState } from "@/components/empty-state";

export default async function OrganizationPage() {
  await requireAdminAccess();

  return (
    <EmptyState
      title="Организация"
      description="Реквизиты, юридический адрес и контактные данные."
      actionLabel="Редактировать"
    />
  );
}
