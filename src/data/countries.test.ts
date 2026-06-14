import { describe, it, expect } from "vitest";

import { geographyFor, HOMELANDS } from "@/lib/geography";

import { COUNTRIES, getCountry } from "./countries";

describe("Country / Team split", () => {
  it("projects all 48 tournament nations into Countries", () => {
    expect(COUNTRIES).toHaveLength(48);
  });

  it("drops the footballing-only facet (group) from a Country", () => {
    const brazil = getCountry("BRA")!;
    expect(brazil).not.toHaveProperty("group");
    // ...but keeps the learning facets that drive the journey.
    expect(brazil.capital).toBe("Brasília");
    expect(brazil.lat).toBeDefined();
    expect(brazil.lng).toBeDefined();
  });

  it("leaves Wonders + flag meaning absent until authored in #4", () => {
    const brazil = getCountry("BRA")!;
    expect(brazil.wonders).toBeUndefined();
    expect(brazil.flagMeaning).toBeUndefined();
  });
});

describe("geographyFor(country) — the acceptance criterion", () => {
  it("returns how-far/which-way from all four Homelands for every Country", () => {
    for (const country of COUNTRIES) {
      const geo = geographyFor(country);
      expect(geo.fromHomelands).toHaveLength(HOMELANDS.length);
      for (const b of geo.fromHomelands) {
        expect(Number.isFinite(b.km)).toBe(true);
        expect(b.km).toBeGreaterThanOrEqual(0);
        expect(b.compass).toMatch(/^(N|NE|E|SE|S|SW|W|NW)$/);
      }
    }
  });

  it("places Brazil south of, and a long way from, the northern Homelands", () => {
    const geo = geographyFor(getCountry("BRA")!);
    expect(geo.hemisphere).toBe("south");
    const fromNed = geo.fromHomelands.find((b) => b.homeland.code === "NED")!;
    expect(fromNed.km).toBeGreaterThan(8000);
    expect(fromNed.compass.startsWith("S") || fromNed.compass === "SW").toBe(true);
  });
});
