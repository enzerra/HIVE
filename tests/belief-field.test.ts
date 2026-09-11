import { describe, it, expect } from "vitest";
import { fieldState, type FieldSnapshot } from "@/domain/belief-field";

const base: FieldSnapshot = {
  round: 1,
  phase: "think",
  initial: { purple: 800000, chog: 200000 },
  final: { purple: 900000, chog: 100000 },
  own: {
    initialChoice: "A",
    finalChoice: "B",
    initialReceipt: null,
    finalReceipt: null,
    defaulted: false,
  },
  cards: [
    { id: "a", squad: "Aster", symbol: 0, belief: 800000, text: "Argument" },
  ],
  finishedPlaying: false,
  settled: false,
  results: [],
};
describe("belief field disclosure", () => {
  it("neutralizes void and forfeit without inventing a winner", () => {
    const p = {
      initial: null,
      final: null,
      score: 0,
      lift: null,
      scoreLift: null,
      forfeit: true,
    };
    const s = {
      ...base,
      phase: "resolve" as const,
      finishedPlaying: true,
      results: [
        {
          round: 1,
          status: "void" as const,
          outcome: null,
          purple: p,
          chog: p,
        },
      ],
    };
    expect(fieldState(s).belief).toBeNull();
    expect(fieldState(s).neutral).toBe(true);
    const state = fieldState({
      ...s,
      results: [{ ...s.results[0], status: "pending" }],
    });
    expect(state.neutral).toBe(true);
    expect(state.status).toContain("forfeit");
  });
  it.each(["think", "deliberate", "commit"] as const)(
    "keeps injected private aggregates out of %s visuals",
    (phase) => {
      const state = fieldState({ ...base, phase });
      expect(state.belief).toBeNull();
      expect(state.cards).toEqual([]);
      expect(state.finalOpen).toBe(false);
    },
  );
  it("never renders final belief during Revision even if present in input", () => {
    expect(fieldState({ ...base, phase: "revision" }).belief).toEqual(
      base.initial,
    );
  });
  it("waits for released final values at Resolve", () => {
    expect(
      fieldState({ ...base, phase: "resolve", final: null }).finalOpen,
    ).toBe(false);
    expect(fieldState({ ...base, phase: "resolve" }).belief).toEqual(
      base.final,
    );
  });
  it("neutralizes stale data", () => {
    const state = fieldState({ ...base, phase: "council" }, true);
    expect(state.belief).toBeNull();
    expect(state.cards).toEqual([]);
    expect(state.receipt).toBeNull();
  });
  it.each([
    "service_accepted",
    "chain_submitted",
    "canonical_locked",
    "failed",
  ] as const)("labels receipt %s accurately", (receiptState) => {
    const state = fieldState({
      ...base,
      phase: "commit",
      own: {
        ...base.own,
        initialReceipt: {
          id: "r",
          key: "r",
          stage: "initial",
          state: receiptState,
          at: 0,
        },
      },
    });
    expect(state.status).toBe(
      receiptState === "canonical_locked"
        ? "Pilihan terkunci"
        : receiptState === "failed"
          ? "Penguncian gagal"
          : "Pilihan sedang dikunci",
    );
  });
});
