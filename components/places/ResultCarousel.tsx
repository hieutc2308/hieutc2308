"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceSuggestion } from "./PlaceCard";


interface PlaceCardProps {
  position: number;
  place: PlaceSuggestion & { tempId: number };
  handleMove: (steps: number) => void;
  cardSize: number;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ position, place, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 rounded-2xl transition-all duration-500 ease-in-out",
        isCenter
          ? "bg-blue-600 text-white border-blue-500"
          : "bg-zinc-900 text-zinc-100 border-zinc-700 hover:border-blue-500/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(39,39,42,1)"
          : "0px 0px 0px 0px transparent",
        zIndex: isCenter ? 10 : 5 - Math.abs(position),
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "mb-4 w-10 h-10 rounded-lg flex items-center justify-center",
          isCenter
            ? "bg-white/20 border border-white/30"
            : "bg-blue-500/10 border border-blue-500/20"
        )}
      >
        <MapPin className={cn("w-5 h-5", isCenter ? "text-white" : "text-blue-400")} />
      </div>

      {/* Place name */}
      <h3 className={cn("text-base sm:text-lg font-semibold leading-snug mb-2", isCenter ? "text-white" : "text-zinc-100")}>
        {place.name}
      </h3>

      {/* Note */}
      {place.note && (
        <p className={cn("text-sm leading-relaxed line-clamp-3", isCenter ? "text-blue-100/80" : "text-zinc-400")}>
          {place.note}
        </p>
      )}

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            isCenter
              ? "bg-white/20 text-white/80"
              : "bg-zinc-800 text-zinc-400"
          )}
        >
          {place.list_name}
        </span>
        {place.google_maps_url && (
          <a
            href={place.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-200",
              isCenter
                ? "border-white/30 text-white/70 hover:text-white hover:border-white/60"
                : "border-zinc-700 text-zinc-500 hover:text-zinc-100 hover:border-zinc-500"
            )}
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

interface ResultCarouselProps {
  suggestions: PlaceSuggestion[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchCount: number;
}

export function ResultCarousel({ suggestions, loading, error, hasSearched, searchCount }: ResultCarouselProps) {
  const [cardSize, setCardSize] = useState(320);
  const [list, setList] = useState<Array<PlaceSuggestion & { tempId: number }>>([]);

  useEffect(() => {
    if (suggestions.length === 0) { setList([]); return; }
    // Always display an odd number of cards (max 5) for symmetric layout
    const target = suggestions.length % 2 === 0
      ? Math.min(suggestions.length - 1, 5)
      : Math.min(suggestions.length, 5);
    const count = target % 2 === 0 ? target - 1 : target;
    const padded: Array<PlaceSuggestion & { tempId: number }> = [];
    for (let i = 0; i < count; i++) {
      padded.push({ ...suggestions[i % suggestions.length], tempId: i });
    }
    setList(padded);
  }, [suggestions, searchCount]);

  useEffect(() => {
    const update = () => {
      setCardSize(window.matchMedia("(min-width: 640px)").matches ? 320 : 260);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  function handleMove(steps: number) {
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="w-7 h-7 text-blue-400" />
        </motion.div>
        <p className="text-zinc-500 text-sm">Finding the best places for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-2xl">⚠️</p>
        <p className="text-zinc-400 text-center text-sm">{error}</p>
      </div>
    );
  }

  if (hasSearched && suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-2xl">🔍</p>
        <p className="text-zinc-400 text-center text-sm">No matching places found. Try a different query.</p>
      </div>
    );
  }

  if (!hasSearched || list.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.6, 0, 0.25, 1] }}
        className="relative w-full"
        style={{ height: 500 }}
      >
        {list.map((place, index) => {
          const position = index - Math.floor(list.length / 2);
          return (
            <PlaceCard
              key={place.tempId}
              place={place}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        {/* Navigation */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => handleMove(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMove(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
