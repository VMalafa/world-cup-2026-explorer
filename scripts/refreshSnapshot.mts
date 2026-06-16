/**
 * Refresh the committed REAL match snapshot (ADR-0005).
 *
 * Fetches the live fixtures/results from the trusted provider (football-data.org,
 * then API-Football as fallback) and writes `src/data/matchesSnapshot.json`. This
 * snapshot is the app's ONLY fallback when the live feed is momentarily down — so
 * it must always be real data, never the synthetic generator.
 *
 * Run by the daily cron in `.github/workflows/refresh-snapshot.yml`, or locally:
 *   FOOTBALL_DATA_TOKEN=… npm run refresh:snapshot
 *
 * Exits non-zero WITHOUT writing if the provider returns nothing, so a provider
 * outage can never overwrite a good snapshot with an empty/fake one.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { fetchFootballDataMatches } from "../src/lib/providers/footballData";
import { fetchApiFootballMatches } from "../src/lib/providers/apiFootball";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../src/data");

const matches =
  (await fetchFootballDataMatches()) ?? (await fetchApiFootballMatches());

if (!matches || matches.length === 0) {
  console.error(
    "[refresh:snapshot] provider returned no matches — keeping the existing snapshot untouched.",
  );
  process.exit(1);
}

const snapshot = {
  capturedAt: new Date().toISOString(),
  source: "football-data.org",
  competition: "WC",
  season: process.env.FOOTBALL_DATA_SEASON ?? "2026",
  count: matches.length,
  matches,
};

writeFileSync(
  resolve(dataDir, "matchesSnapshot.json"),
  JSON.stringify(snapshot, null, 2) + "\n",
);

console.log(
  `[refresh:snapshot] wrote ${matches.length} real matches (captured ${snapshot.capturedAt}).`,
);
