"use client";

import { useState } from "react";
import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { SuggestionList } from "./SuggestionList";
import { PlaceSuggestion } from "./PlaceCard";

export function PlaceSearch() {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSuggestions([]);

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
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <PromptBox
        onSubmit={handleSubmit}
        loading={loading}
        placeholder="I want a quiet cafe to work from... or Tôi muốn ăn phở tối nay..."
      />
      <SuggestionList
        suggestions={suggestions}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
      />
    </div>
  );
}
