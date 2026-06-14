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

  it("surfaces authored Wonders + flag meaning on every Country (issue #23 coverage)", () => {
    const brazil = getCountry("BRA")!;
    expect(brazil.wonders?.landmark.name).toBe("Amazon Rainforest");
    expect(brazil.flagMeaning).toBeDefined();
    // Coverage is complete: every tournament nation now has wonders authored,
    // so no journey falls back to the "still gathering" message.
    for (const c of COUNTRIES) {
      expect(c.wonders, `${c.code} should have wonders`).toBeDefined();
      expect(c.flagMeaning, `${c.code} should have a flag meaning`).toBeDefined();
    }
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
