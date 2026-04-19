"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const stack = [
  // Microsoft
  { name: "Power BI",       icon: "/icons/tech/powerbi.svg",       color: "#F2C811", bg: "#F2C81115" },
  { name: "Azure",          icon: "/icons/tech/azure.svg",          color: "#0078D4", bg: "#0078D415" },
  { name: "Fabric",         icon: "/icons/tech/fabric.svg",         color: "#8B5CF6", bg: "#8B5CF615" },
  { name: "Power Automate", icon: "/icons/tech/powerautomate.svg",  color: "#0066FF", bg: "#0066FF15" },
  // Pipeline / Orchestration
  { name: "dbt",            icon: "/icons/tech/dbt.svg",            color: "#FF694B", bg: "#FF694B15" },
  { name: "Dagster",        icon: "/icons/tech/dagster.svg",        color: "#5C73DF", bg: "#5C73DF15" },
  { name: "Spark",          icon: "/icons/tech/spark.svg",          color: "#E25A1C", bg: "#E25A1C15" },
  // Database / Warehouse
  { name: "PostgreSQL",     icon: "/icons/tech/postgresql.svg",     color: "#336791", bg: "#33679115" },
  { name: "Snowflake",      icon: "/icons/tech/snowflake.svg",      color: "#29B5E8", bg: "#29B5E815" },
];

const SPEED = 60; // px/s
const GAP = 16;   // px between items
const SMOOTH_TAU = 0.18;

export function TechMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const seqRef       = useRef<HTMLUListElement>(null);
  const hoveredRef   = useRef(false);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copies, setCopies]     = useState(2);

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopies(Math.max(2, Math.ceil(cw / sw) + 2));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current)       ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [updateDimensions]);

  // Animation loop — hoveredRef is read inside tick so this effect never
  // restarts on hover, which would reset offset and cause a visible jump.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;

    let raf: number;
    let lastTs: number | null = null;
    let offset = 0;
    let velocity = SPEED;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min(Math.max(0, ts - lastTs) / 1000, 0.1); // cap dt to avoid jumps after tab switch
      lastTs = ts;

      const target = hoveredRef.current ? 0 : SPEED;
      velocity += (target - velocity) * (1 - Math.exp(-dt / SMOOTH_TAU));

      offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seqWidth]);

  return (
    <div
      className="relative py-8 border-y border-zinc-800/60 overflow-hidden"
      ref={containerRef}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#09090b] to-transparent" />
      <div className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#09090b] to-transparent" />

      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: "max-content" }}
      >
        {Array.from({ length: copies }, (_, ci) => (
          <ul
            key={ci}
            ref={ci === 0 ? seqRef : undefined}
            className="flex items-center"
            style={{ gap: GAP }}
            aria-hidden={ci > 0}
          >
            {stack.map(({ name, icon, color, bg }) => (
              <li
                key={name}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/60 select-none shrink-0 cursor-default"
                style={{ marginRight: GAP }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg, border: `1px solid ${color}25` }}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                    unoptimized
                  />
                </span>
                <span className="text-sm font-medium text-zinc-400 whitespace-nowrap">{name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
