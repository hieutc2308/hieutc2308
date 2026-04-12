"use client";

import { motion } from "framer-motion";
import { PlaceCard, PlaceSuggestion } from "./PlaceCard";
import { Loader2 } from "lucide-react";

interface SuggestionListProps {
  suggestions: PlaceSuggestion[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export function SuggestionList({ suggestions, loading, error, hasSearched }: SuggestionListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-blue-400" />
        </motion.div>
        <p className="text-zinc-500 text-sm">Finding the best places for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="text-2xl">⚠️</div>
        <p className="text-zinc-400 text-center">{error}</p>
      </div>
    );
  }

  if (hasSearched && suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="text-2xl">🔍</div>
        <p className="text-zinc-400 text-center">
          No matching places found. Try a different query.
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-600 mb-4">
        {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""} from your saved places
      </p>
      {suggestions.map((suggestion, index) => (
        <PlaceCard key={`${suggestion.name}-${index}`} suggestion={suggestion} index={index} />
      ))}
    </div>
  );
}
