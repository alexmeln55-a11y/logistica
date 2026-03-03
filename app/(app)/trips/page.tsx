import { getTrips } from "@/lib/db/trips";
import { EmptyState } from "@/components/empty-state";
import type { TripStatus } from "@/lib/db/trips";

const STATUS_LABEL: Record<TripStatus, string> = {
  planned:     "Запланирован",
  in_progress: "В пути",
  completed:   "Завершён",
  cancelled:   "Отменён",
};

const STATUS_CLASS: Record<TripStatus, string> = {
  planned:     "text-gray-500  bg-gray-100",
  in_progress: "text-blue-600  bg-blue-50",
  completed:   "text-green-600 bg-green-50",
  cancelled:   "text-red-500   bg-red-50",
};

export default async function TripsPage() {
  const trips = await getTrips();

  if (trips.length === 0) {
    return (
      <EmptyState
        title="Рейсы"
        description="Список рейсов, маршруты и статусы доставки."
        actionLabel="Создать рейс"
      />
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="bg-white rounded-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900">Рейсы</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{trips.length} записей</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left text-[11px] font-medium text-gray-400 px-5 py-3">№ рейса</th>
              <th className="text-left text-[11px] font-medium text-gray-400 px-5 py-3">Маршрут</th>
              <th className="text-left text-[11px] font-medium text-gray-400 px-5 py-3">Дата</th>
              <th className="text-left text-[11px] font-medium text-gray-400 px-5 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, i) => (
              <tr
                key={trip.id}
                className={`hover:bg-gray-50 transition-colors ${
                  i < trips.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <td className="px-5 py-3 text-[12px] font-mono text-gray-500">
                  {trip.trip_number}
                </td>
                <td className="px-5 py-3 text-[13px] font-medium text-gray-900">
                  {trip.origin} → {trip.destination}
                </td>
                <td className="px-5 py-3 text-[12px] text-gray-500">
                  {trip.date
                    ? new Date(trip.date).toLocaleDateString("ru-RU")
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${
                      STATUS_CLASS[trip.status]
                    }`}
                  >
                    {STATUS_LABEL[trip.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
