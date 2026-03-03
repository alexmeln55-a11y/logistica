import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .select("id, created_at, trip_number, status, date, origin, destination")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getTrips]", error.message);
    return [];
  }

  return (data ?? []) as Trip[];
}

/**
 * Создаёт новый рейс. Готово к использованию в Server Action или Route Handler.
 */
export async function createTrip(
  input: CreateTripInput
): Promise<{ data: Trip | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Trip, error: null };
}
