import { describe, it, expect } from "vitest";

import { computeInsights } from "./insights";
import type { Match } from "@/types";

const nameOf = (c: string) => ({ ESP: "Spain", CPV: "Cape Verde", BEL: "Belgium", EGY: "Egypt" }[c] ?? c);

function finished(home: string, away: string, hs: number, as: number, date = "2026-06-13"): Match {
  return {
    id: `${home}-${away}`,
    date,
    kickoff: `${date}T16:00:00Z`,
    homeCode: home,
    awayCode: away,
    stadium: "",
    city: "",
    group: "A",
    status: "finished",
    homeScore: hs,
    awayScore: as,
  };
}

function scheduled(home: string, away: string, date = "2026-06-20"): Match {
  return { ...finished(home, away, 0, 0, date), status: "scheduled", homeScore: undefined, awayScore: undefined };
}

describe("computeInsights", () => {
  it("leads with the group standing once a game is played", () => {
    const facts = computeInsights([finished("ESP", "CPV", 2, 0)], "ESP", { group: "A", nameOf });
    expect(facts[0]).toBe("📊 1st in Group A with 3 points");
  });

  it("reports the last result with the right verb and opponent name", () => {
    const facts = computeInsights([finished("ESP", "CPV", 0, 1)], "ESP", { group: "A", nameOf });
    expect(facts).toContain("🔙 Lost to Cape Verde 0–1");
  });

  it("surfaces the next fixture, labelled 'First match' before any game", () => {
    const facts = computeInsights([scheduled("ESP", "BEL", "2026-06-20")], "ESP", { group: "A", nameOf });
    expect(facts.some((f) => f.startsWith("📅 First match: Belgium"))).toBe(true);
  });

  it("labels a later fixture 'Next up' once a game is played", () => {
    const facts = computeInsights(
      [finished("ESP", "CPV", 2, 0), scheduled("ESP", "BEL", "2026-06-20")],
      "ESP",
      { group: "A", nameOf },
    );
    expect(facts.some((f) => f.startsWith("📅 Next up: Belgium"))).toBe(true);
  });

  it("calls out a biggest win distinct from the last result", () => {
    const facts = computeInsights(
      [finished("ESP", "CPV", 5, 0, "2026-06-13"), finished("ESP", "BEL", 1, 0, "2026-06-17")],
      "ESP",
      { group: "A", nameOf },
    );
    // Last result is the 1–0; the 5–0 should appear as the biggest win.
    expect(facts).toContain("🌟 Biggest win: Cape Verde 5–0");
  });

  it("never returns more than four facts", () => {
    const facts = computeInsights(
      [
        finished("ESP", "CPV", 5, 0, "2026-06-13"),
        finished("ESP", "BEL", 3, 1, "2026-06-17"),
        scheduled("ESP", "EGY", "2026-06-21"),
      ],
      "ESP",
      { group: "A", nameOf },
    );
    expect(facts.length).toBeLessThanOrEqual(4);
  });
});
