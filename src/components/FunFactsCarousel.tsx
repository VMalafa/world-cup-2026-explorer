"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { factsForDay } from "@/data/funFacts";
import { useReadingLevel } from "./ReadingLevel";

const KIND_STYLE = {
  geo: { label: "Geography", className: "bg-cedar-100 text-cedar-700" },
  football: { label: "Football", className: "bg-royal-50 text-royal-700" },
} as const;

export function FunFactsCarousel({ dayIndex }: { dayIndex: number }) {
  const { pick } = useReadingLevel();
  const facts = useMemo(() => factsForDay(dayIndex, 8), [dayIndex]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // Reset when the day (and therefore the fact set) changes.
  useEffect(() => setI(0), [dayIndex]);

  // Gentle auto-advance.
  useEffect(() => {
    if (paused || facts.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % facts.length), 5000);
    return () => clearInterval(id);
  }, [paused, facts.length]);

  if (facts.length === 0) return null;
  const fact = facts[i];
  const kind = KIND_STYLE[fact.kind];

  const go = (dir: number) =>
    setI((p) => (p + dir + facts.length) % facts.length);

  return (
    <section aria-labelledby="facts-heading" className="text-center">
      <h2 id="facts-heading" className="mb-1 text-3xl font-extrabold sm:text-4xl">
        Did You Know? 🤔
      </h2>
      <p className="mb-5 text-lg font-semibold text-muted">
        A fresh mix of facts every match day.
      </p>

      <div
        className="relative mx-auto max-w-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous fact"
            className="kid-btn bg-white text-royal ring-1 ring-line !px-3 !py-3 outline-royal"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden />
          </button>

          <div className="relative min-h-[14rem] flex-1 sm:min-h-[13rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={fact.id}
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="kid-card flex h-full flex-col items-center justify-center gap-3 p-6 sm:p-8"
              >
                <span className="text-6xl" aria-hidden>
                  {fact.emoji}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${kind.className}`}
                >
                  {kind.label}
                </span>
                <p className="text-balance text-xl font-bold leading-snug text-ink sm:text-2xl">
                  {pick(fact.text)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next fact"
            className="kid-btn bg-white text-royal ring-1 ring-line !px-3 !py-3 outline-royal"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Choose a fact">
          {facts.map((f, idx) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={idx === i}
              aria-label={`Fact ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-3 rounded-full transition-all ${
                idx === i ? "w-8 bg-royal" : "w-3 bg-line hover:bg-royal-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
