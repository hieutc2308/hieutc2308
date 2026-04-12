import { createServerClient } from "./supabase";

export interface Place {
  id: string;
  name: string;
  note: string | null;
  google_maps_url: string | null;
  tags: string | null;
  comment: string | null;
  list_name: string | null;
  created_at: string;
}

export async function getAllPlaces(): Promise<Place[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("list_name");

  if (error) {
    throw new Error(`Failed to fetch places: ${error.message}`);
  }

  return data || [];
}

export function normalizePlaces(places: Place[]) {
  return places.map((p) => ({
    name: p.name,
    list_name: p.list_name || "Saved",
    note: p.note || "",
    google_maps_url: p.google_maps_url || "",
  }));
}
