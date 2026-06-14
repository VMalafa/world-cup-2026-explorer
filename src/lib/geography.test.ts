import { describe, it, expect } from "vitest";

import {
  bearingDeg,
  distanceKm,
  geographyFor,
  HOMELANDS,
  toCompass,
} from "./geography";

describe("distanceKm", () => {
  it("matches the known great-circle distance London→Paris (~344 km)", () => {
    const london = { lat: 51.5074, lng: -0.1278 };
    const paris = { lat: 48.8566, lng: 2.3522 };
    expect(distanceKm(london, paris)).toBeCloseTo(344, -1); // within ~5 km
  });

  it("is zero between a point and itself", () => {
    const beirut = { lat: 33.89, lng: 35.5 };
    expect(distanceKm(beirut, beirut)).toBe(0);
  });
});

describe("bearingDeg + toCompass", () => {
  const origin = { lat: 0, lng: 0 };

  it("reads due north as N", () => {
    expect(toCompass(bearingDeg(origin, { lat: 10, lng: 0 }))).toBe("N");
  });
  it("reads due east as E", () => {
    expect(toCompass(bearingDeg(origin, { lat: 0, lng: 10 }))).toBe("E");
  });
  it("reads due south as S", () => {
    expect(toCompass(bearingDeg(origin, { lat: -10, lng: 0 }))).toBe("S");
  });
  it("reads due west as W", () => {
    expect(toCompass(bearingDeg(origin, { lat: 0, lng: -10 }))).toBe("W");
  });
});

describe("geographyFor", () => {
  it("reports how-far/which-way from each of the four Homelands, in canonical order", () => {
    // Beirut, Lebanon — coordinates only, no hand-authored geography.
    const geo = geographyFor({ lat: 33.89, lng: 35.5 });

    expect(geo.fromHomelands.map((b) => b.homeland.name)).toEqual([
      "Cameroon",
      "Netherlands",
      "Lebanon",
      "USA",
    ]);
    expect(HOMELANDS).toHaveLength(4);
  });

  it("phrases direction as where the country sits from home (east of the Netherlands → E)", () => {
    const netherlands = HOMELANDS.find((h) => h.code === "NED")!;
    // A point on the Netherlands' latitude, well to its east.
    const eastOfHome = { lat: netherlands.lat, lng: netherlands.lng + 20 };

    const fromNed = geographyFor(eastOfHome).fromHomelands.find(
      (b) => b.homeland.code === "NED",
    )!;
    expect(fromNed.compass).toBe("E");
    expect(fromNed.km).toBeGreaterThan(0);
  });

  it("gives ~zero distance from a Homeland to that Homeland's own location", () => {
    const usa = HOMELANDS.find((h) => h.code === "USA")!;
    const fromUsa = geographyFor({ lat: usa.lat, lng: usa.lng }).fromHomelands.find(
      (b) => b.homeland.code === "USA",
    )!;
    expect(fromUsa.km).toBe(0);
  });

  it("derives the hemisphere from latitude", () => {
    expect(geographyFor({ lat: -33.45, lng: -70.67 }).hemisphere).toBe("south");
    expect(geographyFor({ lat: 52.37, lng: 4.9 }).hemisphere).toBe("north");
  });
});
