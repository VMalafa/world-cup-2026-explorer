import { describe, it, expect } from "vitest";

import { buildJourney, STATION_KINDS } from "./journey";

describe("buildJourney", () => {
  it("teaches both Countries, home first then away", () => {
    const j = buildJourney("JPN", "ESP")!;
    expect(j.countries.map((c) => c.code)).toEqual(["JPN", "ESP"]);
  });

  it("makes one Station of each kind per Country, in order", () => {
    const j = buildJourney("JPN", "ESP")!;
    expect(j.stations.map((s) => `${s.countryCode}:${s.kind}`)).toEqual([
      "JPN:locate",
      "JPN:hello",
      "JPN:wonders",
      "ESP:locate",
      "ESP:hello",
      "ESP:wonders",
    ]);
    expect(j.stations).toHaveLength(STATION_KINDS.length * 2);
  });

  it("gives every Station a stable, unique id", () => {
    const ids = buildJourney("JPN", "ESP")!.stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("works for any Match of the Day, including non-featured Countries", () => {
    // BRA/FRA have no authored Wonders yet, but the journey still builds.
    const j = buildJourney("BRA", "FRA");
    expect(j).not.toBeNull();
    expect(j!.countries.map((c) => c.code)).toEqual(["BRA", "FRA"]);
  });

  it("returns null when a Country isn't in the curated set", () => {
    expect(buildJourney("JPN", "ZZZ")).toBeNull();
  });
});
