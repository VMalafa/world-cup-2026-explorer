# Wonder illustrations

Children's-atlas illustrations for each Country's Wonders (ADR-0004, issue #23).

- **Naming:** `<code>-<slot>.png`, lowercase FIFA code + slot —
  `fra-landmark.png`, `bra-animal.png`, `mex-food.png`. Slots: `landmark`,
  `animal`, `food`.
- **How the app uses them:** the Wonders station loads `/wonders/<code>-<slot>.png`
  by convention. If a file is missing, it falls back to the Wonder's emoji — so
  the app is never broken by an absent image.
- **How they're made:** `npm run gen:wonders` (see `scripts/generateWonders.mts`)
  generates them via the Vercel AI Gateway. Review them at `/wonders-sheet`
  before committing the PNGs here.

These PNGs are committed assets — the source of truth — not regenerated at build
time. Re-running the generator only fills in missing files unless `--force`.
