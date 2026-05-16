"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

type UseInViewOptions = Parameters<typeof useInView>[1];

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
}

export function useRevealInView<T extends Element>(
  ref: RefObject<T | null>,
  options?: UseInViewOptions
) {
  const inView = useInView(ref, options);
  const [restoredInView, setRestoredInView] = useState(false);

  useEffect(() => {
    if (restoredInView || inView) return;

    let frame = 0;
    const timeouts: number[] = [];

    const checkRestoredPosition = () => {
      const element = ref.current;
      if (element && isInViewport(element)) {
        setRestoredInView(true);
      }
    };

    frame = window.requestAnimationFrame(checkRestoredPosition);
    [0, 100, 300, 700].forEach((delay) => {
      timeouts.push(window.setTimeout(checkRestoredPosition, delay));
    });
    window.addEventListener("pageshow", checkRestoredPosition);
    window.addEventListener("scroll", checkRestoredPosition, { passive: true });
    window.addEventListener("resize", checkRestoredPosition);

    return () => {
      window.cancelAnimationFrame(frame);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      window.removeEventListener("pageshow", checkRestoredPosition);
      window.removeEventListener("scroll", checkRestoredPosition);
      window.removeEventListener("resize", checkRestoredPosition);
    };
  }, [inView, restoredInView, ref]);

  return inView || restoredInView;
}
