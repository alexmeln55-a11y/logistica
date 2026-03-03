import { EmptyState } from "@/components/empty-state";

export default function ExpensesPage() {
  return (
    <EmptyState
      title="Расходы"
      description="Учёт топлива, ремонтов и прочих затрат."
      actionLabel="Добавить расход"
    />
  );
}
