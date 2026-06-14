# Feedback → GitHub Issue

**Date:** 2026-06-14
**Status:** Approved

## Goal

A kid-friendly "Tell us!" button on every screen. When a child or grown-up sends
feedback, the app automatically opens a GitHub Issue in the project repo — no
email, no copy-paste, no account needed by the sender.

## Architecture

Three units, each independently understandable and testable.

### 1. `src/lib/feedback.ts` — pure logic (no I/O)

- `FEEDBACK_CATEGORIES` — the three kid categories with emoji + issue label:
  - `love` 😍 "Love it"
  - `bug` 🐛 "Something broke"
  - `idea` 💡 "Idea"
- `validateFeedback(input): { ok: true; value } | { ok: false; error }`
  - `message`: trimmed, 2–1000 chars.
  - `category`: must be one of the three keys.
- `buildFeedbackIssue(input): { title; body; labels }`
  - `title`: `"[<emoji> <Label>] <first ~60 chars of message>"`.
  - `body`: the message inside a fenced block (so it can't inject Markdown into
    the issue), followed by an auto-captured **Context** section:
    page/route, device + viewport, UTC timestamp.
  - `labels`: `["feedback", "feedback:<category>"]`. GitHub auto-creates missing
    labels on issue creation.

### 2. `src/app/api/feedback/route.ts` — server (thin shell)

- `POST` handler. Reads JSON body `{ message, category, page, viewport }`.
- Validates with `validateFeedback`; 400 on failure.
- Reads device from the request `user-agent` header (server-side, reliable).
- Builds the issue with `buildFeedbackIssue`.
- Calls GitHub REST `POST /repos/{owner}/{repo}/issues` with
  `Authorization: Bearer ${GITHUB_FEEDBACK_TOKEN}`.
- Returns `{ ok: true, url }` (201) or a typed error.
- **Graceful degradation:** if `GITHUB_FEEDBACK_TOKEN` is absent, returns
  `503 { ok: false, reason: "not_configured" }` — never a crash.
- `export const dynamic = "force-dynamic"` (matches `api/matches`).

### 3. `src/components/FeedbackButton.tsx` — client

- A floating pill button "💬 Tell us!" fixed bottom-right, clear of the centered
  `SurfaceNav` and the safe-area inset.
- Opens a dialog (mirrors `ProfilePicker`: `role="dialog"`, `aria-modal`, Escape
  to close, reduced-motion aware) using the `kid-card` / `kid-btn` system.
- Contents: three emoji **category chips**, one big **textarea**, a chunky
  **Send** button.
- Captures `page` via `usePathname()` and `viewport` via `window.innerWidth/Height`.
- States: idle → sending → success ("Thanks! 🎉" with issue link for grown-ups)
  → or gentle error ("Couldn't send — try again."). The `not_configured` reason
  shows a friendly "Saved-ish" message rather than an error.
- Mounted once in `src/app/layout.tsx` so it appears on every surface.

## Data flow

```
FeedbackButton (client)
  └─ POST /api/feedback { message, category, page, viewport }
       └─ validateFeedback → buildFeedbackIssue (+ UA from header)
            └─ GitHub POST /repos/{owner}/{repo}/issues
       ◀─ { ok, url }
```

## Configuration (set once in Vercel)

| Env var | Purpose | Default |
| --- | --- | --- |
| `GITHUB_FEEDBACK_TOKEN` | Fine-grained PAT, *Issues: Read & Write* on the repo | — (button degrades if unset) |
| `GITHUB_FEEDBACK_REPO` | `owner/repo` to file issues in | `VMalafa/world-cup-2026-explorer` |

Both are **server-only** (no `NEXT_PUBLIC_`), like `USE_LIVE_DATA`.

## Captured per-issue

Page/route, device + viewport, UTC timestamp. **Not** the active kid profile name
— keeps public issues clean and privacy-respecting.

## Testing

- `src/lib/feedback.test.ts` (vitest, matches repo style):
  - `validateFeedback`: rejects empty / too-short / too-long / unknown category;
    accepts valid; trims.
  - `buildFeedbackIssue`: title format & truncation; message is fenced; context
    section present; labels correct.
- The route stays a thin shell around the tested pure functions.

## Known tradeoffs (YAGNI)

- **No rate-limiting.** Personal/family app; acceptable. Length caps + Markdown
  fencing are the only abuse guards.
- **No profile attribution** by design (privacy).
- **No spam captcha.** Revisit only if abused.
