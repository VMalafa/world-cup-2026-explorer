/**
 * Helpers for turning the live provider's host-LOCAL date strings
 * ("MM/DD/YYYY HH:MM", no timezone) into absolute ISO instants the
 * countdown can use.
 *
 * The provider doesn't give a timezone, so we approximate one from each
 * stadium's region/country. In June the host nations observe:
 *   - US Eastern  → UTC-4 (EDT)      - US Central → UTC-5 (CDT)
 *   - US/CA West  → UTC-7 (PDT)      - Mexico     → UTC-6 (no DST)
 * This can be off by ~1h for a few venues; it's good enough for a kids'
 * countdown and is clearly documented in the README.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Best-effort UTC offset (in hours) for a venue. */
export function offsetForStadium(region?: string, country?: string): number {
  if (country && /mexico/i.test(country)) return -6;
  switch ((region ?? "").toLowerCase()) {
    case "eastern":
      return -4;
    case "central":
      return -5;
    case "western":
    case "pacific":
    case "mountain":
      return -7;
    default:
      return -5; // sensible middle-of-the-map default
  }
}

export interface ParsedLocal {
  /** YYYY-MM-DD in the host-local calendar (for grouping by match day). */
  date: string;
  /** Absolute ISO instant, e.g. 2026-06-11T13:00:00-04:00. */
  iso: string;
}

/**
 * Parse "MM/DD/YYYY HH:MM" (host-local) into a calendar date + absolute ISO.
 * Returns null if the string can't be understood.
 */
export function parseLocalDate(
  localDate: string,
  offsetHours: number,
): ParsedLocal | null {
  if (!localDate) return null;
  const [datePart, timePart = "00:00"] = localDate.trim().split(/\s+/);
  const dm = datePart.split("/").map((x) => parseInt(x, 10));
  const tm = timePart.split(":").map((x) => parseInt(x, 10));
  if (dm.length < 3 || dm.some((n) => Number.isNaN(n))) return null;

  const [mm, dd, yyyy] = dm;
  const [HH = 0, MM = 0] = tm.map((n) => (Number.isNaN(n) ? 0 : n));

  const sign = offsetHours <= 0 ? "-" : "+";
  const off = `${sign}${pad(Math.abs(offsetHours))}:00`;
  const date = `${yyyy}-${pad(mm)}-${pad(dd)}`;
  const iso = `${date}T${pad(HH)}:${pad(MM)}:00${off}`;
  return { date, iso };
}
