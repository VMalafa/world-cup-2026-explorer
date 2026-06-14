# Passport progress is stored on-device (local-first), not in a cloud database

## Status

accepted

## Context & decision

The **Passport** and **Profile** state must persist, but the users are the
family's own young children. We decided to store all progress **on-device**
(browser local storage) for v1 — no backend, no accounts — so that **no data
about minors ever leaves the device**, the app stays fully offline-friendly and
zero-cost, and there is no auth to build. Access goes through a single storage
interface (a seam) so a cloud backend (Neon Postgres was pre-approved) can be
added later without touching feature code.

## Considered options

- **Neon Postgres backend (deferred):** survives device changes and browser
  clears and enables cross-device sync, but requires a backend, a family/kid
  identity model, and storing children's data in the cloud. Chosen *against* for
  v1 on privacy and simplicity grounds; revisit only when multi-device sync is a
  real need.

## Consequences

- Progress is tied to one device/browser; clearing storage wipes the Passport.
  Acceptable for a shared family tablet.
- "Persistent" here means across sessions on a device, not across devices.
- The storage seam is the contract; honor it so the Neon upgrade stays a small,
  localized change.
