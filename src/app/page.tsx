"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFeatured, type Featured } from "@/lib/schedule";
import { ReadingLevelToggle } from "@/components/ReadingLevelToggle";
import { MatchDashboard } from "@/components/MatchDashboard";
import { MapExplorer } from "@/components/MapExplorer";
import { CompareView } from "@/components/CompareView";
import { PlayerStoryCards } from "@/components/PlayerStoryCards";
import { FunFactsCarousel } from "@/components/FunFactsCarousel";

type TabId = "today" | "map" | "compare" | "stories" | "facts";

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "today", label: "Today", emoji: "⚽" },
  { id: "map", label: "Map", emoji: "🗺️" },
  { id: "compare", label: "Compare", emoji: "🔍" },
  { id: "stories", label: "Heroes", emoji: "🌟" },
  { id: "facts", label: "Facts", emoji: "🤔" },
];

export default function Home() {
  const [tab, setTab] = useState<TabId>("today");
  const [featured, setFeatured] = useState<Featured | null>(null);

  // Work out the day/teams once on mount to theme the other sections.
  useEffect(() => {
    setFeatured(getFeatured(new Date()));
  }, []);

  const firstMatch = featured?.matches[0];
  const homeCode = firstMatch?.homeCode ?? "BRA";
  const awayCode = firstMatch?.awayCode ?? "FRA";
  const dayIndex = featured?.dayIndex ?? 0;

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-28 pt-4 sm:pb-10">
      {/* Header */}
      <header className="mb-4 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:justify-between">
        <h1 className="flex items-center gap-2 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="animate-float" aria-hidden>
            ⚽
          </span>
          <span>
            <span className="text-sky-600">World Cup</span>{" "}
            <span className="text-grass">Explorer</span>
          </span>
        </h1>
        <ReadingLevelToggle compact />
      </header>

      {/* Desktop / tablet tab bar */}
      <nav
        aria-label="Sections"
        className="mb-6 hidden flex-wrap justify-center gap-2 sm:flex"
      >
        {TABS.map((t) => (
          <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
        ))}
      </nav>

      {/* Active section */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "today" && <MatchDashboard />}
            {tab === "map" && <MapExplorer />}
            {tab === "compare" && (
              <CompareView defaultLeft={homeCode} defaultRight={awayCode} />
            )}
            {tab === "stories" && (
              <PlayerStoryCards homeCode={homeCode} awayCode={awayCode} />
            )}
            {tab === "facts" && <FunFactsCarousel dayIndex={dayIndex} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur sm:hidden"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-2xl px-2 py-1 text-xs font-extrabold transition-colors ${
              tab === t.id ? "bg-sky-100 text-sky-700" : "text-slate-500"
            }`}
          >
            <span className="text-2xl" aria-hidden>
              {t.emoji}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: { id: TabId; label: string; emoji: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative rounded-full px-5 py-2.5 text-lg font-extrabold transition-colors ${
        active ? "text-white" : "bg-white/70 text-slate-600 hover:text-slate-900"
      }`}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 -z-10 rounded-full bg-grass"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="mr-1.5" aria-hidden>
        {tab.emoji}
      </span>
      {tab.label}
    </button>
  );
}
