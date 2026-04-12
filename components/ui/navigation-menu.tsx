"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
}

interface AnimatedNavProps {
  items: NavItem[];
}

const EXPAND_SCROLL_THRESHOLD = 80;

export function AnimatedNav({ items }: AnimatedNavProps) {
  const [isExpanded, setExpanded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={mounted ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
    >
      <motion.nav
        layout
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={handleNavClick}
        whileHover={!isExpanded ? { scale: 1.08 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        className={cn(
          "relative flex items-center overflow-hidden rounded-full border border-white/10 bg-zinc-900/80 shadow-lg backdrop-blur-sm h-12",
          isExpanded ? "px-2" : "w-12 justify-center cursor-pointer"
        )}
      >
        {/* Collapsed: menu icon */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              key="menu-icon"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-none"
            >
              <Menu className="h-5 w-5 text-zinc-100" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded: icon + links */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="nav-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.08 }}
              className="flex items-center gap-1"
            >
              {/* Navigation icon */}
              <div className="pl-3 pr-1 text-zinc-500">
                <Navigation className="h-4 w-4" />
              </div>

              {/* Links */}
              {items.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.12 + i * 0.06, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1 rounded-full hover:bg-white/5 whitespace-nowrap"
                >
                  {item.name}
                </motion.a>
              ))}

              {/* Trailing padding spacer */}
              <div className="w-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  );
}
