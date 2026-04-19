"use client";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HyperTextParagraphProps {
  text: string;
  className?: string;
  /** Single words OR multi-word phrases, e.g. ["6+ years", "data models", "DAX", "Power BI"] */
  highlightWords?: string[];
  defaultColor?: string;
}

interface WordProps {
  children: string;
  wordIndex: number;
  isHovered: boolean;
  isDimmed: boolean;
  isHighlightable: boolean;
  defaultColor: string;
  onHoverStart: (idx: number) => void;
  onHoverEnd: () => void;
}

// forwardRef so the parent can read each word's DOM rect for pill positioning
const Word = React.memo(
  React.forwardRef<HTMLSpanElement, WordProps>(function Word(
    {
      children,
      wordIndex,
      isHovered,
      isDimmed,
      isHighlightable,
      defaultColor,
      onHoverStart,
      onHoverEnd,
    },
    ref
  ) {
    const handleMouseEnter = useCallback(() => {
      if (!isHighlightable) return;
      onHoverStart(wordIndex);
    }, [isHighlightable, onHoverStart, wordIndex]);

    const handleMouseLeave = useCallback(() => {
      if (!isHighlightable) return;
      onHoverEnd();
    }, [isHighlightable, onHoverEnd]);

    return (
      <motion.span
        ref={ref}
        className={cn(
          "relative inline-block font-mono font-medium whitespace-nowrap",
          isHighlightable ? "cursor-pointer" : "cursor-default"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovered ? 1.1 : 1,
          y: isHovered ? -4 : 0,
          opacity: isDimmed ? 0.3 : 1,
          filter: isDimmed ? "blur(2px)" : "blur(0px)",
          color: isHovered
            ? "#FFFFFF"
            : isHighlightable
            ? "#60A5FA"
            : defaultColor,
          zIndex: isHovered ? 20 : 1,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        <span className="relative z-10 px-1">{children}</span>

        {/* Corner accent dots */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-1 h-1 bg-blue-500 rounded-full z-20"
              />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-500 rounded-full z-20"
              />
            </>
          )}
        </AnimatePresence>
      </motion.span>
    );
  })
);

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------
interface Token {
  text: string;
  isHighlight: boolean;
}

function cleanWord(w: string) {
  return w.toLowerCase().replace(/[^a-z0-9+]/g, "");
}

function tokenize(text: string, highlightWords: string[]): Token[] {
  const words = text.split(" ");
  const phrases = [...highlightWords].sort(
    (a, b) => b.split(" ").length - a.split(" ").length
  );
  const tokens: Token[] = [];
  let i = 0;
  while (i < words.length) {
    let matched = false;
    for (const phrase of phrases) {
      const phraseWords = phrase.split(" ");
      const len = phraseWords.length;
      if (i + len > words.length) continue;
      const isMatch = phraseWords.every(
        (pw, j) => cleanWord(words[i + j]) === cleanWord(pw)
      );
      if (isMatch) {
        tokens.push({ text: words.slice(i, i + len).join(" "), isHighlight: true });
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: words[i], isHighlight: false });
      i++;
    }
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
interface PillPos {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function HyperTextParagraph({
  text,
  className,
  highlightWords = [],
  defaultColor = "#a1a1aa",
}: HyperTextParagraphProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pillPos, setPillPos] = useState<PillPos>({ left: 0, top: 0, width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  // Holds a ref to each rendered Word's DOM node
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Stable callback — reads the hovered word's rect and repositions the single pill
  const handleHoverStart = useCallback((idx: number) => {
    const el = tokenRefs.current[idx];
    const container = containerRef.current;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    // 8px padding on each side (matches -inset-2)
    setPillPos({
      left: elRect.left - cRect.left - 8,
      top: elRect.top - cRect.top - 8,
      width: elRect.width + 16,
      height: elRect.height + 16,
    });
    setHoveredIdx(idx);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredIdx(null);
  }, []);

  const tokens = tokenize(text, highlightWords);

  return (
    <div
      ref={containerRef}
      className={cn("relative leading-relaxed tracking-wide", className)}
    >
      {/*
        ONE pill lives here — never unmounts between word transitions,
        so there's no exit-then-enter flash. It just springs to the
        new position. AnimatePresence only handles the very first
        appear and final disappear.
      */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.span
            className="absolute rounded-lg bg-zinc-600/60 pointer-events-none"
            // On first mount: appear at the correct position (no slide from 0,0)
            initial={{ opacity: 0, ...pillPos }}
            // On update: spring to new position while staying visible
            animate={{ opacity: 1, ...pillPos }}
            // On final leave: just fade out, no slide
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.15, ease: "easeOut" },
              left:   { type: "spring", stiffness: 180, damping: 22 },
              top:    { type: "spring", stiffness: 180, damping: 22 },
              width:  { type: "spring", stiffness: 180, damping: 22 },
              height: { type: "spring", stiffness: 180, damping: 22 },
            }}
            style={{
              zIndex: 0,
              boxShadow: "0px 8px 20px -4px rgba(59, 130, 246, 0.25)",
            }}
          />
        )}
      </AnimatePresence>

      {tokens.map((token, i) => (
        <React.Fragment key={i}>
          <Word
            ref={(el) => {
              tokenRefs.current[i] = el;
            }}
            wordIndex={i}
            isHovered={hoveredIdx === i}
            isDimmed={hoveredIdx !== null && hoveredIdx !== i}
            isHighlightable={token.isHighlight}
            defaultColor={defaultColor}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          >
            {token.text}
          </Word>
          {i < tokens.length - 1 && (
            <span className="inline-block whitespace-pre"> </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
