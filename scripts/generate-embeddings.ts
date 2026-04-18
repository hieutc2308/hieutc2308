import { createClient } from "@supabase/supabase-js";
import { VoyageAIClient } from "voyageai";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const voyage = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY! });

const BATCH_SIZE = 128;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function embedWithRetry(texts: string[], retries = 5): Promise<number[][]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await voyage.embed({ input: texts, model: "voyage-3-lite" });
      return (result.data ?? []).map((d) => d.embedding as number[]);
    } catch (e: unknown) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 429 && attempt < retries - 1) {
        const wait = 22_000 * (attempt + 1);
        console.log(`  Rate limited — waiting ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        throw e;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

async function main() {
  const { data: places, error } = await supabase
    .from("places")
    .select("id, name, note, list_name, tags")
    .is("embedding", null);

  if (error) throw new Error(error.message);
  if (!places || places.length === 0) {
    console.log("All places already have embeddings.");
    return;
  }

  console.log(`Generating embeddings for ${places.length} places...`);

  for (let i = 0; i < places.length; i += BATCH_SIZE) {
    const batch = places.slice(i, i + BATCH_SIZE);
    const texts = batch.map((p) =>
      [p.name, p.list_name, p.note, p.tags].filter(Boolean).join(" | ")
    );

    const embeddings = await embedWithRetry(texts);

    for (let j = 0; j < batch.length; j++) {
      const { error: updateError } = await supabase
        .from("places")
        .update({ embedding: embeddings[j] })
        .eq("id", batch[j].id);
      if (updateError) console.error(`Failed to update ${batch[j].id}:`, updateError.message);
    }

    console.log(`✓ ${Math.min(i + BATCH_SIZE, places.length)}/${places.length}`);

    // Respect 3 RPM free tier — wait 22s between batches
    if (i + BATCH_SIZE < places.length) await sleep(22_000);
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
