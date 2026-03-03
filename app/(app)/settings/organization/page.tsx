import { requireRole } from "@/lib/supabase/profile";
import { EmptyState } from "@/components/empty-state";

export default async function OrganizationPage() {
  await requireRole("admin");

  return (
    <EmptyState
      title="Организация"
      description="Реквизиты, юридический адрес и контактные данные."
      actionLabel="Редактировать"
    />
  );
}
