import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SAVED_DIR = path.resolve(__dirname, "../Saved");

interface PlaceRow {
  name: string;
  note: string | null;
  google_maps_url: string | null;
  tags: string | null;
  comment: string | null;
  list_name: string;
}

async function main() {
  const files = fs.readdirSync(SAVED_DIR).filter((f) => f.endsWith(".csv"));
  let total = 0;

  // Truncate first so re-runs are clean
  const { error: truncateError } = await supabase.rpc("truncate_places");
  if (truncateError) {
    // Fallback: delete all rows
    await supabase.from("places").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  for (const file of files) {
    const listName = file.replace(/\.csv$/i, "").replace(/_/g, " ");
    const content = fs.readFileSync(path.join(SAVED_DIR, file), "utf-8");

    const records: Record<string, string>[] = parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    const rows: PlaceRow[] = records
      .filter((r) => r.Title?.trim())
      .map((r) => ({
        name: r.Title.trim(),
        note: r.Note?.trim() || null,
        google_maps_url: r.URL?.trim() || null,
        tags: r.Tags?.trim() || null,
        comment: r.Comment?.trim() || null,
        list_name: listName,
      }));

    if (rows.length === 0) continue;

    const { error } = await supabase.from("places").insert(rows);
    if (error) {
      console.error(`❌ ${file}: ${error.message}`);
    } else {
      console.log(`✓ ${listName}: ${rows.length} rows`);
      total += rows.length;
    }
  }

  console.log(`\nDone. ${total} total rows inserted across ${files.length} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
