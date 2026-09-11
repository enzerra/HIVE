import { describe, expect, it } from "vitest";
import {
  advanceQuickCall,
  discussQuickCall,
  lockQuickCall,
  publicQuickCall,
  quickCall,
  reviseQuickCall,
  voidQuickCall,
} from "@/lib/server/quick-calls";

const viewer = () => `test-${crypto.randomUUID()}`;

describe("Quick Pulse disclosure and lifecycle", () => {
  it("hides aggregate belief and discussion until the first lock", () => {
    const id = viewer();
    const before = quickCall(id);
    expect(before.belief).toBeNull();
    expect(before.discussion).toEqual([]);

    const after = lockQuickCall(id, "B", "Peak hour Dota belum dimulai.");
    expect(after.stage).toBe("discussing");
    expect(after.belief).toEqual({ a: 570000, b: 430000 });
    expect(after.discussion.length).toBeGreaterThan(0);
  });

  it("resolves from initial belief to final belief with evidence", () => {
    const id = viewer();
    lockQuickCall(id, "B", "Saya menimbang jadwal komunitas kedua game.");
    discussQuickCall(
      id,
      "Nara",
      2,
      "Pertumbuhan relatif adalah metrik kuncinya.",
    );
    reviseQuickCall(id, "A");
    expect(advanceQuickCall(id).stage).toBe("resolving");
    const result = advanceQuickCall(id);

    expect(result.stage).toBe("resolved");
    expect(result.outcome).toBe("A");
    expect(result.score).toBe(100000000);
    expect(result.wisdomLift).toBe(100000000);
    expect(result.evidence?.a.growth).toBe("+12%");
  });

  it("voids safely without declaring an outcome or changing reputation", () => {
    const id = viewer();
    lockQuickCall(id, "A", "CS2 menunjukkan momentum awal yang lebih kuat.");
    const result = voidQuickCall(id);
    expect(result.stage).toBe("void");
    expect(result.outcome).toBeNull();
    expect(result.score).toBeNull();
    expect(result.evidence).toBeNull();
    expect(() => reviseQuickCall(id, "B")).toThrowError();
  });

  it("exposes a resolved public proof without personal data", () => {
    const result = publicQuickCall();
    expect(result.stage).toBe("resolved");
    expect(result.outcome).toBe("A");
    expect(result.evidence).not.toBeNull();
    expect(result.belief).toEqual({ a: 570000, b: 430000 });
    expect(result.initialChoice).toBeNull();
    expect(result.reason).toBe("");
    expect(result.discussion).toEqual([]);
  });
});
