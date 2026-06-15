/**
 * Wonder illustration generator (ADR-0004, issue #23).
 *
 * Generates one children's-atlas illustration per Wonder (landmark / animal /
 * food) for every Country, and writes them to `public/wonders/<code>-<slot>.png`
 * — the exact convention the app loads by, with the emoji as the live fallback
 * until a picture exists. This is an AUTHORING-time tool: nothing here ships in
 * the app bundle, mirroring the Content Guardian pipeline (ADR-0002).
 *
 * Images are made via the AI SDK through the Vercel AI Gateway, so the provider
 * is a one-string swap and you only need a single key on your existing Vercel
 * account:
 *
 *   AI_GATEWAY_API_KEY=...   (https://vercel.com/docs/ai-gateway)
 *
 * Usage:
 *   npm run gen:wonders -- --dry-run         # write the prompt manifest only, no API calls
 *   npm run gen:wonders                       # generate every missing image
 *   npm run gen:wonders -- --only=FRA,BRA     # just these countries (great for a pilot)
 *   npm run gen:wonders -- --force            # re-generate even if the PNG exists
 *   npm run gen:wonders -- --model=openai/gpt-image-1.5
 *
 * After a run, eyeball the contact sheet (`npm run dev` → /wonders-sheet) before
 * committing the PNGs — the one human pass that stands in for pixel review.
 */
import { experimental_generateImage as generateImage } from "ai";
import { gateway, type GatewayImageModelId } from "@ai-sdk/gateway";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { COUNTRIES } from "../src/data/countries";
import { COUNTRY_CONTENT } from "../src/data/countryContent";
import type { Wonder } from "../src/types";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../public/wonders");

const SLOTS = ["landmark", "animal", "food"] as const;
type Slot = (typeof SLOTS)[number];

// --- args -------------------------------------------------------------------
const args = process.argv.slice(2);
const has = (f: string) => args.includes(f);
const val = (f: string) => args.find((a) => a.startsWith(`${f}=`))?.split("=")[1];

const DRY_RUN = has("--dry-run");
const FORCE = has("--force");
const MODEL = (val("--model") ?? "openai/gpt-image-1") as GatewayImageModelId;
const SIZE = val("--size") ?? "1024x1024";
const ONLY = val("--only")
  ?.split(",")
  .map((c) => c.trim().toUpperCase())
  .filter(Boolean);

const nameByCode = new Map(COUNTRIES.map((c) => [c.code, c.name]));

/**
 * The one shared visual identity for every illustration — refined, calm, and
 * atlas-like (PRODUCT.md / DESIGN.md), never photo-realistic or sticker-bright.
 * Deliberately forbids text and flags so the set stays clean and consistent.
 */
const STYLE = [
  "A warm, refined children's-atlas illustration.",
  "Soft flat shapes with gentle shading, calm jewel-tone colours,",
  "on a clean, cool near-white background.",
  "A single friendly subject, centered, with a soft shadow.",
  "Storybook feel — not photo-realistic, not cartoonish, not scary.",
  "No text, no letters, no words, no captions, no flags, no watermark, no border.",
].join(" ");

function promptFor(countryName: string, slot: Slot, wonder: Wonder): string {
  const lead =
    slot === "food"
      ? `${wonder.name}, a food from ${countryName}`
      : slot === "animal"
        ? `${wonder.name}, an animal of ${countryName}`
        : `${wonder.name}, a landmark in ${countryName}`;
  // The enriched blurb gives the model accurate, kid-safe context.
  return `${lead}. ${wonder.blurb.enriched} ${STYLE}`;
}

interface Job {
  file: string;
  code: string;
  slot: Slot;
  name: string;
  prompt: string;
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  for (const [code, content] of Object.entries(COUNTRY_CONTENT)) {
    if (ONLY && !ONLY.includes(code)) continue;
    const countryName = nameByCode.get(code) ?? code;
    for (const slot of SLOTS) {
      const wonder = content.wonders[slot];
      jobs.push({
        file: `${code.toLowerCase()}-${slot}.png`,
        code,
        slot,
        name: wonder.name,
        prompt: promptFor(countryName, slot, wonder),
      });
    }
  }
  return jobs;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const jobs = buildJobs();

  // Always (re)write the manifest — the record of every prompt, for review and
  // reproducibility.
  writeFileSync(resolve(outDir, "manifest.json"), JSON.stringify(jobs, null, 2) + "\n");
  console.log(`Manifest: ${jobs.length} wonder images across ${new Set(jobs.map((j) => j.code)).size} countries.`);

  if (DRY_RUN) {
    console.log("Dry run — manifest written, no images generated.");
    return;
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error(
      "\nMissing AI_GATEWAY_API_KEY. Add it to your environment (or .env.local) —\n" +
        "see https://vercel.com/docs/ai-gateway — then re-run. (Use --dry-run to\n" +
        "preview the prompts without a key.)",
    );
    process.exit(1);
  }

  let made = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const job of jobs) {
    const outPath = resolve(outDir, job.file);
    if (!FORCE && existsSync(outPath)) {
      skipped++;
      continue;
    }
    try {
      process.stdout.write(`  ${job.file} … `);
      const { images } = await generateImage({
        model: gateway.image(MODEL),
        prompt: job.prompt,
        size: SIZE as `${number}x${number}`,
        n: 1,
      });
      writeFileSync(outPath, images[0].uint8Array);
      made++;
      console.log("ok");
    } catch (err) {
      failed.push(job.file);
      console.log(`FAILED (${(err as Error).message})`);
    }
  }

  console.log(
    `\nDone: ${made} generated, ${skipped} already present, ${failed.length} failed.`,
  );
  if (failed.length) console.log(`  retry these: ${failed.join(", ")}`);
  console.log("Review them at /wonders-sheet (npm run dev) before committing.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
