import { EmptyState } from "@/components/empty-state";

export default function OrdersPage() {
  return (
    <EmptyState
      title="Заказы"
      description="Входящие заказы, статусы и история выполнения."
      actionLabel="Создать заказ"
    />
  );
}
