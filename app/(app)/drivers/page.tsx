import { EmptyState } from "@/components/empty-state";

export default function DriversPage() {
  return (
    <EmptyState
      title="Водители"
      description="База водителей, лицензии и назначения на рейсы."
      actionLabel="Добавить водителя"
    />
  );
}
