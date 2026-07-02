import { describe, it, expect } from "vitest";

import { memoryKeyValue } from "./storage";
import { createDoneMatchesStore } from "./doneMatches";
import { createPassportStore } from "./passport";

describe("createDoneMatchesStore", () => {
  it("starts with nothing done", () => {
    const d = createDoneMatchesStore(memoryKeyValue());
    expect(d.isDone("ava", "fd-1")).toBe(false);
    expect(d.listDone("ava")).toEqual([]);
  });

  it("marks a Match Done on finish", () => {
    const d = createDoneMatchesStore(memoryKeyValue());
    d.markDone("ava", "fd-1", 1000);

    expect(d.isDone("ava", "fd-1")).toBe(true);
    expect(d.listDone("ava")).toEqual(["fd-1"]);
  });

  it("is idempotent and never resets", () => {
    const d = createDoneMatchesStore(memoryKeyValue());
    d.markDone("ava", "fd-1", 1000);
    d.markDone("ava", "fd-1", 5000);

    expect(d.listDone("ava")).toEqual(["fd-1"]);
    expect(d.isDone("ava", "fd-1")).toBe(true);
  });

  it("is per-Match: other fixtures stay un-Done", () => {
    const d = createDoneMatchesStore(memoryKeyValue());
    d.markDone("ava", "fd-1");

    expect(d.isDone("ava", "fd-2")).toBe(false);
  });

  it("is per-Profile: Ava finishing must not mark it Done for Kai", () => {
    const d = createDoneMatchesStore(memoryKeyValue());
    d.markDone("ava", "fd-1");

    expect(d.isDone("kai", "fd-1")).toBe(false);
    expect(d.listDone("kai")).toEqual([]);
  });

  it("persists across store instances (a reload)", () => {
    const kv = memoryKeyValue();
    createDoneMatchesStore(kv).markDone("kai", "fd-9", 2000);

    const reloaded = createDoneMatchesStore(kv);
    expect(reloaded.isDone("kai", "fd-9")).toBe(true);
  });

  it("is independent of Stamps: a stamped Country does not make a Match Done", () => {
    const kv = memoryKeyValue();
    // Ava finished a Brazil fixture once — Brazil is stamped.
    createPassportStore(kv).earnStamp("ava", "BRA");

    // A different Brazil fixture was never finished, so it is not Done.
    const d = createDoneMatchesStore(kv);
    expect(d.isDone("ava", "fd-brazil-2")).toBe(false);
  });
});
