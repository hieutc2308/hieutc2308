import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export interface PlaceSuggestion {
  name: string;
  list_name: string;
  note: string;
  google_maps_url: string;
  reason: string;
}

export async function getSuggestions(
  query: string,
  places: Array<{ name: string; list_name: string; note: string; google_maps_url: string }>
): Promise<PlaceSuggestion[]> {
  const placesText = places
    .map((p) => `Name: ${p.name} | List: ${p.list_name} | Note: ${p.note || "—"}`)
    .join("\n");

  const prompt = `You are Hieu's personal place recommender in Hanoi, Vietnam. He has saved these places in Google Maps:

${placesText}

User request: "${query}"

Return the top 3–5 most relevant places as a JSON array with this exact structure:
[{"name": "...", "list_name": "...", "note": "...", "google_maps_url": "...", "reason": "..."}]

Rules:
- Only recommend places from the list above
- The "reason" field should be 1–2 sentences explaining why this place fits the request
- Respond in the same language as the user's query
- Return ONLY the JSON array, no other text`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No JSON array found in Gemini response");
  }

  const suggestions = JSON.parse(jsonMatch[0]) as PlaceSuggestion[];

  // Enrich with google_maps_url from original places data
  return suggestions.map((s) => {
    const original = places.find((p) => p.name === s.name);
    return {
      ...s,
      google_maps_url: original?.google_maps_url || s.google_maps_url || "",
    };
  });
}
