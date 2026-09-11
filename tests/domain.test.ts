import { describe, it, expect } from "vitest";
import {
  meanBelief,
  scoreMicro,
  wisdomMicro,
  normalizeArgument,
  validArgument,
  argumentStats,
  safeReturn,
} from "@/domain/rules";
import { exampleReplay, totals } from "@/lib/server/engine";
describe("canonical arithmetic", () => {
  it("weights Squads equally and floors integer divisions", () => {
    expect(meanBelief([1, 1, 1], [3, 4, 5])).toBe(261111);
    expect(scoreMicro(261111, "A")).toBe(45404304);
  });
  it("keeps Brier score, Wisdom Lift, and score lift distinct", () => {
    const p = 550000,
      f = 700000;
    expect(scoreMicro(f, "A")).toBe(91000000);
    expect(wisdomMicro(p, f, "A")).toBe(15000000);
    expect(scoreMicro(f, "A") - scoreMicro(p, "A")).toBe(11250000);
    expect(scoreMicro(f, "B")).toBe(51000000);
    expect(wisdomMicro(p, f, "B")).toBe(-15000000);
  });
  it("reproduces the documented three-round replay", () => {
    const r = exampleReplay();
    expect(r.results.map((v) => v.purple.score)).toEqual([
      91000000, 75000000, 91000000,
    ]);
    expect(r.results.map((v) => v.chog.score)).toEqual([
      84000000, 36000000, 96000000,
    ]);
    expect(r.totals).toEqual({
      purple: 257000000,
      chog: 216000000,
      valid: 3,
      winner: "purple",
    });
  });
  it("never turns one valid round into a match victory", () => {
    const r = exampleReplay().results;
    r[1].status = "void";
    r[2].status = "void";
    expect(totals(r).winner).toBe("no_contest");
  });
  it("rejects invalid roster counts", () => {
    expect(() => meanBelief([5], [4])).toThrow();
    expect(() => meanBelief([1], [2])).toThrow();
    expect(() => meanBelief([], [])).toThrow();
  });
});
describe("input boundaries", () => {
  it("normalizes NFC and counts words and codepoints independently", () => {
    expect(normalizeArgument(" cafe\u0301\n  bersama ")).toBe("café bersama");
    expect(argumentStats("👋 hello").characters).toBe(7);
    expect(validArgument(Array(31).fill("a").join(" "))).toBe(false);
    expect(validArgument("a".repeat(241))).toBe(false);
    expect(validArgument("a".repeat(240))).toBe(true);
    expect(validArgument("   ")).toBe(false);
  });
  it("rejects external and malformed return intents", () => {
    expect(safeReturn("https://evil.example")).toBe("/home");
    expect(safeReturn("//evil.example")).toBe("/home");
    expect(safeReturn("/home\\evil")).toBe("/home");
    expect(safeReturn("/arena/founding-001/lobby")).toBe(
      "/arena/founding-001/lobby",
    );
  });
});
