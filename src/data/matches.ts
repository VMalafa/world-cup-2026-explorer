/**
 * The 16 real host venues of the 2026 tournament (USA, Canada, Mexico).
 *
 * NOTE: this file once also held a synthetic `buildSchedule()` that INVENTED
 * fixtures by pairing group-mates in array order. That generator was the shared
 * root cause of issues #32 ("Brazil vs Tunisia") and #30, because the app could
 * silently fall back to it and show fabricated matches as real. It has been
 * removed (ADR-0005): match data is now live-first with a committed REAL snapshot
 * fallback (`matchesSnapshot.ts`) — never fabricated. Only the real host-venue
 * list remains here (used by the WorldMap).
 */
export const STADIUMS: { name: string; city: string }[] = [
  { name: "Estadio Azteca", city: "Mexico City" },
  { name: "MetLife Stadium", city: "New York / New Jersey" },
  { name: "SoFi Stadium", city: "Los Angeles" },
  { name: "AT&T Stadium", city: "Dallas" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta" },
  { name: "Hard Rock Stadium", city: "Miami" },
  { name: "NRG Stadium", city: "Houston" },
  { name: "Arrowhead Stadium", city: "Kansas City" },
  { name: "Lincoln Financial Field", city: "Philadelphia" },
  { name: "Levi's Stadium", city: "San Francisco Bay Area" },
  { name: "Lumen Field", city: "Seattle" },
  { name: "Gillette Stadium", city: "Boston" },
  { name: "BMO Field", city: "Toronto" },
  { name: "BC Place", city: "Vancouver" },
  { name: "Estadio Akron", city: "Guadalajara" },
  { name: "Estadio BBVA", city: "Monterrey" },
];
