"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  TEAMS,
  getTeam,
  CONTINENT_LABEL,
  CONTINENT_COLOR,
} from "@/data/teams";
import type { Continent } from "@/types";
import { useReadingLevel } from "./ReadingLevel";
import { Flag } from "./Flag";

// Leaflet touches `window`, so load the map only on the client.
const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] min-h-[360px] w-full items-center justify-center rounded-blob bg-royal-50">
      <div className="flex flex-col items-center gap-3 text-royal">
        <span className="animate-float text-5xl" aria-hidden>
          🌍
        </span>
        <span className="font-extrabold">Loading the world…</span>
      </div>
    </div>
  ),
});

const CONTINENTS: Continent[] = [
  "namerica",
  "samerica",
  "europe",
  "africa",
  "asia",
  "oceania",
];

export function MapExplorer() {
  const { pick } = useReadingLevel();
  const [selected, setSelected] = useState<string | null>(null);
  const team = selected ? getTeam(selected) : null;

  return (
    <section aria-labelledby="map-heading">
      <div className="mb-4 text-center">
        <h2 id="map-heading" className="text-3xl font-extrabold sm:text-4xl">
          Explore the World 🗺️
        </h2>
        <p className="mt-1 text-lg font-semibold text-muted">
          Tap a dot to learn about a team. Tap a ⚽ to find a stadium!
        </p>
      </div>

      <div className="overflow-hidden rounded-blob shadow-soft ring-1 ring-black/5">
        <WorldMap selectedCode={selected} onSelect={setSelected} />
      </div>

      {/* Continent legend (colour-coded, matches the map dots) */}
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {CONTINENTS.map((c) => (
          <li
            key={c}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-extrabold shadow-sm"
          >
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: CONTINENT_COLOR[c] }}
              aria-hidden
            />
            {CONTINENT_LABEL[c]}
          </li>
        ))}
      </ul>

      {/* Selected-country info card */}
      <AnimatePresence mode="wait">
        {team ? (
          <motion.div
            key={team.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="kid-card mx-auto mt-4 flex max-w-xl items-center gap-4 p-5"
          >
            <span
              className="shrink-0 rounded-xl ring-2 ring-white"
              style={{ boxShadow: `0 0 0 4px ${CONTINENT_COLOR[team.continent]}` }}
            >
              <Flag team={team} size={96} className="!h-[72px] !w-[96px]" />
            </span>
            <div className="text-left">
              <h3 className="text-2xl font-extrabold">
                {team.flag} {team.name}
              </h3>
              <p className="flex flex-wrap items-center gap-x-1.5 font-semibold text-muted">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CONTINENT_COLOR[team.continent] }}
                  aria-hidden
                />
                🏙️ {team.capital} · {CONTINENT_LABEL[team.continent]} · Group {team.group}
              </p>
              <p className="mt-1 text-base font-semibold leading-snug text-ink">
                {pick(team.funFacts[0])}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center font-semibold text-muted"
          >
            👆 {TEAMS.length} teams are on the map. Tap one to start!
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
