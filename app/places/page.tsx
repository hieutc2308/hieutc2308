import { PlaceSearch } from "@/components/places/PlaceSearch";
import { MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "AI Place Suggester — Tran Chi Hieu",
  description:
    "Find the perfect place in Hanoi using natural language. Powered by Gemini AI and Hieu's Google Maps saved places.",
};

export default function PlacesPage() {
  return (
    <main className="relative min-h-screen py-24 px-6">
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            ← Back to portfolio
          </Link>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Find a Place
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mx-auto">
            Ask in any language. I&apos;ll search through my saved Google Maps places in Hanoi
            and find the best match using AI.
          </p>
        </div>

        {/* Search */}
        <PlaceSearch />

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-700 mt-12">
          Powered by Gemini 1.5 Flash · Places sourced from Google Maps saved lists
        </p>
      </div>
    </main>
  );
}
