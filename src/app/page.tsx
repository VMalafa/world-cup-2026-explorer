"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFeatured } from "@/lib/useFeatured";
import { getTeam } from "@/data/teams";
import { ReadingLevelToggle } from "@/components/ReadingLevelToggle";
import { ProfileChip } from "@/components/ProfileChip";
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
  // Fetches /api/matches (live or bundled), polls, and falls back gracefully.
  const { featured, source } = useFeatured();

  const firstMatch = featured?.matches[0];
  // The Compare view needs codes that exist in the curated learning set; fall
  // back to two well-known teams when today's live teams aren't curated yet.
  const homeCode = getTeam(firstMatch?.homeCode ?? "") ? firstMatch!.homeCode : "BRA";
  const awayCode = getTeam(firstMatch?.awayCode ?? "") ? firstMatch!.awayCode : "FRA";
  const dayIndex = featured?.dayIndex ?? 0;

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-28 pt-5 sm:pb-10">
      {/* Header */}
      <header className="mb-5 flex flex-col items-center gap-4 sm:mb-7 sm:flex-row sm:justify-between sm:gap-3">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <h1 className="flex items-center gap-2 text-center text-[clamp(1.5rem,7vw,2rem)] font-extrabold tracking-tight sm:text-left sm:text-4xl">
            <span className="animate-float" aria-hidden>
              ⚽
            </span>
            <span>
              <span className="text-royal">World Cup</span>{" "}
              <span className="text-unity">Explorer</span>
            </span>
          </h1>
          {/* The Malafa signature: four homes, one game. */}
          <div className="flex items-center gap-2">
            <span className="unity-ribbon h-1 w-16 rounded-full" aria-hidden />
            <span
              className="text-sm font-bold text-muted"
              title="Cameroon · Netherlands · Lebanon · USA"
            >
              <span aria-hidden>🇨🇲 🇳🇱 🇱🇧 🇺🇸</span>
              <span className="sr-only">
                Made by the Malafa family — Cameroon, Netherlands, Lebanon and USA
              </span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <ProfileChip />
          <ReadingLevelToggle compact />
        </div>
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
            {tab === "today" && (
              <MatchDashboard featured={featured} source={source} />
            )}
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
        className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-white/95 px-2 py-2 backdrop-blur sm:hidden"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-2xl px-2 py-1 text-xs font-extrabold transition-colors ${
              tab === t.id ? "bg-royal-50 text-royal-700" : "text-muted"
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
        active
          ? "text-white"
          : "bg-white text-muted ring-1 ring-line hover:text-ink"
      }`}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 -z-10 rounded-full bg-royal shadow-pop"
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
