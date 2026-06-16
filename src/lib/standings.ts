import type { Match } from "@/types";

/**
 * Group **Standings** (issue #31, ADR-0005) — a *derived projection* of real
 * match results, never authored. Group-stage scoring: win = 3, draw = 1, loss
 * = 0. Only FINISHED matches count toward the table (a live 0–0 at minute 3 is
 * not a result yet), so the numbers are always true, just possibly a day stale.
 */
export interface StandingRow {
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

function blankRow(code: string): StandingRow {
  return {
    code,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  };
}

function applyResult(row: StandingRow, scored: number, conceded: number): void {
  row.played += 1;
  row.goalsFor += scored;
  row.goalsAgainst += conceded;
  row.goalDiff = row.goalsFor - row.goalsAgainst;
  if (scored > conceded) {
    row.won += 1;
    row.points += 3;
  } else if (scored === conceded) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

/**
 * Build the table for one group from a list of matches. Teams are discovered
 * from the group's fixtures themselves (so it always reflects the REAL draw,
 * not any static assumption), and every team that appears is shown — even with
 * zero games played yet. Sorted by points, then goal difference, then goals
 * scored, then code (stable).
 */
export function computeStandings(matches: Match[], group: string): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  const seen = (code: string) => {
    let r = rows.get(code);
    if (!r) {
      r = blankRow(code);
      rows.set(code, r);
    }
    return r;
  };

  for (const m of matches) {
    if (m.group !== group) continue;
    // Register both teams so a yet-to-play side still shows in the table.
    const home = seen(m.homeCode);
    const away = seen(m.awayCode);
    if (
      m.status === "finished" &&
      typeof m.homeScore === "number" &&
      typeof m.awayScore === "number"
    ) {
      applyResult(home, m.homeScore, m.awayScore);
      applyResult(away, m.awayScore, m.homeScore);
    }
  }

  return Array.from(rows.values()).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.code.localeCompare(b.code),
  );
}
