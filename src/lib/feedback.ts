/**
 * Feedback → GitHub Issue: the pure, I/O-free core.
 *
 * Both the API route and the tests share these functions. Keeping validation
 * and issue-shaping here (away from `fetch`) means the server route stays a thin
 * shell and the interesting logic is unit-tested.
 */

export type FeedbackCategory = "love" | "bug" | "idea";

/** The three kid-facing categories: emoji for the chips, label for triage. */
export const FEEDBACK_CATEGORIES: ReadonlyArray<{
  key: FeedbackCategory;
  emoji: string;
  label: string;
}> = [
  { key: "love", emoji: "😍", label: "Love it" },
  { key: "bug", emoji: "🐛", label: "Something broke" },
  { key: "idea", emoji: "💡", label: "Idea" },
];

const CATEGORY_BY_KEY = new Map(FEEDBACK_CATEGORIES.map((c) => [c.key, c]));

export const MESSAGE_MIN = 2;
export const MESSAGE_MAX = 1000;

/** Raw, untrusted feedback as it arrives from the client. */
export interface FeedbackInput {
  message: string;
  category: string;
  /** App route the sender was on, e.g. "/world". */
  page?: string;
  /** Browser viewport, e.g. "390×844". */
  viewport?: string;
  /** Server-derived from the request User-Agent header. */
  userAgent?: string;
  /** ISO-8601 UTC timestamp. Passed in (clocks are not available in pure code). */
  submittedAt?: string;
}

/** A validated, trimmed, well-typed feedback payload. */
export interface ValidFeedback extends FeedbackInput {
  message: string;
  category: FeedbackCategory;
}

export type ValidationResult =
  | { ok: true; value: ValidFeedback }
  | { ok: false; error: string };

/**
 * Validate untrusted input. Trims the message, bounds its length, and confirms
 * the category is one we know. Returns a typed value or a human error string.
 */
export function validateFeedback(input: FeedbackInput): ValidationResult {
  const message = (input.message ?? "").trim();

  if (message.length < MESSAGE_MIN) {
    return { ok: false, error: "Please write a little more." };
  }
  if (message.length > MESSAGE_MAX) {
    return { ok: false, error: `Please keep it under ${MESSAGE_MAX} characters.` };
  }
  if (!CATEGORY_BY_KEY.has(input.category as FeedbackCategory)) {
    return { ok: false, error: "Unknown feedback category." };
  }

  return {
    ok: true,
    value: { ...input, message, category: input.category as FeedbackCategory },
  };
}

/** Shorten to `max` chars on a word boundary where possible, adding an ellipsis. */
function truncate(text: string, max: number): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  const slice = oneLine.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

/** Close any ``` runs in user text so the message can't break out of its fence. */
function fence(text: string): string {
  const safe = text.replace(/```/g, "ʼʼʼ");
  return ["```text", safe, "```"].join("\n");
}

export interface GithubIssue {
  title: string;
  body: string;
  labels: string[];
}

/**
 * Shape a validated feedback into a GitHub issue. The message is fenced so it
 * cannot inject Markdown/HTML into the issue body; an auto-captured Context
 * section follows.
 */
export function buildFeedbackIssue(value: ValidFeedback): GithubIssue {
  const cat = CATEGORY_BY_KEY.get(value.category)!;

  const context: Array<[string, string | undefined]> = [
    ["Page", value.page],
    ["Viewport", value.viewport],
    ["Device", value.userAgent],
    ["When", value.submittedAt],
  ];
  const contextLines = context
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `- **${k}:** ${v}`);

  const body = [
    fence(value.message),
    "",
    "---",
    "### Context",
    ...(contextLines.length ? contextLines : ["- _(none captured)_"]),
    "",
    "_Filed automatically from the in-app feedback button._",
  ].join("\n");

  return {
    title: `[${cat.emoji} ${cat.label}] ${truncate(value.message, 60)}`,
    body,
    labels: ["feedback", `feedback:${value.category}`],
  };
}
