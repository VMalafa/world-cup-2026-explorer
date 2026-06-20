# Feedback triage & execution plan — 2026-06-20

Source: in-app feedback issues filed during family testing (#33, #44, #45, #46,
#47). Decisions below were resolved in a `grill-with-docs` session; terminology
captured in `CONTEXT.md`, the roster decision in `docs/adr/0008`.

## Triage summary

| # | Type | Verdict | Order |
|---|------|---------|-------|
| #46 | Idea | Speak the Wonder's **name** before its blurb. | 1 |
| #45b | Bug/UX | Clear "you got it!" confirmation on three taps. | 2 |
| #45c | Idea | On-brand color on match cards + the ⚽. | 3 |
| #45a | Bug/UX | Journey fits one screen, then Today. | 4 |
| #44 | Bug | Curate the 10 missing qualified Teams; TBD placeholder. | 5 |
| #47 | Idea | Multilingual "Goodbye & good luck" Send-off after a pick. | 6 |
| #33 | Idea | **Parked** — already decided "skip for now" (deferred **Insight**, branch `feat/team-insights`). No work. | — |

Each item ships as its own branch + PR per the autonomous-build flow. Order is
quick-wins-first, with one hard dependency: **#44 before #47** (the Send-off must
cover every pickable Team, including the 10 added in #44).

---

## 1 · #46 — Speak the Wonder name before the blurb

**Problem:** On a Wonder card reveal, `Stations.tsx:207` auto-reads
`pick(wonder.blurb)` but never speaks `wonder.name`, so a pre-reader hears a
description with no subject.

**Change:** In `WonderCard` (`src/components/Stations.tsx`), make the auto-read
utterance `` `${wonder.name}. ${pick(wonder.blurb)}` ``. Keep the visible
`<p>{wonder.name}</p>` as-is. Verify the same gap doesn't exist in `WonderStage`
(`Journey.tsx`) — its header already shows the name; add it to any auto-read there
if present.

**Acceptance:** Tapping a Wonder reads "Eiffel Tower. It's a tall iron tower…".
**Verify:** load `/journey`, reach a Wonders station, tap a card, confirm the
spoken line leads with the name. **Effort:** XS.

---

## 2 · #45b — Consistent "you got it!" confirmation

**Problem:** Taps don't clearly signal success to a 4–6-year-old. Applies to
**all three** interactive surfaces (confirmed): the Today match card, the
Prediction buttons, the Find-it globe tap.

**Change:** One shared confirmation pattern — a clear pressed/selected state plus
a brief celebratory cue (e.g. a quick scale/✓ pop), with a full
`prefers-reduced-motion` fallback (static state only). Honor DESIGN.md motion
rules (150–250ms ease-out, no bounce/elastic).

- **Match card** (`MatchDashboard.tsx`): on tap, an obvious press + a momentary
  "Opening…" / ✓ state before navigation so the tap visibly registers.
- **Prediction buttons** (`MatchMoment.tsx`): strengthen the active state (already
  `aria-pressed`) with a confirming pop on selection.
- **Find-it** (`Stations.tsx` `FindItStation`): make the correct-tap reveal more
  celebratory (the existing "You found X!" gets a pop / ✨), reduced-motion safe.

**Acceptance:** each of the three taps produces an unmistakable, immediate
positive signal; reduced-motion users get a clear static state.
**Verify:** exercise all three on a phone viewport; toggle reduced motion.
**Effort:** M.

---

## 3 · #45c — More colorful, on-brand (match cards + the ⚽)

**Problem:** Match cards read flat/white; the ⚽ is drab. Must stay within
DESIGN.md (jewel tones, color carries meaning, no rainbow soup / no cream).

**Change (within brand):**
- **Match cards** (`MatchDashboard.tsx`, `.kid-card`): add an on-brand accent —
  e.g. a Unity Ribbon edge/top-band, continent-colored flag rings (DESIGN.md
  already specifies continent rings on selection), and a subtle brand tint —
  without nesting cards or adding cream.
- **The ⚽** (header float in `page.tsx`, and the Match-moment ⚽): a livelier,
  on-brand treatment (brand-gradient/Unity accent and/or playful motion), not a
  literal primary-bright ball.

**Acceptance:** Today + match cards feel warmer and more festive while still
passing the DESIGN.md "bans honored" checklist; WCAG AA preserved.
**Verify:** visual pass at 360–440px; re-check no horizontal overflow, contrast.
**Effort:** M. (Iterate live; propose specifics before finalizing.)

---

## 4 · #45a — Fit on one screen (Journey first, then Today)

**Problem:** Too much vertical stacking; a young child must scroll/hunt for core
content and the next action. Reported at 440×416.

**Change:**
- **Journey** (`Journey.tsx`): make the globe + active **Station** + the
  Back/Next control reachable without hunting. Options: shrink the globe (44vh →
  smaller) when a station needs room, keep Next within reach (sticky or tighter
  rhythm), reduce vertical gaps. Don't break the globe-as-spine model.
- **Today** (`page.tsx`): lighter density pass so the primary CTA + a match are
  visible at a glance.

**Acceptance:** on a standard phone portrait, the Journey's core (globe + station
+ Next) is usable without scrolling to find the action; degrades gracefully on
short viewports. **Verify:** measure on real iPhone-class viewports.
**Effort:** M.

