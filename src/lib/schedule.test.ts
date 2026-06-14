import { describe, it, expect } from "vitest";

import { matchClock } from "./schedule";
import type { Match } from "@/types";

const KICKOFF = "2026-06-14T16:00:00Z";

/** A live match `mins` real minutes past kickoff, with optional provider fields. */
function liveAt(mins: number, extra: Partial<Match> = {}): { match: Match; now: Date } {
  const match: Match = {
    id: "t1",
    date: "2026-06-14",
    kickoff: KICKOFF,
    homeCode: "FRA",
    awayCode: "BRA",
    stadium: "",
    city: "",
    group: "A",
    status: "live",
    ...extra,
  };
  const now = new Date(new Date(KICKOFF).getTime() + mins * 60000);
  return { match, now };
}

describe("matchClock", () => {
  it("reports scheduled and finished verbatim", () => {
    const { match, now } = liveAt(10, { status: "scheduled" });
    expect(matchClock(match, now)).toEqual({ kind: "scheduled" });
    expect(matchClock({ ...match, status: "finished" }, now)).toEqual({ kind: "finished" });
  });

  it("trusts a real provider minute, including stoppage time", () => {
    // 50 real minutes elapsed, but the feed says the game is at 47' (stoppage).
    const { match, now } = liveAt(50, { minute: 47 });
    expect(matchClock(match, now)).toEqual({ kind: "playing", minute: 47 });

    const stoppage = liveAt(48, { minute: 92 });
    expect(matchClock(stoppage.match, stoppage.now)).toEqual({ kind: "playing", minute: 92 });
  });

  it("trusts a provider halftime flag over any computed minute", () => {
    const { match, now } = liveAt(30, { halftime: true });
    expect(matchClock(match, now)).toEqual({ kind: "halftime" });
  });

  it("synthesizes a first-half minute when no provider minute exists", () => {
    const { match, now } = liveAt(30);
    expect(matchClock(match, now)).toEqual({ kind: "playing", minute: 30 });
  });

  it("shows Halftime during the ~15' interval window", () => {
    const { match, now } = liveAt(50); // 45..60 → interval
    expect(matchClock(match, now)).toEqual({ kind: "halftime" });
  });

  it("subtracts the interval after the break — the issue #24 case", () => {
    // 74 real minutes past kickoff used to show "74'". It should now read 59'
    // (45' played + 14' of the second half, the 15' break removed).
    const { match, now } = liveAt(74);
    expect(matchClock(match, now)).toEqual({ kind: "playing", minute: 59 });
  });

  it("caps the synthesized minute at 90", () => {
    const { match, now } = liveAt(200);
    expect(matchClock(match, now)).toEqual({ kind: "playing", minute: 90 });
  });
});
