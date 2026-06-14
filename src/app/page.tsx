"use client";

import Link from "next/link";

import { useFeatured } from "@/lib/useFeatured";
import { ReadingLevelToggle } from "@/components/ReadingLevelToggle";
import { ProfileChip } from "@/components/ProfileChip";
import { MatchDashboard } from "@/components/MatchDashboard";
import { SurfaceNav } from "@/components/SurfaceNav";

/**
 * Today — one of the two primary surfaces (with World). It surfaces the Match
 * of the Day and opens the Match Day Journey; the day's other fixtures stay
 * followable below. The old Compare/Heroes/Facts tabs are gone (#10) — their
 * value lives inside the journey now.
 */
export default function Home() {
  // Fetches /api/matches (live or bundled), polls, and falls back gracefully.
  const { featured, source } = useFeatured();

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col px-4 pb-28 pt-5">
      <header className="mb-5 flex flex-col items-center gap-4 sm:mb-7 sm:flex-row sm:justify-between sm:gap-3">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <h1 className="flex items-center gap-2 text-center text-[clamp(1.5rem,7vw,2rem)] font-extrabold tracking-tight sm:text-left sm:text-4xl">
            <span className="animate-float" aria-hidden>⚽</span>
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

      <main className="flex-1 space-y-6">
        {/* The Match of the Day opens the journey */}
        <Link
          href="/journey"
          className="group flex items-center justify-between gap-3 rounded-blob bg-royal px-5 py-4 text-white shadow-pop transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-5"
        >
          <span className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl" aria-hidden>🌍</span>
            <span>
              <span className="block text-lg font-extrabold sm:text-xl">
                Start today&rsquo;s Match Day Journey
              </span>
              <span className="block text-sm font-semibold text-white/80">
                Explore both countries on the globe
              </span>
            </span>
          </span>
          <span className="text-2xl font-extrabold transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>

        {/* The day's fixtures — still followable; tap any to start its journey */}
        <MatchDashboard featured={featured} source={source} />
      </main>

      <SurfaceNav />
    </div>
  );
}
