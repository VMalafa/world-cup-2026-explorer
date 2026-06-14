/**
 * Derived geography — the spine of a Match Day Journey.
 *
 * A Country is taught by *where it sits* relative to the four Homelands
 * (CONTEXT.md). Everything here is computed from existing capital `lat`/`lng`;
 * nothing about distance or direction is hand-authored (ADR-0002, issue #3).
 */

/** Anything locatable on the Globe by its coordinates. */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * One of the four Malafa family countries used as the fixed anchor for
 * teaching every other Country's location. Lebanon is a Homeland but not a
 * tournament Team, so Homelands are defined here independently of `TEAMS`.
 */
export interface Homeland extends GeoPoint {
  /** Stable id (FIFA-style where one exists). */
  code: string;
  name: string;
  /** Emoji flag — instant, no network. */
  flag: string;
  capital: string;
}

/** 8-point compass — enough for "which way from home" for a pre-reader. */
export type Compass = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

/** Where a Country sits relative to one Homeland: how far and which way. */
export interface HomelandBearing {
  homeland: Homeland;
  /** Great-circle distance, whole kilometres. */
  km: number;
  /** Initial bearing from the Homeland toward the Country, 0–360°. */
  bearing: number;
  /** `bearing` snapped to the nearest of 8 compass points. */
  compass: Compass;
}

/** The full derived-geography report for a Country (or any point). */
export interface Geography {
  hemisphere: "north" | "south";
  /** One entry per Homeland, always in canonical HOMELANDS order. */
  fromHomelands: HomelandBearing[];
}

/**
 * The four Homelands, in the canonical order used everywhere:
 * Cameroon, Netherlands, Lebanon, USA. Capital coordinates match `teams.ts`
 * where the country is also a tournament Team (Lebanon is the exception).
 */
export const HOMELANDS: Homeland[] = [
  { code: "CMR", name: "Cameroon", flag: "🇨🇲", capital: "Yaoundé", lat: 3.85, lng: 11.5 },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", capital: "Amsterdam", lat: 52.37, lng: 4.9 },
  { code: "LBN", name: "Lebanon", flag: "🇱🇧", capital: "Beirut", lat: 33.89, lng: 35.5 },
  { code: "USA", name: "USA", flag: "🇺🇸", capital: "Washington, D.C.", lat: 38.9, lng: -77.04 },
];

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Great-circle distance between two points, rounded to whole kilometres. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h))));
}

/** Initial great-circle bearing from `a` toward `b`, normalised to 0–360°. */
export function bearingDeg(a: GeoPoint, b: GeoPoint): number {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const COMPASS: Compass[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/** Snap a 0–360° bearing to the nearest 8-point compass direction. */
export function toCompass(bearing: number): Compass {
  const normalised = ((bearing % 360) + 360) % 360;
  return COMPASS[Math.round(normalised / 45) % 8];
}

/**
 * Derive how far and which way `place` sits from each of the four Homelands,
 * plus which hemisphere it's in. Pure function of coordinates.
 */
export function geographyFor(place: GeoPoint): Geography {
  return {
    hemisphere: place.lat >= 0 ? "north" : "south",
    fromHomelands: HOMELANDS.map((homeland) => {
      // Bearing/distance FROM home TO the country: "it's <compass> of home".
      const bearing = bearingDeg(homeland, place);
      return {
        homeland,
        km: distanceKm(homeland, place),
        bearing,
        compass: toCompass(bearing),
      };
    }),
  };
}
