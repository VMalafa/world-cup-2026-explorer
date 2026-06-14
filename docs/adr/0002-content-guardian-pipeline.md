# Country learning content is AI-drafted and gated by a Content Guardian, not hand-approved

## Status

accepted

## Context & decision

Enriching 48 **Countries** with kid-friendly **Wonders**, flag meanings, and
dual-reading-level phrasing is too much for one parent to hand-author, but a
kids' educational app can't ship unverified content either. We decided to
**generate** the content with an AI author and gate every draft through a second
agent — the **Content Guardian** — that judges it against a fixed **Values
Rubric** before it is written into `src/data`. This replaces per-item human
approval. The Guardian's job is not only to block bad content but to *shape*
content toward the worldview we want the kids to absorb.

Geographic facts are **derived** from data we already hold (lat/lng, continent),
so the Guardian mainly governs the authored "flavor", not the spine.

## The Values Rubric (six dimensions)

1. **Factually accurate** — every claim is true and not a stereotype dressed as a
   fact. The highest-priority check; uncertain claims are quarantined, not shipped.
2. **Age-appropriate & safe** — nothing scary, violent, or mature; concept and
   vocabulary fit a 4- and 6-year-old.
3. **Relevant** — genuinely about this Country and tied to the geography-first
   learning goal, not filler.
4. **Culturally respectful & empathetic** — dignity for every culture; no
   othering or "weird foreign thing" framing; celebrates rather than exoticizes.
5. **Mindful & calm** — curious, present, gratitude-tinged; never anxious or hype-y.
6. **Altruistic & global** — quietly reinforces that we share one world and people
   everywhere are kin; balanced, not Western-centric.

## Fail handling

On a fail the Guardian first **revises** the draft to comply and re-checks. Only
if it still cannot pass — or it is **low-confidence**, especially on accuracy —
does it **quarantine** the item for a quick human glance. So content ships
without manual approval in the normal case, but the machine holds rather than
ships the one item it is unsure about for the family's own young children.

## Consequences

- Content is reproducible: re-running the author + Guardian regenerates `src/data`.
- The Guardian runs at authoring time only; nothing about this is in the live app,
  which stays static and offline-friendly.
- A small quarantine queue is expected and is a feature, not a failure.
