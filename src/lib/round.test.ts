import { describe, it, expect } from "vitest";

import { ROUND_LADDER, roundName, stageFromRoundLabel, toStage } from "./round";

describe("toStage (football-data.org stage strings)", () => {
  it("passes every known stage through", () => {
    expect(toStage("GROUP_STAGE")).toBe("GROUP_STAGE");
    expect(toStage("LAST_32")).toBe("LAST_32");
    expect(toStage("LAST_16")).toBe("LAST_16");
    expect(toStage("QUARTER_FINALS")).toBe("QUARTER_FINALS");
    expect(toStage("SEMI_FINALS")).toBe("SEMI_FINALS");
    expect(toStage("THIRD_PLACE")).toBe("THIRD_PLACE");
    expect(toStage("FINAL")).toBe("FINAL");
  });

  it("is case-insensitive", () => {
    expect(toStage("last_16")).toBe("LAST_16");
  });

  it("never guesses: unknown or absent stage → undefined", () => {
    expect(toStage("PLAY_OFFS")).toBeUndefined();
    expect(toStage("")).toBeUndefined();
    expect(toStage(null)).toBeUndefined();
    expect(toStage(undefined)).toBeUndefined();
  });
});

describe("stageFromRoundLabel (API-Football round labels)", () => {
  it("recognizes group-stage labels", () => {
    expect(stageFromRoundLabel("Group Stage - 1")).toBe("GROUP_STAGE");
    expect(stageFromRoundLabel("Group A - 3")).toBe("GROUP_STAGE");
  });

  it("recognizes each knockout round", () => {
    expect(stageFromRoundLabel("Round of 32")).toBe("LAST_32");
    expect(stageFromRoundLabel("Round of 16")).toBe("LAST_16");
    expect(stageFromRoundLabel("Quarter-finals")).toBe("QUARTER_FINALS");
    expect(stageFromRoundLabel("Semi-finals")).toBe("SEMI_FINALS");
    expect(stageFromRoundLabel("3rd Place Final")).toBe("THIRD_PLACE");
    expect(stageFromRoundLabel("Final")).toBe("FINAL");
  });

  it("does not mistake 'Quarter-finals' or '3rd Place Final' for the Final", () => {
    expect(stageFromRoundLabel("Quarter-finals")).not.toBe("FINAL");
    expect(stageFromRoundLabel("3rd Place Final")).not.toBe("FINAL");
  });

  it("never guesses: unknown or absent label → undefined", () => {
    expect(stageFromRoundLabel("Preliminary Round")).toBeUndefined();
    expect(stageFromRoundLabel(null)).toBeUndefined();
    expect(stageFromRoundLabel(undefined)).toBeUndefined();
  });
});

describe("roundName (kid-facing Round)", () => {
  it("names every knockout Round", () => {
    expect(roundName("LAST_32")).toBe("Round of 32");
    expect(roundName("LAST_16")).toBe("Round of 16");
    expect(roundName("QUARTER_FINALS")).toBe("Quarter-final");
    expect(roundName("SEMI_FINALS")).toBe("Semi-final");
    expect(roundName("THIRD_PLACE")).toBe("Third-place match");
    expect(roundName("FINAL")).toBe("Final");
  });

  it("shows no Round for group-stage or unknown matches", () => {
    expect(roundName("GROUP_STAGE")).toBe("");
    expect(roundName(undefined)).toBe("");
  });
});

describe("ROUND_LADDER (the climb to the Final, #65)", () => {
  it("runs Round of 32 → Final in playing order, every step named", () => {
    expect(ROUND_LADDER[0]).toBe("LAST_32");
    expect(ROUND_LADDER[ROUND_LADDER.length - 1]).toBe("FINAL");
    for (const stage of ROUND_LADDER) expect(roundName(stage)).not.toBe("");
  });

  it("keeps the third-place match and group stage off the ladder", () => {
    expect(ROUND_LADDER).not.toContain("THIRD_PLACE");
    expect(ROUND_LADDER).not.toContain("GROUP_STAGE");
  });
});
