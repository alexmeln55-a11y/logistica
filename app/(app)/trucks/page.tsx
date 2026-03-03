import { EmptyState } from "@/components/empty-state";

export default function TrucksPage() {
  return (
    <EmptyState
      title="Транспортные средства"
      description="Парк ТС, техническое состояние и назначения."
      actionLabel="Добавить ТС"
    />
  );
}
