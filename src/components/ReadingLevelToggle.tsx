"use client";

import { motion } from "framer-motion";
import { useReadingLevel } from "./ReadingLevel";

/**
 * A big, friendly switch between "Little Reader" (kindergarten) and
 * "Big Reader" (enriched) text. Used in the header and the compare view.
 */
export function ReadingLevelToggle({ compact = false }: { compact?: boolean }) {
  const { level, setLevel } = useReadingLevel();

  const options: { key: "kinder" | "enriched"; label: string; emoji: string }[] = [
    { key: "kinder", label: "Little Reader", emoji: "🐣" },
    { key: "enriched", label: "Big Reader", emoji: "🦉" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Choose reading level"
      className={`relative inline-flex rounded-full bg-white p-1 shadow-card ring-1 ring-line ${
        compact ? "text-sm" : "text-base"
      }`}
    >
      {options.map((opt) => {
        const active = level === opt.key;
        return (
          <button
            key={opt.key}
            role="radio"
            aria-checked={active}
            onClick={() => setLevel(opt.key)}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-3 py-2 font-extrabold transition-colors sm:px-4 ${
              active ? "text-white" : "text-muted hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="reading-pill"
                className="absolute inset-0 -z-10 rounded-full bg-royal"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span aria-hidden>{opt.emoji}</span>
            <span className={compact ? "hidden sm:inline" : ""}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
