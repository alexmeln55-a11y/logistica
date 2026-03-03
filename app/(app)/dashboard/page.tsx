import { EmptyState } from "@/components/empty-state";

export default function DashboardPage() {
  return (
    <EmptyState
      title="Дэшборд"
      description="Здесь будет общая статистика и ключевые метрики."
      actionLabel="Настроить"
    />
  );
}
