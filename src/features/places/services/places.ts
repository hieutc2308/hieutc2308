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

export async function searchPlacesByEmbedding(
  embedding: number[],
  topK = 30
): Promise<Place[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("match_places", {
    query_embedding: embedding,
    match_count: topK,
  });

  if (error) throw new Error(`Vector search failed: ${error.message}`);
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

const LOCATION_MAP: Array<{ keywords: string[]; pattern: string }> = [
  {
    keywords: [
      "hà nội", "hanoi", "ha noi",
      "cầu giấy", "hoàn kiếm", "đống đa", "hai bà trưng",
      "tây hồ", "thanh xuân", "long biên", "hoàng mai",
      "ba đình", "mỹ đình", "kim mã", "ngọc khánh",
      "hồ tây", "ho tay",
      "giảng võ", "trúc bạch", "kim liên", "ngã tư sở",
      "láng", "ngọc hà", "thành công", "ô chợ dừa",
      "khâm thiên", "bách khoa", "vạn phúc", "linh đàm",
      "trung hòa", "nhân chính", "định công", "yên hòa",
      "dịch vọng", "nghĩa tân", "quan hoa", "mai dịch",
      "cổ nhuế", "tây sơn", "thái hà", "chùa bộc",
      "hào nam", "văn chương", "lê duẩn", "xã đàn",
      "kim ngưu", "minh khai", "bạch mai", "phố huế",
      "hàng bông", "hàng gai", "hàng đào", "hàng ngang",
      "đinh tiên hoàng", "lý thường kiệt", "trần hưng đạo",
      "nguyễn chí thanh", "láng hạ", "đê la thành",
    ],
    pattern: "hà nội",
  },
  {
    keywords: ["đà lạt", "da lat", "dalat"],
    pattern: "đà lạt",
  },
  {
    keywords: ["hội an", "hoi an"],
    pattern: "hội an",
  },
  {
    keywords: ["đà nẵng", "da nang", "danang"],
    pattern: "đà nẵng",
  },
  {
    keywords: ["sài gòn", "saigon", "hcm", "hồ chí minh", "ho chi minh"],
    pattern: "sài gòn",
  },
  {
    keywords: ["hải phòng", "hai phong"],
    pattern: "hoa phượng",
  },
  {
    keywords: ["huế", "hue"],
    pattern: "huế",
  },
  {
    keywords: ["ninh bình", "ninh binh"],
    pattern: "ninh bình",
  },
  {
    keywords: ["sapa", "sa pa"],
    pattern: "sapa",
  },
  {
    keywords: ["quảng bình", "quang binh"],
    pattern: "quảng bình",
  },
];

export function detectLocationPattern(query: string): string | null {
  const lower = query.toLowerCase();
  for (const { keywords, pattern } of LOCATION_MAP) {
    if (keywords.some((k) => lower.includes(k))) return pattern;
  }
  return null;
}
