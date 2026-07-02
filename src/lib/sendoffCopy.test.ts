import { describe, it, expect } from "vitest";

import { reviewCopyLine } from "./contentGuardian";
import { lossBranchCopy, lossBranchLines } from "./sendoffCopy";

const CANDIDATES = [
  { code: "CIV", name: "Ivory Coast" },
  { code: "NOR", name: "Norway" },
];

describe("lossBranchCopy (#66 — the Send-off framing)", () => {
  const copy = lossBranchCopy("Brazil", "Japan", CANDIDATES);
  const lines = lossBranchLines(copy);

  it("makes all three moves, then pivots to the winner's joy", () => {
    expect(copy.farewell).toContain("played their hearts out");
    expect(copy.partOfTheGame).toContain("only one can lift the trophy");
    expect(copy.partOfTheGame).toContain("That's the game");
    expect(copy.passportKeepsake).toContain("in your Passport 💛");
    expect(copy.winnersJoy).toContain("Japan");
    expect(copy.winnersJoy).toContain("Ivory Coast or Norway");
  });

  it("never frames defeat as 'out' or 'eliminated' — a proud farewell, not an exit", () => {
    // "played their hearts out" is the farewell #60 asks for by name; the ban
    // is on defeat-framing ("Brazil is out", "out of the cup"), not the idiom.
    for (const line of lines) {
      expect(line).not.toMatch(/\beliminat/i);
      expect(line).not.toMatch(/\b(is|are|go|goes|went|they're)\s+out\b/i);
      expect(line).not.toMatch(/\bout of the\b/i);
      expect(line).not.toMatch(/\b(knocked|kicked)\s+out\b/i);
    }
  });

  it("passes the Content Guardian's Values Rubric wording gate", () => {
    for (const line of lines) {
      expect(reviewCopyLine("sendoff.lossBranch", line)).toEqual([]);
    }
  });

  it("stays honest when the Road ahead is not decided yet", () => {
    const one = lossBranchCopy("Brazil", "Japan", [CANDIDATES[0]]);
    expect(one.winnersJoy).toContain("Ivory Coast would be waiting");
    const none = lossBranchCopy("Brazil", "Japan", []);
    expect(none.winnersJoy).toContain("a brand-new country would be waiting");
    for (const line of [...lossBranchLines(one), ...lossBranchLines(none)]) {
      expect(reviewCopyLine("sendoff.lossBranch", line)).toEqual([]);
    }
  });
});

describe("reviewCopyLine (the Guardian's UI-copy gate)", () => {
  it("quarantines cold defeat framing", () => {
    expect(
      reviewCopyLine("x", "Brazil was eliminated from the tournament").map((f) => f.message),
    ).toContain("cold defeat framing");
    expect(reviewCopyLine("x", "Japan knocked out Brazil").map((f) => f.message)).toContain(
      "cold defeat framing",
    );
  });

  it("keeps the existing Rubric wording checks", () => {
    expect(reviewCopyLine("x", "the scary war zone").length).toBeGreaterThan(0);
    expect(reviewCopyLine("x", "the best team ever!!").length).toBeGreaterThan(0);
    expect(reviewCopyLine("x", "")).toHaveLength(1);
    expect(reviewCopyLine("x", "A calm, kind sentence about football.")).toEqual([]);
  });
});
