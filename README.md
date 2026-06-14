# ⚽ World Cup 2026 Learning Explorer

> 🌍 **Live app:** <https://world-cup-2026-explorer.vercel.app>

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

The easiest path is **Vercel** (free for personal projects). The code already
lives on GitHub at
<https://github.com/VMalafa/world-cup-2026-explorer>.

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VMalafa/world-cup-2026-explorer)

Click the button, log in to Vercel (you can use your GitHub account), and press
**Deploy**. In about a minute you'll get a live URL. No settings or keys needed.

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

Copy `.env.example` to `.env.local` and set what you want:

| Variable | Purpose |
| --- | --- |
| `USE_LIVE_DATA` | `true` to use a **live** provider you've wired in; anything else (default) = bundled curated data. Server-only runtime toggle. |
| `API_FOOTBALL_KEY` | Optional — a key for whatever trusted provider you wire in. |
| `GITHUB_FEEDBACK_TOKEN` | Optional — a fine-grained GitHub PAT (*Issues: Read & Write* on the repo) so the in-app **💬 Tell us!** button files real GitHub Issues. Without it the button still works but no issue is created. |
| `GITHUB_FEEDBACK_REPO` | Optional — `owner/repo` to file feedback issues in. Defaults to this project's repo. |

On Vercel: **Project → Settings → Environment Variables**. (CLI:
`vercel env add USE_LIVE_DATA production`.)

### In-app feedback → GitHub Issues

The floating **💬 Tell us!** button (every screen) lets kids and grown-ups send a
note. Each one becomes a GitHub Issue labelled `feedback` + a category
(`feedback:love` / `feedback:bug` / `feedback:idea`), capturing the page,
device, and time — but **not** the child's profile name (privacy). Issue creation
runs server-side (`src/app/api/feedback/route.ts`) so the token never reaches the
browser. No token = the button fails softly with a friendly "Thanks!", never an
error.

### How live data works

The app ships with **no external live provider** — it runs entirely on its own
bundled, curated schedule, so it depends on no third-party server. The "Today"
screen shows a small **🟢 Live data / ⚪ Sample data** badge so you can always
see which is active.

There's a clean **seam** ready for you to plug in a source you trust: implement
`fetchLiveMatches()` in `src/app/api/matches/route.ts` so it returns the app's
`Match[]` shape, and set `USE_LIVE_DATA=true`. If the provider is ever
unreachable or returns nothing, the app automatically falls back to the bundled
schedule, so it's never blank.

A good free option for real **live scores** is
[api-football.com](https://www.api-football.com/) (free tier, ~100 requests/day,
needs a free account + key). "Live data" only covers fixtures & scores — the
learning content (capitals, continents, map, fun facts, hero stories) is always
curated, since no sports API provides that.

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

### Using live data

1. Implement `fetchLiveMatches()` in `src/app/api/matches/route.ts` against a
   provider you trust (there's a commented api-football example in the file).
   Map its response into the app's `Match[]` shape.
2. Add any key (e.g. `API_FOOTBALL_KEY`) to `.env.local` and to Vercel.
3. Set `USE_LIVE_DATA=true` and redeploy.

The UI already polls `/api/matches` every 30s, so scores stay fresh
automatically. Set `USE_LIVE_DATA=false` to return to the bundled schedule.

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
