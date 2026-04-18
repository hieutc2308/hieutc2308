import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface PlaceSuggestion {
  name: string;
  list_name: string;
  note: string;
  google_maps_url: string;
  reason: string;
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
    .map((p) => `Name: ${p.name} | List: ${p.list_name} | Note: ${p.note || "—"}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: `You are Hieu's personal place recommender in Hanoi, Vietnam. Rules:
- Only recommend places from the provided list
- The "reason" field should be 1–2 sentences explaining why this place fits the request
- Respond in the same language as the user's query
- Return ONLY a JSON array, no other text
- Format: [{"name":"...","list_name":"...","note":"...","google_maps_url":"...","reason":"..."}]`,
    messages: [
      {
        role: "user",
        content: `User request: "${query}"\n\nRelevant places:\n${placesText}\n\nReturn the top 3–5 most relevant as a JSON array.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON array found in Claude response");

  const suggestions = JSON.parse(jsonMatch[0]) as PlaceSuggestion[];

  return suggestions.map((s) => {
    const original = places.find((p) => p.name === s.name);
    return { ...s, google_maps_url: original?.google_maps_url || s.google_maps_url || "" };
  });
}
