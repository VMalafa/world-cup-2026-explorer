import { describe, it, expect } from "vitest";

import { memoryKeyValue } from "./storage";
import { createPassportStore } from "./passport";

describe("createPassportStore", () => {
  it("starts empty for a profile", () => {
    const p = createPassportStore(memoryKeyValue());
    expect(p.stampCount("ava")).toBe(0);
    expect(p.hasStamp("ava", "BRA")).toBe(false);
    expect(p.listStamps("ava")).toEqual([]);
  });

  it("earns a stamp for a country", () => {
    const p = createPassportStore(memoryKeyValue());
    const stamp = p.earnStamp("ava", "BRA", 1000);

    expect(stamp).toEqual({ countryCode: "BRA", earnedAt: 1000 });
    expect(p.hasStamp("ava", "BRA")).toBe(true);
    expect(p.stampCount("ava")).toBe(1);
    expect(p.listStamps("ava")).toEqual([{ countryCode: "BRA", earnedAt: 1000 }]);
  });

  it("is idempotent per country — a Country lives in the Passport once", () => {
    const p = createPassportStore(memoryKeyValue());
    p.earnStamp("ava", "BRA", 1000);
    const again = p.earnStamp("ava", "BRA", 5000);

    expect(p.stampCount("ava")).toBe(1);
    // First earn wins; the original earnedAt is preserved.
    expect(again.earnedAt).toBe(1000);
    expect(p.listStamps("ava")).toEqual([{ countryCode: "BRA", earnedAt: 1000 }]);
  });

  it("keeps each profile's Passport separate", () => {
    const p = createPassportStore(memoryKeyValue());
    p.earnStamp("ava", "BRA", 1000);

    expect(p.hasStamp("kai", "BRA")).toBe(false);
    expect(p.stampCount("kai")).toBe(0);
  });

  it("persists across store instances (a reload)", () => {
    const kv = memoryKeyValue();
    createPassportStore(kv).earnStamp("kai", "JPN", 2000);

    const reloaded = createPassportStore(kv);
    expect(reloaded.hasStamp("kai", "JPN")).toBe(true);
    expect(reloaded.stampCount("kai")).toBe(1);
  });

  it("lists stamps in the order they were earned", () => {
    const p = createPassportStore(memoryKeyValue());
    p.earnStamp("ava", "BRA", 3000);
    p.earnStamp("ava", "JPN", 1000);
    p.earnStamp("ava", "FRA", 2000);

    expect(p.listStamps("ava").map((s) => s.countryCode)).toEqual([
      "JPN",
      "FRA",
      "BRA",
    ]);
  });

  it("recovers from corrupt stored data", () => {
    const kv = memoryKeyValue({ "wc.passport.ava": "{not json" });
    const p = createPassportStore(kv);

    expect(p.stampCount("ava")).toBe(0);
    // ...and earning still works, replacing the corrupt blob.
    p.earnStamp("ava", "BRA", 1000);
    expect(p.hasStamp("ava", "BRA")).toBe(true);
  });
});
