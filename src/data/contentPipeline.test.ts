import { describe, it, expect } from "vitest";

import { runPipeline } from "@/lib/contentGuardian";

import { ALL_DRAFTS, COUNTRY_DRAFTS } from "./countryDrafts";
import { COUNTRY_CONTENT } from "./countryContent";
import { getCountry } from "./countries";
import quarantineJson from "./quarantine.json";

describe("content pipeline output (src/data is the Guardian's output)", () => {
  const { approved, quarantined } = runPipeline(ALL_DRAFTS);

  it("approves every featured-country draft", () => {
    expect(approved.length).toBe(COUNTRY_DRAFTS.length);
  });

  it("committed countryContent.json equals the pipeline's approved output", () => {
    const expected = Object.fromEntries(
      approved.map((a) => [a.code, { wonders: a.wonders, flagMeaning: a.flagMeaning }]),
    );
    expect(COUNTRY_CONTENT).toEqual(expected);
  });

  it("committed quarantine.json equals the held items (documented, not shipped)", () => {
    expect(quarantined.length).toBeGreaterThan(0);
    expect(quarantineJson).toEqual(quarantined);
  });

  it("never ships a quarantined draft as a Country's content", () => {
    for (const held of quarantined) {
      // The Country may still ship a *different*, verified take (e.g. Senegal),
      // but never the exact held draft's content.
      const shipped = COUNTRY_CONTENT[held.code];
      if (shipped) {
        const heldDraft = ALL_DRAFTS.find(
          (d) => d.code === held.code && d.unverifiedClaims?.length,
        );
        expect(shipped.wonders).not.toEqual(heldDraft?.wonders);
      }
    }
  });

  it("surfaces approved Wonders + flag meaning on the Country model", () => {
    const japan = getCountry("JPN")!;
    expect(japan.wonders?.landmark.name).toBe("Mount Fuji");
    expect(japan.flagMeaning?.kinder).toContain("sun");
    // Coverage is now complete (issue #23): every country surfaces content.
    expect(getCountry("BRA")?.wonders?.landmark.name).toBe("Amazon Rainforest");
  });
});
