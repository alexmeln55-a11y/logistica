import { pool } from "@/lib/db/postgres";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TripStatus = "planned" | "in_progress" | "completed" | "cancelled";

export interface Trip {
  id: string;
  created_at: string;
  trip_number: string;
  status: TripStatus;
  date: string | null;
  origin: string;
  destination: string;
}

export interface CreateTripInput {
  trip_number: string;
  status?: TripStatus;
  date?: string | null;
  origin: string;
  destination: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Возвращает список всех рейсов, отсортированных по дате создания (новые первые).
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const { rows } = await pool.query<Trip>(
      `SELECT id,
              created_at,
              trip_number,
              status,
              date::text        AS date,
              origin,
              destination
       FROM   trips
       ORDER  BY created_at DESC`
    );
    return rows;
  } catch (err) {
    console.error("[getTrips]", err);
    return [];
  }
}

/**
 * Создаёт новый рейс.
 */
export async function createTrip(
  input: CreateTripInput
): Promise<{ data: Trip | null; error: string | null }> {
  try {
    const { rows } = await pool.query<Trip>(
      `INSERT INTO trips (trip_number, status, date, origin, destination)
       VALUES             ($1,          $2,     $3,   $4,     $5)
       RETURNING id, created_at, trip_number, status, date::text AS date, origin, destination`,
      [
        input.trip_number,
        input.status ?? "planned",
        input.date ?? null,
        input.origin,
        input.destination,
      ]
    );
    return { data: rows[0], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[createTrip]", message);
    return { data: null, error: message };
  }
}
