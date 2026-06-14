import { NextResponse } from "next/server";

import { buildFeedbackIssue, validateFeedback } from "@/lib/feedback";

/**
 * Feedback endpoint — turns an in-app message into a GitHub Issue.
 *
 * The browser can't safely hold a GitHub token, so issue creation runs here with
 * a server-only fine-grained PAT. If the token is absent the route degrades
 * gracefully (503 "not_configured") and the button shows a friendly message
 * rather than crashing — same zero-setup philosophy as the matches route.
 *
 * Config (server-only, no NEXT_PUBLIC_):
 *   GITHUB_FEEDBACK_TOKEN  — fine-grained PAT, Issues: Read & Write on the repo
 *   GITHUB_FEEDBACK_REPO   — "owner/repo" (defaults to this project's repo)
 */

export const dynamic = "force-dynamic";

const DEFAULT_REPO = "VMalafa/world-cup-2026-explorer";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const result = validateFeedback({
    message: typeof body.message === "string" ? body.message : "",
    category: typeof body.category === "string" ? body.category : "",
    page: typeof body.page === "string" ? body.page : undefined,
    viewport: typeof body.viewport === "string" ? body.viewport : undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    submittedAt: new Date().toISOString(),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  const repo = process.env.GITHUB_FEEDBACK_REPO || DEFAULT_REPO;

  // No token wired in → tell the client so it can show a gentle message.
  if (!token) {
    console.warn("[api/feedback] GITHUB_FEEDBACK_TOKEN not set; issue not created.");
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const issue = buildFeedbackIssue(result.value);

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[api/feedback] GitHub ${res.status}: ${detail}`);
      return NextResponse.json(
        { ok: false, error: "Could not file the issue." },
        { status: 502 },
      );
    }

    const created = (await res.json()) as { html_url?: string; number?: number };
    return NextResponse.json(
      { ok: true, url: created.html_url, number: created.number },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/feedback] request failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not reach GitHub." },
      { status: 502 },
    );
  }
}
