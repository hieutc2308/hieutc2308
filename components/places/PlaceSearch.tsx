"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { ResultCarousel } from "./ResultCarousel";
import { PlaceSuggestion } from "./PlaceCard";

interface HistoryEntry {
  id: number;
  query: string;
  suggestions: PlaceSuggestion[];
}

export function PlaceSearch() {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSuggestions([]);
    setActiveHistoryId(null);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const results: PlaceSuggestion[] = data.suggestions || [];
      setSuggestions(results);
      setSearchCount((c) => c + 1);

      if (results.length > 0) {
        const id = Date.now();
        setActiveHistoryId(id);
        setHistory((prev) => {
          const filtered = prev.filter((h) => h.query !== query);
          return [{ id, query, suggestions: results }, ...filtered].slice(0, 8);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function restoreHistory(entry: HistoryEntry) {
    setSuggestions(entry.suggestions);
    setHasSearched(true);
    setError(null);
    setLoading(false);
    setActiveHistoryId(entry.id);
    setSearchCount((c) => c + 1);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <PromptBox
        onSubmit={handleSubmit}
        loading={loading}
        placeholder="Ask me anything..."
      />

      {/* History chips */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.6, 0, 0.25, 1] }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => restoreHistory(entry)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
                  activeHistoryId === entry.id
                    ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {entry.query.length > 32 ? entry.query.slice(0, 32) + "…" : entry.query}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ResultCarousel
        suggestions={suggestions}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        searchCount={searchCount}
      />
    </div>
  );
}
