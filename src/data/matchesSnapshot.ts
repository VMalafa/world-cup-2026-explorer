import type { Match } from "@/types";
import snapshotJson from "./matchesSnapshot.json";

/**
 * The last-good snapshot of REAL match data (football-data.org), committed to the
 * repo and refreshed daily by the cron in `.github/workflows/refresh-snapshot.yml`
 * (script: `scripts/refreshSnapshot.mts`).
 *
 * This is the app's ONLY fallback when the live provider is momentarily
 * unavailable. It is real-but-possibly-stale data — never fabricated. The
 * synthetic `buildSchedule()` that used to fill this role invented fixtures that
 * looked real ("Brazil vs Tunisia"), the shared root cause of issues #32 and #30.
 * See ADR-0005.
 */
interface SnapshotFile {
  /** ISO timestamp the snapshot was captured. */
  capturedAt: string;
  source: string;
  competition: string;
  season: string;
  count: number;
  matches: Match[];
}

const snapshot = snapshotJson as SnapshotFile;

/** Real, last-good fixtures/results. Stale at worst, never fake. */
export const MATCHES_SNAPSHOT: Match[] = snapshot.matches;

/** When the snapshot was captured — surface this so stale data is honest. */
export const SNAPSHOT_CAPTURED_AT: string = snapshot.capturedAt;
