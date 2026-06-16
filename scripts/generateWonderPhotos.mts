/**
 * Wonder PHOTO sourcing pipeline (ADR-0007, issue #28).
 *
 * For every Country's three Wonders (landmark / animal / food) this:
 *   1. searches Wikimedia Commons for candidate photos of the wonder,
 *   2. keeps only free-licensed still photos (see src/lib/wikimedia.ts),
 *   3. (unless --no-vision) asks an AI vision model — via the Vercel AI Gateway,
 *      the SAME key the image generator uses — whether each candidate is a clear,
 *      kid-safe (ages 4–6) photo of the subject, and picks the first that passes,
 *   4. downloads the winner to public/wonders/<code>-<slot>.<ext>, and
 *   5. records its attribution in src/data/wonderPhotos.json.
 *
 * It is an AUTHORING-time tool — nothing here ships in the app bundle. After a
 * run, EYEBALL the contact sheet (`npm run dev` → /wonders-sheet) before
 * committing the images + manifest: the one human pass for safety + quality.
 *
 *   AI_GATEWAY_API_KEY=...   (only needed for the vision step)
 *
 * Usage:
 *   npm run gen:wonder-photos -- --dry-run          # search + filter only; no AI, no downloads
 *   npm run gen:wonder-photos -- --only=FRA,BRA      # just these countries (pilot)
 *   npm run gen:wonder-photos                         # source every missing photo
 *   npm run gen:wonder-photos -- --force             # re-source even if a photo exists
 *   npm run gen:wonder-photos -- --no-vision         # skip the AI filter (rely on the human glance)
 *   npm run gen:wonder-photos -- --model=anthropic/claude-3-5-sonnet
 */
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { COUNTRIES } from "../src/data/countries";
import { COUNTRY_CONTENT } from "../src/data/countryContent";
import {
  buildSearchQuery,
  toWonderPhoto,
  extForMime,
  scoreCandidate,
  type CommonsImageInfo,
  type WonderPhoto,
} from "../src/lib/wikimedia";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../public/wonders");
const manifestPath = resolve(here, "../src/data/wonderPhotos.json");

const SLOTS = ["landmark", "animal", "food"] as const;
type Slot = (typeof SLOTS)[number];

// --- args -------------------------------------------------------------------
const args = process.argv.slice(2);
const has = (f: string) => args.includes(f);
const val = (f: string) => args.find((a) => a.startsWith(`${f}=`))?.split("=")[1];

const DRY_RUN = has("--dry-run");
const FORCE = has("--force");
const NO_VISION = has("--no-vision");
// A current, strong vision model via the Gateway; override with --model=… if
// your account exposes a different slug.
const MODEL = val("--model") ?? "anthropic/claude-sonnet-4.6";
const ONLY = val("--only")?.split(",").map((c) => c.trim().toUpperCase());
const CANDIDATES = Number(val("--candidates") ?? "6");
// Wikimedia rate-limits bursts; pause between calls (override with --throttle=ms).
const THROTTLE = Number(val("--throttle") ?? "800");

const UA = "WorldCupExplorer/1.0 (kids learning app; wonder photo sourcing)";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with a friendly UA and exponential backoff on 429 (rate limit). */
async function httpGet(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 429 && attempt < 5) {
    const wait = 1000 * 2 ** attempt;
    console.log(`      … rate-limited, waiting ${wait}ms then retrying`);
    await sleep(wait);
    return httpGet(url, attempt + 1);
  }
  return res;
}

// --- Wikimedia Commons ------------------------------------------------------
interface CommonsPage {
  title: string;
  imageinfo?: (CommonsImageInfo & { thumburl?: string })[];
}

/**
 * Search Commons for free still-photo candidates of `query`, ranked best-first
 * by how well each title fits `subject` (junk titles — maps/screenshots/logos —
 * are dropped). This is what keeps a `--no-vision` run from picking a satellite
 * map or a board-game screenshot.
 */
async function searchCommons(
  query: string,
  subject: string,
): Promise<
  { info: CommonsImageInfo; thumburl: string; attribution: Omit<WonderPhoto, "file"> }[]
