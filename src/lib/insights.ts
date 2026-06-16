import type { Match } from "@/types";
import { computeStandings } from "./standings";

/**
 * **Insights** (issue #33) — bite-size, *source-verifiable* facts about a Team,
 * derived from the real match data (results, standings, fixtures) we already
 * hold. Never AI-authored and never an unverifiable quote: every line is a plain
 * projection of true results, so it is correct and auto-updates as games are
 * played (same freshness as the scores — see ADR-0005).
 */

const ORDINAL = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

function shortDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

interface PlayedGame {
  oppCode: string;
  scored: number;
  conceded: number;
}

/**
 * Up to four true facts for a team, newest-relevant first. `nameOf` resolves a
 * team code to a display name (injected so this stays pure and testable).
 */
export function computeInsights(
  matches: Match[],
  code: string,
  opts: { group?: string; nameOf: (code: string) => string },
): string[] {
  const { group = "", nameOf } = opts;
  const facts: string[] = [];

  const involves = (m: Match) => m.homeCode === code || m.awayCode === code;
  const mine = matches.filter(involves).sort((a, b) => a.kickoff.localeCompare(b.kickoff));

  const played: PlayedGame[] = [];
  for (const m of mine) {
    if (
      m.status === "finished" &&
      typeof m.homeScore === "number" &&
      typeof m.awayScore === "number"
    ) {
      const home = m.homeCode === code;
      played.push({
        oppCode: home ? m.awayCode : m.homeCode,
        scored: home ? m.homeScore : m.awayScore,
        conceded: home ? m.awayScore : m.homeScore,
      });
    }
  }

  // 1. Standing in the group (only meaningful once a game is played).
  if (group && played.length > 0) {
    const table = computeStandings(matches, group);
    const pos = table.findIndex((r) => r.code === code);
    const row = table[pos];
    if (row) {
      facts.push(
        `📊 ${ORDINAL[pos] ?? `${pos + 1}th`} in Group ${group} with ${row.points} ${
          row.points === 1 ? "point" : "points"
        }`,
      );
    }
  }

  // 2. Last result.
  const last = played[played.length - 1];
  if (last) {
    const verb =
      last.scored > last.conceded ? "Beat" : last.scored === last.conceded ? "Drew with" : "Lost to";
    facts.push(`🔙 ${verb} ${nameOf(last.oppCode)} ${last.scored}–${last.conceded}`);
  }

  // 3. Biggest win so far (best goal margin among wins), if not already the last.
  const wins = played.filter((g) => g.scored > g.conceded);
  if (wins.length > 0) {
    const best = wins.reduce((a, b) =>
      b.scored - b.conceded > a.scored - a.conceded ? b : a,
    );
    if (best !== last) {
      facts.push(`🌟 Biggest win: ${nameOf(best.oppCode)} ${best.scored}–${best.conceded}`);
    }
  }

  // 4. Next fixture (earliest scheduled). For a team yet to play, this is the
  //    opener — make that explicit.
  const next = mine.find((m) => m.status === "scheduled");
  if (next) {
    const oppCode = next.homeCode === code ? next.awayCode : next.homeCode;
    const label = played.length === 0 ? "First match" : "Next up";
    facts.push(`📅 ${label}: ${nameOf(oppCode)} (${shortDate(next.date)})`);
  }

  // A team with no data at all (shouldn't happen for a real fixture) still gets
  // its group, so the list is never empty.
  if (facts.length === 0 && group) {
    facts.push(`📊 Playing in Group ${group}`);
  }

  return facts.slice(0, 4);
}
