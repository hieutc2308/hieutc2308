"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: SectionNavItem[];
}

export function SectionNav({ sections }: SectionNavProps) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        {
          rootMargin: "-40% 0px -55% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-5">
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        const isHovered = hovered === id;

        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3 group"
            aria-label={`Navigate to ${label}`}
          >
            {/* Label — always visible for active, visible on hover for others */}
            <AnimatePresence>
              {(isActive || isHovered) && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: [0.6, 0, 0.25, 1] }}
                  className={`text-sm font-semibold tracking-wide uppercase ${
                    isActive ? "text-zinc-100" : "text-zinc-400"
                  }`}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot + ring */}
            <div className="relative flex items-center justify-center w-7 h-7">
              {/* Outer ring */}
              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.div
                    key="ring"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute w-5 h-5 rounded-full border-2 ${
                      isActive ? "border-blue-500" : "border-zinc-500"
                    }`}
                  />
                )}
              </AnimatePresence>

              {/* Core dot */}
              <motion.div
                animate={{
                  width: isActive ? 12 : isHovered ? 9 : 7,
                  height: isActive ? 12 : isHovered ? 9 : 7,
                  backgroundColor: isActive
                    ? "#3B82F6"
                    : isHovered
                    ? "#71717a"
                    : "#52525b",
                }}
                transition={{ duration: 0.25, ease: [0.6, 0, 0.25, 1] }}
                className="rounded-full"
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
