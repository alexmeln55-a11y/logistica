import { requireRole } from "@/lib/supabase/profile";
import { EmptyState } from "@/components/empty-state";

export default async function DepartmentsPage() {
  await requireRole("admin");

  return (
    <EmptyState
      title="Отделы компании"
      description="Структура компании, отделы и назначение руководителей."
      actionLabel="Создать отдел"
    />
  );
}
