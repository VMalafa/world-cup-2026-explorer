# World Cup Explorer

A learning explorer where following the daily World Cup 2026 matches is the way
children (and their parent) learn about the countries of the world. The shared
language below keeps "match", "country", and "learning" from drifting as the
product evolves.

## Language

**Match Day Journey**:
The core experience: a short, guided, *finishable* quest built from **any**
**Match**, teaching the two **Countries** playing it. The day's **Match of the
Day** is the featured one, but every fixture opens its own journey (issue #30).
An ordered sequence of **Stations** ending in a reward. Replaces the old passive
scoreboard as the primary loop.
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
come-back hook, filled gradually across the whole curated roster. Lives in the
**World** surface; gains a **Stamp** the *first* time each **Country**'s journey
is finished (one stamp per **Country**, ever — revisiting never re-stamps).

**Stamp**:
The reward earned for a **Country** when its part of a **Match Day Journey** is
completed; the unit the **Passport** collects.

**Done** (a Match):
A **Match** whose **Match Day Journey** a **Profile** has finished — surfaced as a
✓ "Done" badge on that match's card in **Today**, so a child sees which of the
day's fixtures they've already done. Per-**Profile**, stored on-device
(ADR-0003), set the moment the journey finishes (the same moment a **Stamp** is
earned), and persistent per Match (never reset — it simply reads as "done for
today" because each day lists different fixtures). Distinct from a **Stamp**: a
Stamp is per-**Country** and permanent (one ever); Done is per-**Match** and just
reflects "we did this fixture", so a Country already stamped can still have an
un-Done Match (issue #56). _Avoid_: "explored" (reserved for the Country-level
**Passport** sense).

**World**:
The free-explore surface (one of the two primary surfaces, with **Today**) where
a child can revisit any **Country** on the **Globe** and see their **Passport**.

**Prediction**:
A child's pre-kickoff guess of the **Match of the Day** winner, made during the
journey and paid off by the post-match "what happened?" beat. Never gates a
**Stamp** — learning earns stamps, watching does not. Making a pick triggers a
**Send-off** (below).

**Send-off**:
The warm farewell played right after a **Prediction** is made — "Goodbye and good
luck!" read aloud in the picked **Team**'s own language (native script + an
English gloss), reusing the same read-aloud path as the say-hello **Station**
(ADR-0001). Picking "a tie" wishes both **Teams** luck, in both languages (issue
#47). On **The Road**, the same Send-off voices a knockout exit as a *proud*
farewell — never as elimination (issue #60).

**Wonders**:
The small curated set of kid-friendly highlights shown for a **Country** in a
journey — typically a landmark, an animal, and a food — each revealed by tapping,
read aloud, and shown as a **real, openly-licensed photo** (Wikimedia Commons,
AI-vision + human vetted) with a credited source and an emoji as the graceful
fallback. A "learn more" link to the source is parent-facing only. See ADR-0007
(supersedes the AI-illustration approach in ADR-0004).

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
A nation treated as the unit of learning (not just a team that plays). Carries
the learning content a child explores. The curated **Country** roster is a
deliberate **superset** of the tournament's qualified **Teams** — it covers every
real fixture *and* keeps non-playing Countries (e.g. the **Homeland** Cameroon)
explorable in **World** (ADR-0008). So "all 48" no longer describes the roster.
_Avoid_: "team" when you mean the place/culture; reserve **Team** for the
footballing side. _Avoid_: "the 48" as a synonym for the roster.

**Team**:
The footballing side a **Country** fields in a **Match** — line-up, group,
score. The sporting facet of a Country.

**Match**:
One scheduled fixture between two **Teams** on a given day, with kickoff, venue,
status, and score. A knockout **Match** whose sides aren't decided yet carries
`TBD` placeholders; it shows a friendly "to be decided" card (not a dead one) and
auto-becomes a journey once both **Teams** resolve (issue #44).

**Match of the Day**:
The **Match** the app auto-features and highlights each day (a ⭐ on the
dashboard) as the suggested **Match Day Journey**. It is the *default* lesson,
not the *only* one: **every** fixture now opens its own full journey (issue #30).
The Match of the Day is a spotlight, not a gate.
_Avoid_: implying other fixtures can't be journeyed — they can.

**Insight** (deferred):
A bite-size, kid-friendly football fact about a **Team**, shown in-app as a
flag-accented list in the **Match Day Journey** (issue #33). _Status:_ deferred.
A version derived purely from this tournament's results proved too thin (circular
before kickoff; the standing duplicated the **Standings** table), and the
genuinely interesting facts in the original example ("World Cup debut", "haven't
won a knockout since 2010") are historical/editorial and can't be auto-verified
from results. Revisit only with a **curated, verified** per-Team facts source.
"Shared within the application" means *surfaced in-app*, not socially exported.

**Standings**:
A **Group**'s live table — each **Team**'s points, played, and goal difference —
*derived* from committed real **Match** results, never authored. The "where does
my country stand?" view (issue #31). Current to within ~a day (see ADR-0005).
_Avoid_: "league table" (this is group-stage standings within one **Group**).

**The Road**:
A single **Team**'s forward path through the single-elimination knockout stage,
shown as the sequence of **Countries** it *could* face round by round — each a
potential new Country to learn if the Team keeps winning. Losing ends the Road
with a warm, proud **Send-off** — never framed as elimination; the child keeps
every explored Country in their **Passport** regardless of the result, so the
friendship is never lost with the match. Teaches the knockout format — "win and
move on, lose and go home" — in the app's own currency, *new Countries to meet*,
never a stat grid. Team-centric ("what happens to **this** Country"), not a
whole-tournament view (issue #60). _Avoid_: "bracket", "draw" (dense, football-
cold framings that the product's anti-references rule out).

**Round**:
One stage of the knockout **Road** — Round of 32, Round of 16, Quarter-final,
Semi-final, Final. It is a knockout **Match**'s bucket the way a **Group** is a
group-stage Match's bucket: a knockout Match carries a **Round**, not a Group.
Derived from the provider's `stage`, which the live feed already supplies (issue
#60).
