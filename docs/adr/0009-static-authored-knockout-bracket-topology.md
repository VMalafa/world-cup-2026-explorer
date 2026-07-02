# Knockout bracket topology is a static authored map, not live-derived

## Status

accepted

## Context & decision

**The Road** (CONTEXT.md, issue #60) shows a **Team**'s next-round opponents, which
requires knowing the knockout tree's *edges* — "the winner of this **Match** feeds
that next-round slot." Our live provider (football-data.org, ADR-0005) returns a
*flat* list of knockout matches carrying a `stage` (`LAST_16`, `QUARTER_FINALS`, …)
and dates, but it does **not** expose the bracket edges: nothing in the free-tier
feed says which match's winner advances into which later slot.

The 2026 knockout tree is a **fixed, published, unchanging fact** — the slot-to-slot
progression was set with the schedule and never changes during the tournament. We
decided to encode it as a small **hand-authored reference map** (~15 slot links) and
compute The Road from `stage` + this map, rather than trying to infer edges at
runtime.

## Considered options

- **Derive the edges live from the provider (rejected):** avoids a static file, but
  the free tier doesn't carry bracket edges, so it would mean *guessing* the
  topology from ids/dates/venues. That is exactly the kind of fabrication ADR-0005
  forbids ("live → real snapshot → honest-empty, never invented").
- **Hybrid: static map validated against provider stage/dates (rejected for now):**
  more robust to a schedule change, but materially more code for a one-off,
  already-fixed tournament tree. Over-engineered.
- **Static authored map (chosen):** deterministic, honest, no live guesswork; the
  data is a real published fact with a known, bounded shape. Same posture as the
  curated roster (ADR-0008) and real-data-only fallback (ADR-0005).

## Consequences

- A future reader seeing a hand-coded bracket map next to a live data provider
  should read this ADR: the map is intentional, because the provider does **not**
  supply edges — it is not stale or duplicated data.
- The `Match` type gains a `stage` field (the provider already sends it; we simply
  stop dropping it). The daily snapshot (ADR-0005) must be regenerated to persist
  `stage` so The Road works offline / on the snapshot fallback.
- The map keys on stable slot identity, **not** on volatile per-fixture provider ids
  — so a snapshot refresh that renumbers matches must not break it.
- If FIFA ever restructured this tournament's bracket mid-flight (extremely
  unlikely), the map would need a manual edit; that is an accepted cost for the
  honesty and simplicity gained.
