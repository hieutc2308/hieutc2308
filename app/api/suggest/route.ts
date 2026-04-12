import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getAllPlaces, normalizePlaces } from "@/lib/places";
import { getSuggestions } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Fetch all places from Supabase
    const rawPlaces = await getAllPlaces();

    if (rawPlaces.length === 0) {
      return NextResponse.json(
        { error: "No places data found. Please import your Google Maps places first." },
        { status: 404 }
      );
    }

    const places = normalizePlaces(rawPlaces);

    // Get AI suggestions from Gemini
    const suggestions = await getSuggestions(query.trim(), places);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggest API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
