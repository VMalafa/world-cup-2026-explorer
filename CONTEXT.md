# World Cup Explorer

A learning explorer where following the daily World Cup 2026 matches is the way
children (and their parent) learn about the countries of the world. The shared
language below keeps "match", "country", and "learning" from drifting as the
product evolves.

## Language

**Match Day Journey**:
The core daily experience: a short, guided, *finishable* quest built from the
**Match of the Day**, teaching the two **Countries** playing it. An ordered
sequence of **Stations** ending in a reward. Replaces the old passive scoreboard
as the primary loop.
_Avoid_: "Today tab", "dashboard", "scoreboard" (those name the old passive view).

**Station**:
One step in a **Match Day Journey** — a single interactive learning activity
(e.g. locate-on-globe, flag, say-hello, wonders, meet-a-hero). Done in order;
each is finishable by a pre-reader through listening and tapping, not reading.
Geography is the spine: stations happen pinned to the country's place on the
**Globe**.

**Globe**:
The always-present world stage of a **Match Day Journey**. Geography is the
primary thing taught, so a **Country** is learned by where it sits in the world,
both absolutely (continent, ocean) and relative to the **Homelands**.

**Homelands**:
The four Malafa family countries — Cameroon, Netherlands, Lebanon, USA — used as
the fixed anchor for teaching every other **Country**'s location ("how far from
home, in which direction"). Also the source of the brand's Unity Ribbon.
_Avoid_: "home teams" (they are not necessarily playing).

**Profile**:
A child using the app (Ava or Kai) — chosen by tapping a face on open, no login.
Each **Profile** has its own **Passport** and reading level. Stored on-device.

**Passport**:
The persistent collection of every **Country** a child has explored — the
come-back hook. Lives in the **World** surface; gains a **Stamp** each time a
**Match Day Journey** is finished.

**Stamp**:
The reward earned for a **Country** when its part of a **Match Day Journey** is
completed; the unit the **Passport** collects.

**World**:
The free-explore surface (one of the two primary surfaces, with **Today**) where
a child can revisit any **Country** on the **Globe** and see their **Passport**.

**Prediction**:
A child's pre-kickoff guess of the **Match of the Day** winner, made during the
journey and paid off by the post-match "what happened?" beat. Never gates a
**Stamp** — learning earns stamps, watching does not.

**Wonders**:
The small curated set of kid-friendly highlights shown for a **Country** in a
journey — typically a landmark, an animal, and a food — each revealed by tapping,
read aloud, and shown as a children's-atlas **illustration** (with an emoji as the
graceful fallback before the picture exists). See ADR-0004.

**Content Guardian**:
The automated reviewer (an AI agent, run at authoring time, not in the live app)
that every draft of **Country** learning content must pass before it ships. It
checks content against the **Values Rubric** and either passes, revises, or
quarantines. Replaces per-item human approval as the quality gate.
_Avoid_: "moderation", "filter" (it shapes for values, not only blocks).

**Values Rubric**:
The fixed six-dimension standard the **Content Guardian** judges against —
accurate, age-appropriate, relevant, culturally respectful, mindful, and
altruistic/global. Defined in full in ADR-0002.

**Country**:
A nation in the tournament, treated as the unit of learning (not just a team
that plays). Carries the learning content a child explores.
_Avoid_: "team" when you mean the place/culture; reserve **Team** for the
footballing side.

**Team**:
The footballing side a **Country** fields in a **Match** — line-up, group,
score. The sporting facet of a Country.

**Match**:
One scheduled fixture between two **Teams** on a given day, with kickoff, venue,
status, and score.

**Match of the Day**:
The single **Match** the app features each day for its full **Match Day
Journey** (its two **Countries** are the day's lesson). Auto-picked by the app,
overridable by tapping any other **Match**. Other fixtures stay followable but
are not the day's lesson.
