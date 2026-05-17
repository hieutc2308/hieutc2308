import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PlaceSuggestion {
  name: string;
  list_name: string;
  note: string;
  google_maps_url: string;
}

export async function embedQuery(query: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: [query], model: "voyage-3-lite" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage API error: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

export async function getSuggestions(
  query: string,
  places: Array<{ name: string; list_name: string; note: string; google_maps_url: string }>
): Promise<PlaceSuggestion[]> {
  const placesText = places
    .map((p) => `Name: ${p.name} | List: ${p.list_name} | Note: ${p.note || ""}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: `You are Hieu's personal place recommender. Rules:
- Only recommend places from the provided list — never invent new ones
- NEVER modify, translate, or fabricate the note field. Copy it exactly as given, or use "" if empty
- The list_name often indicates the city or area (e.g. "Đà Lạt ăn gì" = Đà Lạt, "Lượn lờ Hà Nội" = Hanoi). Use this to determine location
- If the query mentions a specific location or district, only recommend places from matching lists. Do not recommend places from other cities
- Return ONLY a JSON array, no other text
- Format: [{"name":"...","list_name":"...","note":"...","google_maps_url":"..."}]`,
    messages: [
      {
        role: "user",
        content: `User request: "${query}"\n\nRelevant places:\n${placesText}\n\nReturn the top 3–5 most relevant as a JSON array.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No suggestions found. Please try a different query.");

  const suggestions = JSON.parse(jsonMatch[0]) as PlaceSuggestion[];

  // Always restore note and URL from source data — prevents hallucination
  return suggestions.map((s) => {
    const original = places.find((p) => p.name === s.name);
    return {
      ...s,
      note: original?.note || "",
      google_maps_url: original?.google_maps_url || s.google_maps_url || "",
    };
  });
}
