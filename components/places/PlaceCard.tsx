"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

export interface PlaceSuggestion {
  name: string;
  list_name: string;
  note: string;
  google_maps_url: string;
  reason: string;
}

export function PlaceCard({
  suggestion,
  index,
}: {
  suggestion: PlaceSuggestion;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.6, 0, 0.25, 1],
      }}
      className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-0.5">
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-100 truncate">{suggestion.name}</h3>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 mt-1">
              {suggestion.list_name}
            </span>
          </div>
        </div>

        {suggestion.google_maps_url && (
          <a
            href={suggestion.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-100 hover:border-zinc-500 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {suggestion.note && (
        <p className="text-sm text-zinc-500 mb-3 pl-11">{suggestion.note}</p>
      )}

      <div className="pl-11">
        <p className="text-sm text-zinc-400 italic leading-relaxed">
          &ldquo;{suggestion.reason}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
