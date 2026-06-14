# Design

The visual system for World Cup Explorer — "Four Homes, One Game." A blend of
the four Malafa family flags (Cameroon, Netherlands, Lebanon, USA), tuned to be
joyful for young children yet refined enough to feel professional.

## Color

Strategy: **Full palette** — four named brand roles, each used deliberately, on
a clean cool-white canvas. Values are tuned in OKLCH, expressed as hex, and live
in `tailwind.config.ts`. Every text/background pairing meets WCAG AA.

### Brand roles (the four homelands)

| Role            | Token   | DEFAULT  | Meaning / flag source                          |
| --------------- | ------- | -------- | ---------------------------------------------- |
| **Unity Red**   | `unity` | `#D32F45`| In ALL four flags → primary action, live, emphasis |
| **Royal Blue**  | `royal` | `#234C9E`| Netherlands + USA → headings, navigation, trust |
| **Cedar Green** | `cedar` | `#0E9266`| Cameroon + Lebanon → success, live data, "go"  |
| **Trophy Gold** | `gold`  | `#C98A12`| Cameroon's star + the World Cup trophy → highlights, badges |

Each ships a full 50–900 scale. `gold` DEFAULT is the readable-on-light 500 step
(use `gold-100` tints behind `gold-700` text for badges).

### Neutrals (cool, faintly royal-tinted — deliberately NOT cream)

- `ink` `#16223F` — deep blue-black, primary text (15.7:1 on white)
- `muted` `#566182` — secondary text (6.1:1 on white, 5.7:1 on canvas)
- `canvas` `#F4F6FB` — page background, cool near-white
- `line` `#E2E7F1` — hairline borders / rings

### Background

A "match under the lights" backdrop on `canvas`: a soft royal-blue floodlight
radial from the top, with faint gold and cedar warmth in the lower corners. No
literal sky/grass, no cream. Defined in `globals.css` on `body`.

### Continent coding (functional, separate from brand)

Map dots & legend: africa = gold, asia = unity red, europe = royal blue,
namerica = cedar green, samerica = violet `#7C3AED`, oceania = teal `#0E7C9B`.
Mirrored in `tailwind.config.ts` and `src/data/teams.ts`. Always paired with a
text label.

### Legacy aliases

`grass→cedar`, `sky→royal`, `sunshine→gold`, `bubble→unity` remap older class
names on-brand without a per-file rewrite.

## The Unity Ribbon (signature)

Four equal bands — red · gold · green · blue (warm → cool) — for the four homes.
- `.unity-ribbon` — the gradient.
- `.unity-ribbon-top` — a fixed 6px hairline pinned to the top of every page
  (in `layout.tsx`).
- A short rounded segment sits under the wordmark beside the four flag emoji
  (🇨🇲 🇳🇱 🇱🇧 🇺🇸).

## Typography

- **Display:** Baloo 2 (`--font-display`) — rounded, friendly, for h1–h3.
- **Body:** Nunito (`--font-body`) — humanist sans for everything else.
- Headings: `line-height 1.08`, `letter-spacing -0.01em`, `text-wrap: balance`,
  coloured `ink`. The wordmark is the one fluid heading
  (`clamp(1.5rem, 7vw, 2rem)` → `text-4xl` at sm) so it never overflows.
- Prose uses `text-wrap: pretty`.

## Components

- **`.kid-card`** — crisp white, `rounded-blob` (1.75rem), hairline `ring-line`,
  soft lifted `shadow-card`. No glass, no nested cards.
- **`.kid-btn`** — tactile pill with a brand-tinted `shadow-pop` that presses
  down on `:active`. Primary = `bg-royal`; destructive/swap = `bg-unity`.
- **Tabs** — active pill is `bg-royal` (a shared `layoutId` spring); inactive is
  white with `ring-line`. Mobile bottom bar mirrors with `royal-50` / `muted`.
- **Badges** — tinted bg + matching deep text: group/hero = `gold-100/gold-700`,
  geography/live = `cedar-100/cedar-700`, info = `royal-50/royal-700`.
- **Countdown** — `bg-ink` flip cells.
- Flags get a continent-coloured ring (not a side-stripe) when selected on the map.

## Motion

- 150–250 ms ease-out transitions; framer-motion springs for tab/pill and card
  entrances. Score, countdown, and carousel motion convey state.
- No bounce/elastic. Full `prefers-reduced-motion` fallback in `globals.css`.

## Layout

- `max-w-5xl` centered, `px-4`. Cards in `repeat`-style responsive grids
  (`sm:grid-cols-2`). Mobile gets a fixed bottom tab bar; sm+ gets a top pill bar.
- Match cards shrink flags (72→88px) and score on mobile so 3-up rows fit ≥360px.

## Bans honored

No side-stripe borders, no gradient text, no decorative glass, no cream canvas,
no per-section eyebrows/numbered markers. Verified no horizontal overflow at 360px.
