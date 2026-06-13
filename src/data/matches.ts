import type { Match } from "@/types";
import { TEAMS } from "./teams";

/**
 * The 16 real host venues of the 2026 tournament (USA, Canada, Mexico).
 */
export const STADIUMS: { name: string; city: string }[] = [
  { name: "Estadio Azteca", city: "Mexico City" },
  { name: "MetLife Stadium", city: "New York / New Jersey" },
  { name: "SoFi Stadium", city: "Los Angeles" },
  { name: "AT&T Stadium", city: "Dallas" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta" },
  { name: "Hard Rock Stadium", city: "Miami" },
  { name: "NRG Stadium", city: "Houston" },
  { name: "Arrowhead Stadium", city: "Kansas City" },
  { name: "Lincoln Financial Field", city: "Philadelphia" },
  { name: "Levi's Stadium", city: "San Francisco Bay Area" },
  { name: "Lumen Field", city: "Seattle" },
  { name: "Gillette Stadium", city: "Boston" },
  { name: "BMO Field", city: "Toronto" },
  { name: "BC Place", city: "Vancouver" },
  { name: "Estadio Akron", city: "Guadalajara" },
  { name: "Estadio BBVA", city: "Monterrey" },
];

/** Kickoff time slots (UTC) we rotate through, kept kid-friendly and varied. */
const KICKOFF_SLOTS = ["16:00:00Z", "19:00:00Z", "22:00:00Z"];

/** Consecutive match dates for the group stage sample (host calendar). */
const MATCH_DATES = [
  "2026-06-11", "2026-06-12", "2026-06-13", "2026-06-14",
  "2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18",
  "2026-06-19", "2026-06-20", "2026-06-21", "2026-06-22",
];

/** Teams grouped by their group letter, preserving array order. */
function teamsByGroup(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const t of TEAMS) (map[t.group] ??= []).push(t.code);
  return map;
}

/**
 * Build a deterministic group-stage schedule (no Date calls — pure data).
 * Matchday 1: t1 v t2, t3 v t4.  Matchday 2: t1 v t3, t2 v t4.
 * Every one of the 48 teams therefore plays twice.
 */
function buildSchedule(): Match[] {
  const groups = teamsByGroup();
  const letters = Object.keys(groups).sort();

  const md1: [string, string, string][] = []; // [home, away, group]
  const md2: [string, string, string][] = [];
  for (const g of letters) {
    const [a, b, c, d] = groups[g];
    md1.push([a, b, g], [c, d, g]);
    md2.push([a, c, g], [b, d, g]);
  }

  const fixtures = [...md1, ...md2];
  const matches: Match[] = [];

  // 4 matches per day: matchday 1 fills the first 6 dates, matchday 2 the next
  // 6 — so no team is ever scheduled twice on the same day.
  fixtures.forEach(([home, away, group], i) => {
    const date = MATCH_DATES[Math.floor(i / 4) % MATCH_DATES.length];
    const slot = KICKOFF_SLOTS[i % KICKOFF_SLOTS.length];
    const stadium = STADIUMS[i % STADIUMS.length];
    matches.push({
      id: `${date}-${home}-${away}`,
      date,
      kickoff: `${date}T${slot}`,
      homeCode: home,
      awayCode: away,
      stadium: stadium.name,
      city: stadium.city,
      group,
      status: "scheduled",
    });
  });

  return matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export const MATCHES: Match[] = buildSchedule();
