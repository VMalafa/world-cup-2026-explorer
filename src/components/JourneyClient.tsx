"use client";

import { useSearchParams } from "next/navigation";

import { getTeam } from "@/data/teams";
import { useFeatured } from "@/lib/useFeatured";
import { Journey } from "./Journey";

/**
 * Resolves which Match Day Journey to run: an explicit `?home=&away=` override
 * (tapping another fixture), else the auto-picked Match of the Day — the
 * earliest match of the featured day.
 */
export function JourneyClient() {
  const params = useSearchParams();
  const qHome = params.get("home");
  const qAway = params.get("away");

  const { featured } = useFeatured();

  // An override links to a specific fixture — find it for its kickoff/id.
  if (qHome && qAway) {
    const match = featured?.matches.find(
      (m) => m.homeCode === qHome && m.awayCode === qAway,
    );
    return (
      <Journey
        homeCode={qHome}
        awayCode={qAway}
        matchId={match?.id ?? `${qHome}-${qAway}`}
        kickoff={match?.kickoff}
      />
    );
  }

  // Wait for the schedule before picking the Match of the Day.
  if (!featured) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="animate-float text-6xl" aria-hidden>🌍</span>
      </div>
    );
  }

  const mod = featured.matches[0];
  const home = mod && getTeam(mod.homeCode) ? mod.homeCode : "BRA";
  const away = mod && getTeam(mod.awayCode) ? mod.awayCode : "FRA";
  return (
    <Journey
      homeCode={home}
      awayCode={away}
      matchId={mod?.id ?? `${home}-${away}`}
      kickoff={mod?.kickoff}
    />
  );
}
