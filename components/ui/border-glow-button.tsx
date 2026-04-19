"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(alpha, 1).toFixed(3)})`;
}

function buildGlowVars(glowColors: string[], intensity: number): Record<string, string> {
  const vars: Record<string, string> = {};
  const opacities = [1, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  opacities.forEach((op, i) => {
    vars[`--glow-color${keys[i]}`] = hexToRgba(glowColors[0], op * intensity);
  });

  if (glowColors[1]) {
    opacities.forEach((op, i) => {
      vars[`--glow-color-b${keys[i]}`] = hexToRgba(glowColors[1], op * intensity);
    });
  }

  return vars;
}

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  glowColors?: string[];
  backgroundColor?: string;
  borderRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  /** Seconds per full orbit (default 3) */
  orbitDuration?: number;
};

type ButtonProps = BaseProps & { href?: undefined; onClick?: () => void } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "onClick">;
type AnchorProps = BaseProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;

type BorderGlowButtonProps = ButtonProps | AnchorProps;

export function BorderGlowButton({
  children,
  className,
  glowColors = ["#22D3EE"],
  backgroundColor = "#09090b",
  borderRadius = 999,
  glowIntensity = 1.3,
  coneSpread = 25,
  animated = false,
  orbitDuration = 3,
  ...rest
}: BorderGlowButtonProps) {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!animated || !elRef.current) return;
    const el = elRef.current;

    // Pin glow fully visible
    el.style.setProperty("--edge-proximity", "100");

    const degsPerMs = 360 / (orbitDuration * 1000);
    let angle = 0;
    let lastTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      angle = (angle + (now - lastTime) * degsPerMs) % 360;
      lastTime = now;
      el.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      el.style.removeProperty("--edge-proximity");
      el.style.removeProperty("--cursor-angle");
    };
  }, [animated, orbitDuration]);

  const glowVars = buildGlowVars(glowColors, glowIntensity);
  const sharedStyle = {
    "--card-bg": backgroundColor,
    "--border-radius": `${borderRadius}px`,
    "--cone-spread": coneSpread,
    ...glowVars,
  } as React.CSSProperties;

  const sharedProps = {
    ref: elRef as never,
    className: cn("border-glow-btn", className),
    style: sharedStyle,
  };

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <a href={href} {...anchorRest} {...sharedProps}>
        <span className="bgb-edge-light" />
        <span className="bgb-inner">{children}</span>
      </a>
    );
  }

  const { onClick, ...buttonRest } = rest as ButtonProps;
  return (
    <button onClick={onClick} {...buttonRest} {...sharedProps}>
      <span className="bgb-edge-light" />
      <span className="bgb-inner">{children}</span>
    </button>
  );
}
