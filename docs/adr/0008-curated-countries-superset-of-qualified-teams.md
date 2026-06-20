# Curated Countries are a superset of the tournament's qualified Teams

## Status

accepted

## Context & decision

The bundled roster in `src/data/teams.ts` began as a hand-authored *realistic
sample* of 48 nations (its own header says so), written before the real 2026
draw. Once real fixtures arrived (ADR-0005, live-first football-data.org with a
committed snapshot), the two sets diverged:

- **10 sample Countries never appear in any real fixture**: `CHI, CMR, CRC, DEN,
  ITA, JAM, NGA, POL, SRB, WAL` — note `CMR` (Cameroon) is a **Homeland**.
- **10 real qualified Teams had no learning data**: `BIH, COD, CPV, CUW, CZE,
  HAI, IRQ, JOR, SWE, TUR`.

Because a **Match Day Journey** only opens when *both* sides resolve to a curated
**Country** (`getTeam` non-null), **62 of 104 real fixtures were dead** on Today —
the gap reported in issue #44 ("an option to explore the world on all of these
games").

We decided to **add the 10 missing qualified Teams as fully curated Countries and
keep the 10 sample-only ones**, rather than replacing them. The curated **Country**
set therefore becomes a deliberate **superset** of the tournament's qualified
**Teams**: it covers every real fixture *and* retains Countries that aren't
playing.

## Considered options

- **Replace the 10 sample-only teams with the 10 real ones (roster stays 48):**
  exactly mirrors the tournament, but deletes shipped, Guardian-approved content —
  including **Cameroon**, a Homeland and part of the brand's own identity. A child
  could no longer explore a Homeland in the **World** surface. Rejected.
- **Replace, but keep Cameroon as the lone exception:** less content loss, but an
  arbitrary one-off rule that still deletes nine real Countries' content and still
  needs the "why is CMR special?" explanation. Rejected.
- **Add the 10 real, keep the rest (chosen):** never deletes content, every real
  fixture becomes explorable, Homelands stay explorable. Cost is that the roster
  no longer equals 48 and no longer 1:1-matches the bracket.

## Consequences

- The roster grows to ~58 Countries. **"All 48" language is now inaccurate** —
  CONTEXT.md (Passport, Country) is updated to speak of "every qualified Country"
  / the curated set, not a fixed 48. Any UI copy or counter that hard-codes 48
  must be reviewed.
- A future reader seeing **Italy or Cameroon** in the data — teams not in the 2026
  finals — should read this ADR: their presence is intentional, not stale data.
- Every real **group-stage** fixture is now journey-able. The remaining
  non-explorable case is a knockout slot whose teams are still `TBD`; those render
  as a friendly "to be decided" placeholder card and auto-upgrade to a real
  journey once both sides resolve (issue #44).
- The 10 new Countries pass the **Content Guardian** (ADR-0002) like any other:
  Team basics + Wonders + flagMeaning + a language entry, with real Wonder photos
  backfilled via the pipeline (ADR-0007) and emoji as the fallback meanwhile.
- The sample-only, non-qualified Countries are reachable only via **World** free
  explore (never via a real fixture), which is acceptable — exploring a place is
  valid whether or not it's playing, consistent with how **Homelands** are framed.
