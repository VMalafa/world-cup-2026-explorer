import { describe, it, expect } from "vitest";

import type { Match, Stage } from "@/types";
import { MATCHES_SNAPSHOT } from "@/data/matchesSnapshot";
import { BRACKET_FEEDERS, NEXT_ROUND } from "@/data/bracket2026";
import { nextOpponents, stageInKickoffOrder } from "./road";

const KO_STAGES: Stage[] = ["LAST_32", "LAST_16", "QUARTER_FINALS", "SEMI_FINALS", "FINAL"];

function knockout(
  id: string,
  stage: Stage,
  kickoff: string,
  homeCode = "TBD",
  awayCode = "TBD",
): Match {
  return {
    id,
    date: kickoff.slice(0, 10),
    kickoff,
    homeCode,
    awayCode,
    stadium: "",
    city: "",
    group: "",
    status: "scheduled",
    stage,
  };
}

/** A tiny synthetic 4-team bracket: two semis feeding a final. */
const SEMIS: Match[] = [
  knockout("sf1", "SEMI_FINALS", "2026-07-14T20:00:00Z", "BRA", "FRA"),
  knockout("sf2", "SEMI_FINALS", "2026-07-15T20:00:00Z"),
  knockout("f", "FINAL", "2026-07-19T20:00:00Z"),
];

describe("the authored bracket map (ADR-0009 sanity)", () => {
  it("partitions each Round exactly once — every slot feeds one next slot", () => {
    const sizes: Partial<Record<Stage, number>> = {
      LAST_16: 16,
      QUARTER_FINALS: 8,
      SEMI_FINALS: 4,
      FINAL: 2,
    };
    for (const [stage, feeders] of Object.entries(BRACKET_FEEDERS)) {
      const all = feeders.flat();
      expect(new Set(all).size, `${stage} feeders must not repeat`).toBe(all.length);
      expect(all.length).toBe(sizes[stage as Stage]);
    }
  });

  it("has well-defined slots: kickoffs are unique within every knockout Round", () => {
    for (const stage of KO_STAGES) {
      const kicks = stageInKickoffOrder(MATCHES_SNAPSHOT, stage).map((m) => m.kickoff);
      expect(new Set(kicks).size, stage).toBe(kicks.length);
    }
  });

  it("matches reality: every decided side of a later-round fixture is a team of its mapped feeders", () => {
    // As the daily refresh (ADR-0005) fills fixtures in, a wrong authored edge
    // fails here with the fixture named — the manual-edit path ADR-0009 accepts.
    let checked = 0;
    for (const [stage, feeders] of Object.entries(BRACKET_FEEDERS) as [Stage, [number, number][]][]) {
      const prevStage = (Object.entries(NEXT_ROUND) as [Stage, Stage][]).find(
        ([, next]) => next === stage,
      )?.[0];
      if (!prevStage) continue;
      const prev = stageInKickoffOrder(MATCHES_SNAPSHOT, prevStage);
      stageInKickoffOrder(MATCHES_SNAPSHOT, stage).forEach((m, slot) => {
        const teams = feeders[slot].flatMap((o) => [prev[o - 1].homeCode, prev[o - 1].awayCode]);
        for (const side of [m.homeCode, m.awayCode]) {
          if (side && side.toUpperCase() !== "TBD") {
            expect(teams, `${m.id} (${stage} slot ${slot + 1}): ${side}`).toContain(side);
            checked++;
          }
        }
      });
    }
    expect(checked).toBeGreaterThan(0); // the check must actually bite
  });
});

describe("nextOpponents", () => {
  it("names the two sides of the sibling fixture on the real snapshot", () => {
    // Brazil v Japan (Round of 32) feeds the same R16 slot as Ivory Coast v
    // Norway — verified against the filled-in R16 fixture (Brazil v Norway).
    const bra = MATCHES_SNAPSHOT.find(
      (m) => m.stage === "LAST_32" && m.homeCode === "BRA" && m.awayCode === "JPN",
    )!;
    const step = nextOpponents(bra, MATCHES_SNAPSHOT)!;
    expect(step.nextStage).toBe("LAST_16");
    expect(step.candidates.map((c) => c.code).sort()).toEqual(["CIV", "NOR"]);
  });

  it("returns at most two candidates, never gating on scores", () => {
    for (const m of MATCHES_SNAPSHOT) {
      if (!m.stage || m.stage === "GROUP_STAGE") continue;
      const step = nextOpponents(m, MATCHES_SNAPSHOT);
      if (step) expect(step.candidates.length).toBeLessThanOrEqual(2);
    }
  });

  it("stays honest: a fully TBD sibling yields no candidates, not inventions", () => {
    const semi1 = SEMIS[0];
    const step = nextOpponents(semi1, SEMIS)!;
    expect(step.nextStage).toBe("FINAL");
    expect(step.sibling?.id).toBe("sf2");
    expect(step.candidates).toEqual([]);
  });

  it("names both curated sides of a decided sibling", () => {
    const semi2 = SEMIS[1];
    const step = nextOpponents(semi2, SEMIS)!;
    expect(step.candidates.map((c) => c.name).sort()).toEqual(["Brazil", "France"]);
  });

  it("ends The Road where there is no next Round", () => {
    expect(nextOpponents(SEMIS[2], SEMIS)).toBeNull(); // the Final
    const group = MATCHES_SNAPSHOT.find((m) => m.stage === "GROUP_STAGE")!;
    expect(nextOpponents(group, MATCHES_SNAPSHOT)).toBeNull();
    const third = MATCHES_SNAPSHOT.find((m) => m.stage === "THIRD_PLACE")!;
    expect(nextOpponents(third, MATCHES_SNAPSHOT)).toBeNull();
  });

  it("returns null for a match it cannot place", () => {
    const stray = knockout("stray", "SEMI_FINALS", "2026-07-16T20:00:00Z");
    expect(nextOpponents(stray, SEMIS)).toBeNull();
  });
});
