# Match data is live-first (football-data.org) with a real cron-committed snapshot fallback — and the synthetic schedule is never served

## Status

accepted

> Correction note: an earlier draft of this ADR assumed there was *no* live API
> and proposed bundling real fixtures via cron *instead of* a live provider. That
> premise was wrong — football-data.org is already wired in and serving live data
> in production (`/api/matches` returns `source: "live"`, 104 real matches). This
> ADR reflects the corrected understanding.

## Context & decision

Issue #32 ("Brazil vs Tunisia today" — a fixture that doesn't exist) and issue #30
("can't explore the Spain game") turned out to be the **same bug**. Production runs
live data from **football-data.org**, but the `/api/matches` route **silently falls
back to the synthetic `buildSchedule()`** whenever the live fetch hiccups (free-tier
rate limit, timeout, transient error). `buildSchedule()` *invents* fixtures by
pairing group-mates in array order — so during a fallback window the app showed a
fabricated "Brazil vs Tunisia" and hid Spain's real match (ESP v CPV). A live API
that silently degrades to **fabricated-but-real-looking** data is the worst failure
mode: a parent and child cannot tell it is fake.

We decided on a **live-first, never-fake** data foundation:

1. **Live is primary.** football-data.org stays the real-time source (live in-match
   scores and **Standings** — the heart of the daily ritual). `USE_LIVE_DATA=true`.
2. **The synthetic `buildSchedule()` is removed from the production path.** The app
   must never serve invented fixtures.
3. **The fallback is a *real* snapshot.** A **daily cron** (GitHub Action / Vercel
   cron) fetches the real fixtures/results/standings and **commits a static
   snapshot** (last-good real data). When the live fetch is unavailable, the route
   serves this snapshot — real but up to ~a day stale — not a fabrication.
4. So the data is always one of: **live (fresh) → real snapshot (stale) → honest
   empty/updating state.** Never fake.

The same cron also pulls source-verifiable **Insight** facts (#33); **Standings**
(#31) come live from the provider and from the snapshot when offline.

## Considered options

- **Fully bundled cron, drop the live API:** simplest and fully offline, but throws
  away working real-time in-match scores that make the daily ritual feel alive.
  Rejected — the live API already works; keep its upside.
- **Just remove the synthetic fallback, show "updating…" on failure:** fixes the
  fake-data bug with no cron, but any hiccup leaves a blank day. Rejected — the
  real snapshot gives a graceful, still-truthful fallback for the same effort.

## Consequences

- `buildSchedule()` is deleted (or quarantined to tests only); nothing in the live
  app may generate fixtures.
- A new build-time/cron job owns the snapshot commit; the snapshot is the only
  fallback the route is allowed to use.
- The live provider remains the runtime dependency it already is; the snapshot
  bounds the blast radius of any provider outage to "stale, not wrong."
- Staleness of up to ~a day in the fallback is acceptable and must never be
  presented as live; the existing `source: "live" | "sample"` badge should
  distinguish live vs snapshot honestly (rename "sample" → "snapshot"/"recent").
- Standings are a derived/real projection (live or snapshotted), never authored —
  same "derive, don't author" stance as geography.
- One pipeline serves three issues: real fixtures (#32/#30), Standings (#31), and
  verifiable Insight facts (#33).
