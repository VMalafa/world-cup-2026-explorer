import { describe, it, expect } from "vitest";

import { computeStandings } from "./standings";
import type { Match } from "@/types";

function played(
  group: string,
  home: string,
  away: string,
  hs: number,
  as: number,
): Match {
  return {
    id: `${home}-${away}`,
    date: "2026-06-13",
    kickoff: "2026-06-13T16:00:00Z",
    homeCode: home,
    awayCode: away,
    stadium: "",
    city: "",
    group,
    status: "finished",
    homeScore: hs,
    awayScore: as,
  };
}

function scheduled(group: string, home: string, away: string): Match {
  return { ...played(group, home, away, 0, 0), status: "scheduled", homeScore: undefined, awayScore: undefined };
}

describe("computeStandings", () => {
  it("awards 3 for a win, 1 each for a draw, 0 for a loss", () => {
    const table = computeStandings(
      [played("A", "ESP", "CPV", 2, 0), played("A", "BEL", "EGY", 1, 1)],
      "A",
    );
    const pts = Object.fromEntries(table.map((r) => [r.code, r.points]));
    expect(pts).toEqual({ ESP: 3, CPV: 0, BEL: 1, EGY: 1 });
  });

  it("orders by points, then goal difference, then goals for", () => {
    const table = computeStandings(
      [
        played("A", "ESP", "CPV", 1, 0), // ESP +1
        played("A", "BEL", "EGY", 3, 0), // BEL +3
        played("A", "ESP", "EGY", 2, 0), // ESP +2 more → +3 total, 6 pts
        played("A", "BEL", "CPV", 1, 0), // BEL +1 more → +4 total, 6 pts
      ],
      "A",
    );
    // ESP & BEL both 6 pts; BEL has better GD (+4 vs +3) → BEL first.
    expect(table.map((r) => r.code)).toEqual(["BEL", "ESP", "CPV", "EGY"]);
  });

  it("includes teams that haven't played yet (from scheduled fixtures)", () => {
    const table = computeStandings(
      [played("A", "ESP", "CPV", 1, 0), scheduled("A", "BEL", "EGY")],
      "A",
    );
    expect(table.map((r) => r.code).sort()).toEqual(["BEL", "CPV", "EGY", "ESP"]);
    expect(table.find((r) => r.code === "BEL")?.played).toBe(0);
  });

  it("counts only the requested group and ignores live/scheduled scores", () => {
    const live: Match = { ...played("A", "ESP", "CPV", 5, 0), status: "live" };
    const table = computeStandings([live, played("B", "BRA", "MAR", 2, 1)], "A");
    // The live match isn't a result yet → ESP/CPV both 0 pts, 0 played.
    expect(table.every((r) => r.played === 0 && r.points === 0)).toBe(true);
    expect(table.some((r) => r.code === "BRA")).toBe(false);
  });

  it("tracks goal difference correctly across matches", () => {
    const table = computeStandings(
      [played("A", "ESP", "CPV", 3, 1), played("A", "ESP", "EGY", 0, 2)],
      "A",
    );
    const esp = table.find((r) => r.code === "ESP")!;
    expect(esp).toMatchObject({ played: 2, goalsFor: 3, goalsAgainst: 3, goalDiff: 0, points: 3 });
  });
});
