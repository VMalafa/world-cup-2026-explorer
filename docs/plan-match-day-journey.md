# Plan — The Match Day Journey

The rethink from the 2026-06-14 grilling session. Turns the app from a passive
scoreboard with disconnected side-tabs into a daily, geography-first learning
ritual driven by the day's match. Terms are defined in [CONTEXT.md](../CONTEXT.md);
the load-bearing decisions are in [docs/adr](./adr).

## The shape (what we agreed)

- The **Match of the Day** is the hub. Tapping it opens a guided, finishable
  **Match Day Journey** that teaches the two **Countries** playing — geography
  first, with the **Globe** as the spine, anchored to the four **Homelands**.
- The journey is a short ordered sequence of **Stations**, usable by a non-reader
  via **read-aloud** (Web Speech — ADR-0001) and tapping.
- Finishing earns a **Stamp** per Country into a per-**Profile** **Passport**
  (local-first storage — ADR-0003). Two local profiles (Ava 🦉 / Kai 🐣).
- Richer Country content is AI-authored and gated by the **Content Guardian**
  against the six-point **Values Rubric** (ADR-0002). Geography is *derived* from
  existing lat/lng, not authored.
- Nav collapses from five tabs to two surfaces: **Today** + **World**. Compare /
  Heroes / Facts disappear as tabs; their value is absorbed into the journey.
- A **Prediction** (predict→result) wraps the match in time, but **stamps are
  earned from learning, never from watching**.

## v1 — the tracer bullet (one vertical slice)

Smallest thing that proves the whole loop with the real kids:

Profile pick → Today shows the Match of the Day → journey over both Countries on
the Globe spine with **3 stations** (Find it, Say hello, Wonders ×3), every line
read aloud → Match moment with a Prediction → finish drops a Stamp per Country
into the Passport → World shows the globe + stamps. Content only for the
countries in the first ~week of featured matches.

### Milestones

- **M1 — The loop exists.** Profile picker + storage seam + passport state; Today
  surfaces the Match of the Day; a minimal one-station journey that finishes and
  drops a stamp; World shows it. Demoable end-to-end (issues #1, #2, #7, #8).
- **M2 — The journey teaches.** Enriched Country model + content pipeline; the
  three real stations; read-aloud everywhere; globe spine (issues #3, #4, #5, #6).
- **M3 — The ritual closes.** Match moment + Prediction; nav restructure; a
  minimal followable fixtures list (issues #9, #10).

## v1.1 — the enhancement pass (from 2026-06-15 feedback, issues #28–#33)

Resolved in a grilling session against the live kids' feedback. Decisions are in
the new ADRs; terms (**Standings**, **Insight**) are in [CONTEXT.md](../CONTEXT.md).

- **Live-first data, never-fake fallback (ADR-0005).** Corrected premise:
  football-data.org is *already* live in production. #32 ("Brazil vs Tunisia") and
  #30 ("can't explore Spain") were the **same bug** — the route silently falls back
  to the synthetic `buildSchedule()` (which invents fixtures) when the live fetch
  hiccups. Fix: keep live as primary, **remove `buildSchedule()` from the live
  path**, and fall back to a **real cron-committed snapshot** (last-good real data).
  Data is always live → real-snapshot → honest-empty, never fabricated. *This cron
  also powers Standings (#31) and Insight facts (#33).*
- **Every fixture is explorable (#30).** The **Match Day Journey** is no longer
  exclusive to the **Match of the Day** — every match opens its own full journey;
  the Match of the Day is now a ⭐ spotlight, not a gate. Stamps stay one-per-
  Country-ever (already true in code), so the Passport keeps its meaning.
- **Days-ahead + Standings (#31).** A light date strip on Today (today ± a few
  days, each day's fixtures explorable) + the playing group's **Standings** shown
  in-context — no new tab, two-surface minimalism preserved.
- **Better read-aloud (ADR-0001 upgraded; ADR-0006 deferred).** The AI Gateway
  can't do TTS, so pre-generated cloud audio is deferred (needs a separate TTS
  key). The shipped #29 fix upgrades on-device Web Speech: select the best neural
  voice (iOS Siri/Enhanced) instead of the robotic default, and fix the CriOS
  reliability bugs (late voice load, long-line truncation, ~15s pause). Free,
  offline, fixes both "robotic" and "doesn't always work".
- **Wonders are real photos (ADR-0007, supersedes ADR-0004).** Real openly-
  licensed Wikimedia Commons photos, AI-vision + human-glance vetted, emoji
  fallback, required attribution, parent-facing "learn more" link (#28). (The
  ADR-0004 illustrations were never rendered — only a generator + manifest — so
  nothing shipped was lost.)
- **Insights (#33) — deferred.** A results-derived version was built (branch
  `feat/team-insights`, closed PR #38) but skipped: too thin to be worth showing
  (circular before kickoff; the standing duplicated the Standings table). The
  genuinely interesting example facts are historical/editorial and can't be
  auto-verified from results. Revisit only with a curated, verified facts source.

### Build order (dependency-honouring)

1. **Kill the silent synthetic fallback (#32 + #30).** Remove `buildSchedule()`
   from the live path; add the daily cron that commits a real snapshot; route
   serves live → snapshot → honest-empty. Fixes both trust bugs at the root.
2. **All-fixtures-explorable (#30) + date strip (#31a)** — every match clickable
   into a journey; browse days ahead/behind. (Live data already maps team codes,
   so journeys link today.)
3. **Standings (#31b)** — from the provider/snapshot. (Insights #33 deferred —
   see above.)
4. **Wonder photos (#28)** and **natural audio (#29)** — two independent build-
   time content pipelines; parallelisable with the above.

### Source (resolved)

football-data.org is **already wired and live** (`footballData.ts`,
`FOOTBALL_DATA_TOKEN`, `USE_LIVE_DATA=true` in Vercel prod) — competition `WC`,
season 2026, real crests. It is the source for fixtures/results/standings + the
cron snapshot. Wikidata remains a candidate for Insight facts football-data
doesn't carry (e.g. "World Cup debut").

## Deferred (fast-follows, explicitly out of v1)

Post-match "what happened?" beat · "Meet a hero" + flag-quiz stations · recorded
native greetings · full 48-country content backfill · standalone Matches schedule
· Neon cross-device sync (seam ready, see ADR-0003).

## Issue map

1. Profiles + local storage seam + reading level per profile
2. Passport + Stamp data model (on-device)
3. Enrich the Country model (Wonders, flag meaning) + derived-geography helper
4. Content pipeline: AI author → Content Guardian (Values Rubric) → `src/data`
5. Journey shell + Globe spine (Match of the Day → ordered Stations → finish)
6. Read-aloud (`useSpeak` Web Speech hook + audio affordance, graceful fallback)
7. Stations: Find it · Say hello · Wonders
8. World surface + Passport view
9. Match moment + Prediction
10. Nav restructure (Today + World; remove Compare/Heroes/Facts; minimal fixtures)
