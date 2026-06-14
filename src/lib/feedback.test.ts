import { describe, expect, it } from "vitest";

import {
  buildFeedbackIssue,
  MESSAGE_MAX,
  validateFeedback,
  type ValidFeedback,
} from "./feedback";

describe("validateFeedback", () => {
  it("accepts a valid message + category and trims whitespace", () => {
    const r = validateFeedback({ message: "  the map is great  ", category: "love" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.message).toBe("the map is great");
      expect(r.value.category).toBe("love");
    }
  });

  it("rejects empty / too-short messages", () => {
    expect(validateFeedback({ message: "", category: "bug" }).ok).toBe(false);
    expect(validateFeedback({ message: " a ", category: "bug" }).ok).toBe(false);
  });

  it("rejects messages over the max length", () => {
    const long = "x".repeat(MESSAGE_MAX + 1);
    expect(validateFeedback({ message: long, category: "idea" }).ok).toBe(false);
  });

  it("rejects an unknown category", () => {
    expect(validateFeedback({ message: "hello there", category: "rant" }).ok).toBe(false);
  });
});

describe("buildFeedbackIssue", () => {
  const base: ValidFeedback = {
    message: "I love the new world map!",
    category: "love",
    page: "/world",
    viewport: "390×844",
    userAgent: "Mozilla/5.0 (iPhone)",
    submittedAt: "2026-06-14T12:00:00.000Z",
  };

  it("titles with the category emoji + label and a short summary", () => {
    const issue = buildFeedbackIssue(base);
    expect(issue.title).toBe("[😍 Love it] I love the new world map!");
  });

  it("truncates a long message in the title", () => {
    const issue = buildFeedbackIssue({ ...base, message: "word ".repeat(40).trim() });
    expect(issue.title.length).toBeLessThanOrEqual(80);
    expect(issue.title).toContain("…");
  });

  it("fences the message so it cannot inject Markdown", () => {
    const issue = buildFeedbackIssue({ ...base, message: "```js\nalert(1)\n```" });
    // The user's backticks are neutralised; our own fence wraps the content.
    expect(issue.body).toContain("```text");
    expect(issue.body).not.toContain("```js");
  });

  it("includes the captured context and omits blanks", () => {
    const issue = buildFeedbackIssue({ ...base, viewport: undefined });
    expect(issue.body).toContain("- **Page:** /world");
    expect(issue.body).toContain("- **Device:** Mozilla/5.0 (iPhone)");
    expect(issue.body).toContain("- **When:** 2026-06-14T12:00:00.000Z");
    expect(issue.body).not.toContain("Viewport");
  });

  it("labels with feedback + the category", () => {
    expect(buildFeedbackIssue(base).labels).toEqual(["feedback", "feedback:love"]);
  });
});
