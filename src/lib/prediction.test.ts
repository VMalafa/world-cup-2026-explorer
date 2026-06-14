import { describe, it, expect } from "vitest";

import { memoryKeyValue } from "./storage";
import { createPredictionStore } from "./prediction";

describe("createPredictionStore", () => {
  it("has no prediction until one is made", () => {
    const p = createPredictionStore(memoryKeyValue());
    expect(p.get("ava", "m1")).toBeNull();
  });

  it("stores and returns a child's pick for a match", () => {
    const p = createPredictionStore(memoryKeyValue());
    p.set("ava", "m1", "JPN");
    expect(p.get("ava", "m1")).toBe("JPN");
  });

  it("lets a child change their mind", () => {
    const p = createPredictionStore(memoryKeyValue());
    p.set("ava", "m1", "JPN");
    p.set("ava", "m1", "draw");
    expect(p.get("ava", "m1")).toBe("draw");
  });

  it("keeps predictions separate per profile and per match", () => {
    const p = createPredictionStore(memoryKeyValue());
    p.set("ava", "m1", "JPN");
    expect(p.get("kai", "m1")).toBeNull();
    expect(p.get("ava", "m2")).toBeNull();
  });

  it("persists across store instances (a reload)", () => {
    const kv = memoryKeyValue();
    createPredictionStore(kv).set("kai", "m9", "ESP");
    expect(createPredictionStore(kv).get("kai", "m9")).toBe("ESP");
  });
});
