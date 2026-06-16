# Wonder photos

Real, openly-licensed photos for each Country's Wonders (ADR-0007, issue #28).
These replace the AI-illustration approach (ADR-0004), which was never rendered.

- **Naming:** `<code>-<slot>.<ext>`, lowercase FIFA code + slot —
  `fra-landmark.jpg`, `bra-animal.jpg`, `mex-food.jpg`. Slots: `landmark`,
  `animal`, `food`. The extension follows the source photo (jpg or png).
- **How the app uses them:** the Wonders station reads the attribution manifest
  `src/data/wonderPhotos.json` (keyed by `<code>-<slot>`) and loads
  `/wonders/<file>`. If a key is missing — or the image fails to load — it falls
  back to the Wonder's emoji, so the app is never broken by an absent photo.
- **Attribution:** each photo shows its author + license in the app, and a
  parent-facing "Learn more" link to the Wikimedia source page (CC requires it).
- **How they're made:** `npm run gen:wonder-photos` (see
  `scripts/generateWonderPhotos.mts`) searches Wikimedia Commons, keeps only
  free-licensed photos, runs an AI-vision safety check (Vercel AI Gateway), and
  writes the image here plus its attribution to the manifest. **Review every
  photo at `/wonders-sheet` before committing** — the human safety/quality pass.
  Use `-- --dry-run` to preview candidates without downloads or API calls.

The committed photos + `src/data/wonderPhotos.json` are the source of truth — not
regenerated at build time. Re-running only fills in missing entries unless
`--force`.
