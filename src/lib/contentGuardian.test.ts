import { describe, it, expect } from "vitest";

import { reviewDraft, runPipeline, type CountryDraft } from "./contentGuardian";

/** A clean, rubric-passing draft we can perturb per test. */
function validDraft(overrides: Partial<CountryDraft> = {}): CountryDraft {
  return {
    code: "JPN",
    countryName: "Japan",
    wonders: {
      landmark: {
        name: "Mount Fuji",
        emoji: "🗻",
        blurb: {
          kinder: "Mount Fuji is a big, snowy mountain.",
          enriched: "Mount Fuji is Japan's tallest mountain, capped with snow for much of the year.",
        },
      },
      animal: {
        name: "Snow Monkey",
        emoji: "🐒",
        blurb: {
          kinder: "Snow monkeys warm up in hot pools.",
          enriched: "Japan's snow monkeys keep cosy by bathing in steamy mountain hot springs.",
        },
      },
      food: {
        name: "Sushi",
        emoji: "🍣",
        blurb: {
          kinder: "Sushi is rice with fish or veggies.",
          enriched: "Sushi pairs seasoned rice with fish or vegetables, often rolled in seaweed.",
        },
      },
    },
    flagMeaning: {
      kinder: "A red circle for the sun on white.",
      enriched: "Japan's flag shows a red sun circle, giving the country its 'land of the rising sun' name.",
    },
    ...overrides,
  };
}

describe("reviewDraft — the Values Rubric gate", () => {
  it("approves a clean, well-formed draft", () => {
    const v = reviewDraft(validDraft());
    expect(v.status).toBe("approved");
    expect(v.findings).toEqual([]);
  });

  it("quarantines a draft missing a reading level", () => {
    const draft = validDraft();
    draft.wonders.landmark.blurb.kinder = "";
    const v = reviewDraft(draft);
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.field.includes("landmark"))).toBe(true);
  });

  it("quarantines unsafe / scary words (age-appropriate)", () => {
    const draft = validDraft();
    draft.wonders.animal.blurb.enriched = "The animal was killed in a bloody war.";
    const v = reviewDraft(draft);
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.dimension === "ageAppropriate")).toBe(true);
  });

  it("quarantines a kinder blurb that is too long for a little reader", () => {
    const draft = validDraft();
    draft.wonders.food.blurb.kinder =
      "This is a very long sentence that goes on and on with far too many words for a tiny reader to follow easily at all";
    const v = reviewDraft(draft);
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.dimension === "ageAppropriate")).toBe(true);
  });

  it("quarantines othering language (culturally respectful)", () => {
    const draft = validDraft();
    draft.wonders.food.blurb.enriched = "Sushi is a weird, exotic foreign food.";
    const v = reviewDraft(draft);
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.dimension === "respectful")).toBe(true);
  });

  it("quarantines hype-y phrasing (mindful & calm)", () => {
    const draft = validDraft();
    draft.wonders.landmark.blurb.enriched = "It is the best mountain in the whole world!!";
    const v = reviewDraft(draft);
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.dimension === "mindful")).toBe(true);
  });

  it("quarantines any draft with an unverified claim (accuracy first)", () => {
    const v = reviewDraft(validDraft({ unverifiedClaims: ["tallest in Asia?"] }));
    expect(v.status).toBe("quarantined");
    expect(v.findings.some((f) => f.dimension === "accurate")).toBe(true);
  });
});

describe("runPipeline", () => {
  it("partitions drafts into approved content and a quarantine queue", () => {
    const good = validDraft({ code: "JPN" });
    const held = validDraft({ code: "ESP", unverifiedClaims: ["unsure"] });

    const { approved, quarantined } = runPipeline([good, held]);

    expect(approved.map((a) => a.code)).toEqual(["JPN"]);
    expect(approved[0].wonders).toBeDefined();
    expect(approved[0].flagMeaning).toBeDefined();
    expect(quarantined.map((q) => q.code)).toEqual(["ESP"]);
    expect(quarantined[0].findings.length).toBeGreaterThan(0);
  });
});
