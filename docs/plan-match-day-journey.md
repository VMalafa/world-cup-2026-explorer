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
