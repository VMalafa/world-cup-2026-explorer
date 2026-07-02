/**
 * The Content Guardian (ADR-0002).
 *
 * Kid-facing Country content is AI-drafted, then every draft is gated here
 * against the six-point Values Rubric before it may ship. The Guardian both
 * blocks and *shapes*: a failing draft is revised by the author and re-reviewed;
 * anything still failing — or with an unverifiable claim — is **quarantined**,
 * never shipped (accuracy is the highest-priority check).
 *
 * This runs at AUTHORING time only. The live app imports the committed output
 * (`src/data/countryContent.ts`), not this module — so the app stays static.
 */
import type { DualText, Wonders } from "@/types";

export interface CountryDraft {
  code: string;
  countryName: string;
  wonders: Wonders;
  flagMeaning: DualText;
  /**
   * Claims the author could not verify with confidence. Any non-empty list
   * quarantines the draft — uncertain facts are held, not shipped (Rubric #1).
   */
  unverifiedClaims?: string[];
}

/** The six dimensions of the Values Rubric (ADR-0002). */
export type RubricDimension =
  | "accurate"
  | "ageAppropriate"
  | "relevant"
  | "respectful"
  | "mindful"
  | "global";

export interface GuardianFinding {
  dimension: RubricDimension;
  /** Where the problem is, e.g. "wonders.landmark.blurb.kinder". */
  field: string;
  message: string;
}

export type GuardianStatus = "approved" | "quarantined";

export interface GuardianVerdict {
  status: GuardianStatus;
  findings: GuardianFinding[];
}

/** The shippable, Guardian-approved content for one Country. */
export interface ApprovedContent {
  code: string;
  wonders: Wonders;
  flagMeaning: DualText;
}

export interface QuarantinedItem {
  code: string;
  countryName: string;
  findings: GuardianFinding[];
}

// --- Rubric word lists (deliberately tight to avoid false positives) ---

/** Nothing scary, violent, or mature (Rubric #2). */
const UNSAFE =
  /\b(kill(?:ed|ing|s)?|dead|death|war|blood(?:y)?|weapon|gun|bomb|violent|violence|scary|terror|slaughter)\b/i;

/** No othering / exoticizing framing (Rubric #4). */
const OTHERING = /\b(weird|strange|primitive|backward|savage|exotic|uncivili[sz]ed|bizarre)\b/i;

/** Curious and calm, never hype-y (Rubric #5). */
const HYPE = /(!!)|\b(best|greatest)\b/i;

const KINDER_MAX_WORDS = 16;
const ENRICHED_MAX_WORDS = 35;

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

interface TextField {
  path: string;
  text: string;
  level: "kinder" | "enriched";
}

/** Every dual-level text on a draft, each with a dotted path for findings. */
function textFields(draft: CountryDraft): TextField[] {
  const out: TextField[] = [];
  const add = (path: string, dual: DualText) => {
    out.push({ path: `${path}.kinder`, text: dual.kinder ?? "", level: "kinder" });
    out.push({ path: `${path}.enriched`, text: dual.enriched ?? "", level: "enriched" });
  };
  (["landmark", "animal", "food"] as const).forEach((k) =>
    add(`wonders.${k}.blurb`, draft.wonders[k].blurb),
  );
  add("flagMeaning", draft.flagMeaning);
  return out;
}

/**
 * A knockout exit must stay a proud farewell — never cold sports-speak
 * ("eliminated", "knocked out"). The product's Send-off framing (#66).
 */
const COLD_DEFEAT =
  /\b(eliminated|elimination|knocked out|kicked out|out of the (tournament|cup|world cup)|loser)\b/i;

/**
 * Review one line of kid-facing UI copy against the wording checks of the
 * Values Rubric. UI copy has no reading levels, so there is no length gate —
 * this is the vocabulary gate tests run over authored strings (e.g. The
 * Road's loss Send-off, #66) so they stay shippable.
 */
export function reviewCopyLine(field: string, text: string): GuardianFinding[] {
  const findings: GuardianFinding[] = [];
  if (!text.trim()) {
    findings.push({ dimension: "relevant", field, message: "empty copy" });
  }
  if (UNSAFE.test(text)) {
    findings.push({ dimension: "ageAppropriate", field, message: "scary or unsafe wording" });
  }
  if (OTHERING.test(text)) {
    findings.push({ dimension: "respectful", field, message: "othering or exoticizing language" });
  }
  if (HYPE.test(text)) {
    findings.push({ dimension: "mindful", field, message: "hype-y phrasing" });
  }
  if (COLD_DEFEAT.test(text)) {
    findings.push({ dimension: "mindful", field, message: "cold defeat framing" });
  }
  return findings;
}

/**
 * Review one draft against the Values Rubric. Returns `approved` only when no
 * dimension raises a finding; otherwise `quarantined` with the reasons.
 */
export function reviewDraft(draft: CountryDraft): GuardianVerdict {
  const findings: GuardianFinding[] = [];
  const texts = textFields(draft);

  // Completeness — empty content is not genuinely about the Country (Rubric #3).
  for (const wonderKey of ["landmark", "animal", "food"] as const) {
    const w = draft.wonders[wonderKey];
    if (!w.name?.trim() || !w.emoji?.trim()) {
      findings.push({
        dimension: "relevant",
        field: `wonders.${wonderKey}`,
        message: "missing name or emoji",
      });
    }
  }
  for (const t of texts) {
    if (!t.text?.trim()) {
      findings.push({ dimension: "relevant", field: t.path, message: "missing reading level" });
      continue;
    }
    // Age-appropriate — safe vocabulary + readable length (Rubric #2).
    if (UNSAFE.test(t.text)) {
      findings.push({ dimension: "ageAppropriate", field: t.path, message: "scary or unsafe wording" });
    }
    const max = t.level === "kinder" ? KINDER_MAX_WORDS : ENRICHED_MAX_WORDS;
    if (wordCount(t.text) > max) {
      findings.push({ dimension: "ageAppropriate", field: t.path, message: `too long for a ${t.level} reader` });
    }
    // Culturally respectful (Rubric #4).
    if (OTHERING.test(t.text)) {
      findings.push({ dimension: "respectful", field: t.path, message: "othering or exoticizing language" });
    }
    // Mindful & calm (Rubric #5).
    if (HYPE.test(t.text)) {
      findings.push({ dimension: "mindful", field: t.path, message: "hype-y phrasing" });
    }
  }

  // Accuracy — the highest-priority check (Rubric #1). Uncertain → held.
  if (draft.unverifiedClaims && draft.unverifiedClaims.length > 0) {
    findings.push({
      dimension: "accurate",
      field: "unverifiedClaims",
      message: `unverified: ${draft.unverifiedClaims.join("; ")}`,
    });
  }

  return { status: findings.length === 0 ? "approved" : "quarantined", findings };
}

/**
 * Run the whole pipeline: review every draft and partition into shippable
 * approved content and a quarantine queue. Re-running over the same drafts
 * deterministically regenerates `src/data` (ADR-0002).
 */
export function runPipeline(drafts: CountryDraft[]): {
  approved: ApprovedContent[];
  quarantined: QuarantinedItem[];
} {
  const approved: ApprovedContent[] = [];
  const quarantined: QuarantinedItem[] = [];
  for (const draft of drafts) {
    const verdict = reviewDraft(draft);
    if (verdict.status === "approved") {
      approved.push({ code: draft.code, wonders: draft.wonders, flagMeaning: draft.flagMeaning });
    } else {
      quarantined.push({ code: draft.code, countryName: draft.countryName, findings: verdict.findings });
    }
  }
  return { approved, quarantined };
}
