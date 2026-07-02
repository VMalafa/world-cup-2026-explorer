"use client";

import { useSearchParams } from "next/navigation";

import type { Match } from "@/types";
import { getTeam } from "@/data/teams";
import { useFeatured } from "@/lib/useFeatured";
import { computeStandings } from "@/lib/standings";
import { nextOpponents } from "@/lib/road";
import { Journey } from "./Journey";

/**
 * Resolves which Match Day Journey to run: an explicit `?home=&away=` override
 * (tapping any fixture, on any day), else the auto-picked Match of the Day — the
 * earliest match of the featured day. Also derives the playing group's
 * Standings (issue #31) from the real match data to show inside the journey.
 */
export function JourneyClient() {
  const params = useSearchParams();
  const qHome = params.get("home");
  const qAway = params.get("away");

  const { featured, allMatches } = useFeatured();

  // Resolve the fixture and its two countries.
  let homeCode: string;
  let awayCode: string;
  let match: Match | undefined;

  if (qHome && qAway) {
    // An override links to a specific fixture — find it (on any day) for its
    // kickoff/id/group.
    homeCode = qHome;
    awayCode = qAway;
    match = allMatches.find((m) => m.homeCode === qHome && m.awayCode === qAway);
  } else {
    // Wait for the schedule before picking the Match of the Day.
    if (!featured) {
      return (
        <div className="flex min-h-dvh items-center justify-center">
          <span className="animate-float text-6xl" aria-hidden>
            🌍
          </span>
        </div>
      );
    }
    const mod = featured.matches[0];
    homeCode = mod && getTeam(mod.homeCode) ? mod.homeCode : "BRA";
    awayCode = mod && getTeam(mod.awayCode) ? mod.awayCode : "FRA";
    match = mod;
  }

  // The playing group's table (group stage only; knockout matches carry no group).
  const group = match?.group ?? "";
  const standings = group ? computeStandings(allMatches, group) : [];
  // The Road: a knockout Match's candidate next-round opponents (#63).
  const road = match ? nextOpponents(match, allMatches) : null;

  return (
    <Journey
      homeCode={homeCode}
      awayCode={awayCode}
      matchId={match?.id ?? `${homeCode}-${awayCode}`}
      kickoff={match?.kickoff}
      group={group}
      standings={standings}
      stage={match?.stage}
      road={road}
    />
  );
}
