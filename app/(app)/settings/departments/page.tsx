import { requireAdminAccess } from "@/lib/auth/current-user";
import { EmptyState } from "@/components/empty-state";

export default async function DepartmentsPage() {
  await requireAdminAccess();

  return (
    <EmptyState
      title="Отделы компании"
      description="Структура компании, отделы и назначение руководителей."
      actionLabel="Создать отдел"
    />
  );
}
