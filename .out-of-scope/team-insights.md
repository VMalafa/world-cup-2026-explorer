# Team Insights (results-derived football facts)

The app does not show a **results-derived** "insights" panel — a bite-size list of
football facts about a **Team** (e.g. "unbeaten in their last 3", "top of the
group") computed from this tournament's own match results.

## Why this is out of scope

The idea was built once (branch `feat/team-insights`, closed PR #38) and
deliberately skipped. Two problems made a results-derived version too thin to be
worth showing:

1. **Circular before kickoff.** Before a team has played, the only fact derivable
   from *this* tournament's results is the fixture the child is already looking at
   ("First match: <the opponent on screen>"). It tells them nothing new.
2. **Duplicates the Standings.** Once matches have been played, the group-position
   line just restates the **Standings** table already shown in context (issue #31).
   Two views of the same numbers.

The genuinely interesting facts in the original request — "World Cup debut",
"haven't won a knockout match since 2010" — are **historical / editorial**, not
derivable from the current tournament's results at all. They can't be
auto-verified from the live results feed (football-data.org), and the project's
standard for shipped **Country** content is that it passes the **Content Guardian**
against the **Values Rubric** (accurate above all — ADR-0002). Publishing
unverifiable "facts" to children fails that bar.

This is a **rejection of the results-derived approach**, not of the concept
forever. It would be reconsidered only with a **curated, verified per-Team facts
source** (e.g. Wikidata for "World Cup debut"), authored and Guardian-gated like
the rest of the learning content. Until such a source exists, there is nothing
honest and non-duplicative to show. See the **Insight (deferred)** entry in
`CONTEXT.md`.

## Prior requests

- #33 — "[💡 Idea] Here are good examples of insights that could somehow be shared within the application"
