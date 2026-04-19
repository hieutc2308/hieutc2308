import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { searchPlacesByEmbedding, normalizePlaces, detectLocationPattern } from "@/lib/places";
import { embedQuery, getSuggestions } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const embedding = await embedQuery(query.trim());
    const rawPlaces = await searchPlacesByEmbedding(embedding, 80);

    if (rawPlaces.length === 0) {
      return NextResponse.json(
        { error: "No places data found. Please import your Google Maps places first." },
        { status: 404 }
      );
    }

    const allPlaces = normalizePlaces(rawPlaces);
    const locationPattern = detectLocationPattern(query.trim());
    let places = allPlaces;
    if (locationPattern) {
      const filtered = allPlaces.filter((p) =>
        p.list_name.toLowerCase().includes(locationPattern)
      );
      if (filtered.length >= 3) places = filtered;
    }

    const suggestions = await getSuggestions(query.trim(), places);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggest API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