> {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6", // File:
      gsrlimit: String(CANDIDATES),
      prop: "imageinfo",
      iiprop: "url|mime|extmetadata",
      iiurlwidth: "800", // a committed-friendly thumbnail
    });

  const res = await httpGet(url);
  if (!res.ok) throw new Error(`Commons HTTP ${res.status}`);
  const json = (await res.json()) as { query?: { pages?: Record<string, CommonsPage> } };
  const pages = Object.values(json.query?.pages ?? {});

  const out: { info: CommonsImageInfo; thumburl: string; attribution: Omit<WonderPhoto, "file"> }[] = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    const attribution = toWonderPhoto(info);
    if (!attribution) continue; // wrong mime / non-free / restricted
    const thumburl = (info as { thumburl?: string }).thumburl ?? info.url;
    if (!thumburl) continue;
    out.push({ info, thumburl, attribution: { ...attribution, title: attribution.title || p.title } });
  }
  // Drop junk-titled candidates and put the most on-subject ones first.
  return out
    .map((c) => ({ c, score: scoreCandidate(c.attribution.title, subject) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);
}

/** Ask the vision model whether a photo is a clear, kid-safe shot of the subject. */
async function visionApproves(
  bytes: Uint8Array,
  subject: string,
  slot: Slot,
  country: string,
): Promise<{ ok: boolean; reason: string }> {
  const { text } = await generateText({
    model: gateway(MODEL),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `You vet photos for a children's world-atlas app (ages 4–6). ` +
              `Expected subject: "${subject}" — the ${slot} of ${country}. ` +
              `Reply EXACTLY "OK" if the photo clearly and recognisably shows that subject ` +
              `AND is wholly appropriate for young children (no violence, gore, blood, ` +
              `weapons, nudity, suggestive content, distressing imagery, or busy text/meme overlays). ` +
              `Otherwise reply "REJECT: <short reason>".`,
          },
          { type: "image", image: bytes },
        ],
      },
    ],
  });
  const t = text.trim();
  return { ok: /^ok\b/i.test(t), reason: t };
}

async function download(url: string): Promise<Uint8Array> {
  const res = await httpGet(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

// --- main -------------------------------------------------------------------
const manifest: Record<string, WonderPhoto> = existsSync(manifestPath)
  ? (JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, WonderPhoto>)
  : {};

const countries = COUNTRIES.filter((c) => COUNTRY_CONTENT[c.code]).filter(
  (c) => !ONLY || ONLY.includes(c.code),
);

let sourced = 0;
let skipped = 0;
let missed = 0;

for (const country of countries) {
  const wonders = COUNTRY_CONTENT[country.code].wonders;
  for (const slot of SLOTS) {
    const key = `${country.code.toLowerCase()}-${slot}`;
    if (manifest[key] && !FORCE) {
      skipped++;
      continue;
    }
    const wonder = wonders[slot];
    const query = buildSearchQuery(wonder.name);

    // Be a good Commons citizen — pace the requests to avoid 429s.
    await sleep(THROTTLE);

    try {
      const candidates = await searchCommons(query, wonder.name);
      if (candidates.length === 0) {
        console.warn(`  ✗ ${key}: no free candidate for "${query}"`);
        missed++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  • ${key} "${query}" → ${candidates.length} candidate(s):`);
        for (const c of candidates) console.log(`      - ${c.attribution.title} [${c.attribution.license}]`);
        continue;
      }

      // Pick the first candidate that passes the vision check (or the first at
      // all when --no-vision; the human contact-sheet glance is the gate then).
      let chosen: (typeof candidates)[number] | null = null;
      let chosenBytes: Uint8Array | null = null;
      for (const c of candidates) {
        const bytes = await download(c.thumburl);
        if (NO_VISION) {
          chosen = c;
          chosenBytes = bytes;
          break;
        }
        const verdict = await visionApproves(bytes, wonder.name, slot, country.name);
        if (verdict.ok) {
          chosen = c;
          chosenBytes = bytes;
          break;
        }
        console.log(`      ~ skipped a ${key} candidate: ${verdict.reason}`);
      }

      if (!chosen || !chosenBytes) {
        console.warn(`  ✗ ${key}: no candidate passed vetting`);
        missed++;
        continue;
      }

      const ext = extForMime(chosen.info.mime);
      const file = `${key}.${ext}`;
      writeFileSync(resolve(outDir, file), chosenBytes);
      manifest[key] = { file, ...chosen.attribution };
      sourced++;
      console.log(`  ✓ ${key}: ${chosen.attribution.title} [${chosen.attribution.license}]`);
    } catch (err) {
      console.error(`  ! ${key}: ${err instanceof Error ? err.message : String(err)}`);
      missed++;
    }
  }
}

if (!DRY_RUN) {
  // Keep the manifest stable + diffable: sort keys.
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
}

console.log(
  DRY_RUN
    ? "\nDry run complete — no images downloaded, no manifest written."
    : `\nDone. Sourced ${sourced}, skipped ${skipped} existing, ${missed} unresolved.\n` +
        (missed > 0
          ? "Some were unresolved (often a Wikimedia rate limit). Just re-run the " +
            "same command — the manifest is incremental, so it only retries the gaps.\n"
          : "") +
        "Review them at /wonders-sheet before committing public/wonders + src/data/wonderPhotos.json.",
);
