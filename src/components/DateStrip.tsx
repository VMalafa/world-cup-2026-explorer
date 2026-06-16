"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** One selectable day in the strip. */
export interface DayChip {
  /** YYYY-MM-DD. */
  date: string;
  /** How many matches are played that day. */
  count: number;
}

const WEEKDAY = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
const DAYNUM = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { day: "numeric" });
const FULL = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

/**
 * A horizontally scrollable row of match days, so a child can peek a few days
 * ahead (or back) and open any day's fixtures — not just the auto-featured one
 * (issue #31). The selected day is scrolled into view; "today" is marked.
 */
export function DateStrip({
  days,
  selected,
  todayKey,
  onSelect,
}: {
  days: DayChip[];
  selected: string | null;
  /** Local YYYY-MM-DD for "today", to mark and label it. */
  todayKey: string;
  onSelect: (date: string) => void;
}) {
  const reduce = useReducedMotion();
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  // Keep the chosen day visible as it changes (and on first paint).
  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selected, reduce]);

  if (days.length <= 1) return null;

  return (
    <nav aria-label="Match days" className="-mx-4 px-4">
      <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {days.map(({ date, count }) => {
          const isSelected = date === selected;
          const isToday = date === todayKey;
          return (
            <li key={date} className="snap-start">
              <button
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => onSelect(date)}
                aria-pressed={isSelected}
                aria-label={`${FULL(date)}${isToday ? " (today)" : ""}, ${count} ${
                  count === 1 ? "match" : "matches"
                }`}
                className={`flex w-[4.25rem] flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5 text-center transition-colors ${
                  isSelected
                    ? "bg-royal text-white shadow-pop"
                    : "bg-white text-ink ring-1 ring-line hover:ring-royal-200"
                } ${isToday && !isSelected ? "ring-2 ring-gold" : ""}`}
              >
                <span
                  className={`text-[0.65rem] font-extrabold uppercase tracking-wide ${
                    isSelected ? "text-white/80" : isToday ? "text-gold-700" : "text-muted"
                  }`}
                >
                  {isToday ? "Today" : WEEKDAY(date)}
                </span>
                <span className="text-xl font-extrabold leading-none tabular-nums">
                  {DAYNUM(date)}
                </span>
                <span
                  className={`mt-0.5 inline-flex h-1.5 items-center gap-0.5`}
                  aria-hidden
                >
                  {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-white/70" : "bg-royal-200"
                      }`}
                    />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
