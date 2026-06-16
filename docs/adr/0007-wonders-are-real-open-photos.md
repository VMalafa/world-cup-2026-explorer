# Wonders use real openly-licensed photos (Wikimedia Commons), AI-vision + human vetted

## Status

accepted (supersedes ADR-0004)

## Context & decision

Issue #28 asked that **Wonders** use real, openly-available information and
pictures rather than AI-sourced content, with safe links to sources. ADR-0004 had
chosen AI children's-atlas *illustrations* and deliberately avoided photos
("never photo-realistic clutter", per PRODUCT.md). The product owner chose to
override that brand stance in favour of real photos. Crucially, the ADR-0004
illustrations were **never rendered** — only the generator and a prompt manifest
existed, and the live fallback was always the emoji — so this pivot discards no
shipped art.

We decided each **Wonder** (landmark / animal / food, per **Country**) shows a
**real, openly-licensed photo**, sourced and vetted by a build-time pipeline:

1. **Auto-fetch** candidate photos from **Wikimedia Commons** (CC / public-domain)
   by a curated name per Wonder.
2. **AI-vision pre-filter** flags unsuitable shots (scary, graphic, low-quality,
   crowded, off-subject) — the safety check the rule-based **Content Guardian**
   (ADR-0002) structurally cannot perform on pixels.
3. **Human contact-sheet glance** at `/wonders-sheet` (reused from ADR-0004) is
   the final pass before commit.
4. Winners are **committed as static assets** (keeps the app offline/calm, same as
   ADR-0004/0005), loaded by filename convention. **Emoji is the fallback** when no
   clean photo clears vetting — a missing photo never breaks a journey.

**Attribution & links (issue #28's "safe links"):** every photo shows its required
**CC attribution credit** (license compliance). A **"Learn more" link to the
source is parent-facing** — not a primary button in the kid journey flow — because
the users are 4 and 6 and must not free-roam the open web.

## Considered options

- **Keep AI illustrations, only source facts from open data**: protected a brand
  the owner chose to override, and protected art that didn't actually exist.
  Rejected.
- **Human hand-pick every photo**: best per-image control but ~144× manual toil
  and re-do on any change. Rejected as the default; the pipeline keeps a human in
  the loop only at the contact-sheet glance.
- **AI-vision auto-picks with no human glance**: least toil, but removes the final
  human safety pass for a small-children's product. Rejected.

## Consequences

- New build-time dependencies: a Wikimedia Commons fetch + an AI-vision model
  (author-time only; nothing ships in the live bundle, consistent with ADR-0004).
- Real photos vary in look; apply a consistent card treatment (uniform aspect /
  framing) so they read as curated, not as web clutter — the brand mitigation for
  overriding "never photo-realistic".
- Attribution/license metadata must be stored per photo and rendered; this is new
  data the illustration approach didn't need.
- The "safe link" is gated to a parent affordance; a kid-reachable web link is a
  separate, later decision if ever wanted.
