# ⚽ World Cup 2026 Learning Explorer

A playful, interactive learning app built for **Ava (6)** and **Kai (4)** — a fun
"five-minute briefing" for each World Cup match day. Tap a country on the map,
compare two nations side by side, read inspiring true stories about football
heroes, and soak up fun facts — all in big, bright, kid-friendly design with two
reading levels.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion
· Leaflet**. It works **with zero setup and zero API keys** using bundled,
curated 2026 data, and is ready to plug into a live data provider later.

---

## ✨ What's inside

| Feature | What it does |
| --- | --- |
| **⚽ Today's Matches** | Today's fixtures with teams, kickoff time, stadium, an animated flip **countdown**, and live-feeling scores. |
| **🗺️ Interactive Map** | A Leaflet world map. Tap a coloured dot to learn about a team; tap a ⚽ to find a host stadium. Pan, zoom, continent colour legend. |
| **🔍 Compare Countries** | Pick any two of the 48 nations side by side — flags, capitals, continents, fun facts — with a **zoom-in** detail view. |
| **🌟 Hero Stories** | Drag-to-explore cards with true, inspiring player stories (humble beginnings, challenges overcome, family, hard work). Tap to reveal. |
| **🤔 Fun Facts** | A rotating carousel of geography + football facts that changes by match day. |
| **🐣/🦉 Two reading levels** | "Little Reader" (≈5–8 words/sentence) and "Big Reader" (≈10–15 words/sentence). The choice is remembered between visits. |

Designed mobile-first, fully responsive, touch-friendly, animated, and with
accessibility in mind (semantic HTML, ARIA roles, keyboard focus, reduced-motion
support).

---

## 🚀 Quick start (run it on your computer)

You'll need [Node.js](https://nodejs.org) 18.18+ installed.

```bash
# 1. Install the bits it needs (one time)
npm install

# 2. Start it up
npm run dev

# 3. Open the link it prints (usually http://localhost:3000)
```

That's it — no keys, no accounts. The app uses the bundled curated data.

To build the optimised production version:

```bash
npm run build
npm start
```

---

## ☁️ Deploy it online (so the family can use it anywhere)

The easiest path is **Vercel** (free for personal projects).

### Option A — the website (no command line)

1. Push this folder to a **GitHub** repo (see "Put it on GitHub" below).
2. Go to <https://vercel.com> and sign up / log in (you can use GitHub).
3. Click **Add New… → Project**, pick this repository, and click **Deploy**.
4. Wait ~1 minute. Vercel gives you a live URL like
   `https://world-cup-explorer.vercel.app`. Share it, bookmark it, done!

Vercel auto-detects Next.js — you don't need to change any settings. No
environment variables are required for the default (bundled-data) version.

### Option B — the command line

```bash
npm i -g vercel      # install the Vercel CLI once
vercel               # follow the prompts to create a preview deployment
vercel --prod        # publish to your production URL
```

### Put it on GitHub (optional but recommended)

```bash
git init
git add .
git commit -m "World Cup 2026 Learning Explorer"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<your-username>/world-cup-explorer.git
git branch -M main
git push -u origin main
```

---

## 🔑 Environment variables (only if you want live data)

The app runs fully without any of these. They only switch on optional live data.

Copy `.env.example` to `.env.local` and fill in what you have:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_USE_LIVE_DATA` | `true` to try live data, `false` (default) for bundled data. |
| `API_FOOTBALL_KEY` | A free key from [api-football.com](https://www.api-football.com/) (optional). |
| `WORLD_CUP_API_BASE` | Base URL of a World Cup data provider, e.g. `https://wc2026api.com` (optional). |

On Vercel, add these under **Project → Settings → Environment Variables**, then
redeploy. (With the CLI: `vercel env add API_FOOTBALL_KEY`.)

---

## 🛠️ How to update match data

All the curated data lives in plain, well-commented files in **`src/data/`** —
no database needed.

- **Matches & stadiums** → `src/data/matches.ts`
  The schedule is generated from the team groups so every team plays. To use the
  official fixtures, you can either edit the generator, or replace `MATCHES`
  with a hand-written array of `Match` objects (the `Match` shape is in
  `src/types/index.ts`). Each match needs a `date`, a `kickoff` ISO timestamp,
  the two team codes, and a stadium.
- **Teams / countries** → `src/data/teams.ts` (flags, capitals, continents,
  coordinates, groups, fun facts). Edit any entry or add new ones.
- **Player stories** → `src/data/players.ts` (each has a `kinder` and `enriched`
  version of the hook, story, and lesson).
- **Fun facts** → `src/data/funFacts.ts`.

### Plugging in a real live API

Open `src/app/api/matches/route.ts` and fill in the `fetchLiveMatches()`
function for your chosen provider (there's a commented example), then set
`NEXT_PUBLIC_USE_LIVE_DATA=true`. The endpoint already caches responses
(`revalidate = 30`) to stay within free-tier rate limits.

> **Note:** The "today's match" logic is smart — if today isn't a tournament
> day, it shows the **next** match day; once the tournament is over it shows the
> **most recent** one. So the app always has something to show.

---

## 🧩 Project structure

```
src/
  app/
    layout.tsx          # fonts, metadata, providers
    page.tsx            # the tabbed single-page app
    globals.css         # playful theme
    error.tsx           # friendly error screen
    not-found.tsx       # friendly 404
    api/matches/route.ts# data endpoint (bundled or live)
  components/
    MatchDashboard.tsx  # today's matches + countdown
    CountdownTimer.tsx  # animated flip countdown
    MapExplorer.tsx     # map section (legend + info card)
    WorldMap.tsx        # the Leaflet map (client-only)
    CompareView.tsx     # side-by-side country comparison + zoom
    PlayerStoryCards.tsx# drag-to-explore hero stories
    FunFactsCarousel.tsx# rotating fun facts
    ReadingLevel.tsx    # dual reading-level context
    ReadingLevelToggle.tsx
    Flag.tsx            # flag image with emoji fallback
  data/                 # all curated content (edit here!)
  lib/schedule.ts       # match-day selection + live status
  types/index.ts        # shared TypeScript types
```

---

## ♿ Accessibility & little-finger friendliness

- Big tap targets, large type, high contrast.
- Semantic landmarks, ARIA roles on tabs/dialogs/carousel, keyboard focus rings.
- Respects `prefers-reduced-motion` for families who want calmer screens.
- Pinch-zoom is allowed; flags have text labels for screen readers.

---

## 💡 Ideas for future iterations

- **Multi-agent player-story generation** — use the Claude API to generate fresh,
  age-appropriate stories for every player in each day's squads automatically.
- **Knockout bracket mode** — an interactive, tappable bracket as the tournament
  progresses.
- **"My team" mode** — let each child pick a favourite team and follow its journey.
- **Sticker / passport collection** — earn a sticker for each country they learn about.
- **Read-aloud audio** — a "play" button that reads the story in a friendly voice.
- **Quiz time** — gentle multiple-choice questions (which flag? which continent?).
- **Live scores** — wire `fetchLiveMatches()` to a real provider for real results.
- **More languages** — the dual-text system extends naturally to other languages.

---

Made with ⚽ and ❤️ for Ava & Kai. Enjoy the tournament!