---

## 5 · #44 — Curate the 10 missing qualified Teams (+ TBD placeholder)

**Problem:** `teams.ts` is a sample roster; 10 real qualified Teams have no
learning data, so **62 of 104 fixtures can't open a journey**. Decision (ADR-0008):
**add** the 10 real Teams, keep the rest; full content parity; photos backfilled.

**The 10 to add:** `BIH` (Bosnia & Herzegovina), `COD` (DR Congo), `CPV` (Cape
Verde), `CUW` (Curaçao), `CZE` (Czechia), `HAI` (Haiti), `IRQ` (Iraq), `JOR`
(Jordan), `SWE` (Sweden), `TUR` (Türkiye).

**Per team (full parity with existing 48):**
1. **Team** entry in `src/data/teams.ts`: `code, name, flag (emoji), iso2,
   capital, continent, lat, lng, group, hello, funFacts`. (`group` is cosmetic —
   Standings derive from `match.group`, `JourneyClient.tsx:53` — but set the real
   group for tidiness.)
2. **Draft** in `src/data/countryDrafts.ts`: `wonders` (landmark/animal/food with
   name + emoji + DualText blurb) + `flagMeaning`. Run `npm run author:content` so
   the **Content Guardian** (ADR-0002) gates it into `countryContent.json`;
   `contentPipeline.test.ts` must pass.
3. **Language** entry in `src/data/languages.ts` for read-aloud (`hello` + lang).
4. **Wonder photos** — backfill via the ADR-0007 pipeline (Wikimedia + AI-vision
   + `/wonders-sheet` glance). Emoji fallback until sourced; not a ship blocker.

**TBD knockout slots:** in `MatchDashboard.tsx` (and the `Side`/card path), detect
a `TBD` (or non-curated) side and render a friendly non-clickable card —
"🏆 To be decided — this match fills in after the group stage. Check back soon!" —
instead of the 🏳️/"TBD" dead card. It auto-upgrades to a normal journey once both
sides resolve (which they now will, since all real Teams are curated).

**Acceptance:** every real group-stage fixture opens a journey; TBD knockout
fixtures show the friendly placeholder; all 10 new Countries have Guardian-passed
content + language; tests green. **Verify:** browse the date strip across the
group stage — no dead cards; spot-check 2–3 new-team journeys end to end.
**Effort:** L (content-heavy; the tooling exists).

---

## 6 · #47 — Multilingual "Goodbye & good luck" Send-off

**Problem:** After picking a winner, nothing wishes the team well. Depends on #44
(must cover every pickable Team).

**Change:**
- **Content:** author one combined farewell phrase ("Goodbye and good luck!") per
  language — native script + English gloss — alongside the existing `hello` data
  (basic factual phrase, same tier as greetings; covers all ~58 Teams). Decide
  per-language vs per-country to mirror how `hello`/`langFor` already work.
- **UI** (`MatchMoment.tsx`): after a pick, render the farewell with
  `SpeakableText autoRead lang={langFor(pickedCode)}` (same path as
  `SayHelloStation`). Show native + gloss.
- **Tie:** when `pick === DRAW`, wish **both** teams luck, in **both** languages
  (two `SpeakableText` lines, each in its team's lang).

**Acceptance:** picking a team auto-reads the farewell in that team's language
with a visible gloss; picking a tie does both. **Verify:** pick each option in a
Match moment; confirm correct language + read-aloud. **Effort:** M.

---

## Dependency & sequencing notes

- **#44 → #47**: author the Send-off content after the 10 Teams exist so every
  pickable Team is covered.
- #46, #45a/b/c are independent and can land in any order before #44.
- #33 stays parked; revisit only with a curated, verified per-Team facts source
  (per CONTEXT.md **Insight** + closed PR #38).

## Cross-cutting guardrails

- DESIGN.md "bans honored" + WCAG AA on every visual change (#45a/b/c).
- All new Country content passes the **Content Guardian** (ADR-0002); photos via
  ADR-0007. Nothing author-time ships in the live bundle.
- Reduced-motion fallbacks for every new animation.
