/**
 * The content authoring pipeline (ADR-0002, issue #4).
 *
 * Runs every AI-authored draft through the Content Guardian and writes the
 * partitioned result into `src/data`:
 *   - countryContent.json — Guardian-approved, shippable content (app reads this)
 *   - quarantine.json      — held items, documented, never shipped
 *
 * Re-running regenerates both deterministically:  npm run author:content
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { runPipeline } from "../src/lib/contentGuardian";
import { ALL_DRAFTS } from "../src/data/countryDrafts";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../src/data");

const { approved, quarantined } = runPipeline(ALL_DRAFTS);

const content = Object.fromEntries(
  approved.map((a) => [a.code, { wonders: a.wonders, flagMeaning: a.flagMeaning }]),
);

writeFileSync(resolve(dataDir, "countryContent.json"), JSON.stringify(content, null, 2) + "\n");
writeFileSync(resolve(dataDir, "quarantine.json"), JSON.stringify(quarantined, null, 2) + "\n");

console.log(
  `Content Guardian: ${approved.length} approved, ${quarantined.length} quarantined.`,
);
for (const q of quarantined) {
  console.log(`  quarantined ${q.code}: ${q.findings.map((f) => f.dimension).join(", ")}`);
}
