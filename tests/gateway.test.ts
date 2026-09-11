import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/[...route]/route";
import {
  createWorld,
  worlds,
  start,
  snapshot,
  decide,
  sendChat,
  saveArgument,
  resetMatch,
  position,
} from "@/lib/server/engine";
import { publishReplay, publicReplay } from "@/lib/server/replays";
const real = Date.UTC(2026, 8, 10, 10);
function player() {
  const w = createWorld();
  w.viewer.squadId = "aster";
  w.viewer.hiveId = "purple";
  w.viewer.onboarded = true;
  w.ready = true;
  start(w);
  return w;
}
function move(w: ReturnType<typeof createWorld>, seconds: number) {
  w.offset = seconds * 1000;
}
function commit(
  w: ReturnType<typeof createWorld>,
  stage: "initial" | "final",
  choice: "A" | "B" = "A",
  attribution?: string,
  key = randomUUID(),
) {
  return decide(w, {
    stage,
    choice,
    key,
    round: position(w).round + 1,
    attribution,
  });
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(real);
  worlds.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
describe("phase authority and disclosure", () => {
  it("applies all seven exact phase boundaries", () => {
    const w = player();
    for (const [sec, phase] of [
      [0, "think"],
      [20, "deliberate"],
      [80, "commit"],
      [95, "reveal"],
      [105, "council"],
      [165, "revision"],
      [185, "resolve"],
    ] as const) {
      move(w, sec);
      expect(snapshot(w).phase).toBe(phase);
    }
    move(w, 190);
    expect(snapshot(w).round).toBe(2);
  });
  it("does not disclose initial, final, future outcomes, or private choices to spectators", () => {
    const w = player();
    move(w, 80);
    commit(w, "initial");
    move(w, 81);
    let view = snapshot(w, real, true);
    expect(view.initial).toBeNull();
    expect(view.final).toBeNull();
    expect(view.own.initialChoice).toBeNull();
    expect(view.chat).toEqual([]);
    expect(view.cards).toEqual([]);
    expect(
      view.results.every(
        (r) =>
          r.outcome === null &&
          r.purple.final === null &&
          r.purple.score === null &&
          !r.purple.forfeit,
      ),
    ).toBe(true);
    move(w, 95);
    view = snapshot(w, real, true);
    expect(view.initial?.purple).toBe(550000);
    expect(view.final).toBeNull();
    move(w, 165);
    commit(w, "final");
    move(w, 186);
    expect(snapshot(w).results[0].purple.final).toBeNull();
    move(w, 190);
    expect(snapshot(w).results[0].purple.final).toBe(700000);
    expect(snapshot(w).results[0].outcome).toBeNull();
  });
  it("distinguishes accepted, submitted, and canonical receipts", () => {
    const w = player();
    move(w, 80);
    expect(commit(w, "initial")?.state).toBe("service_accepted");
    move(w, 80.3);
    expect(snapshot(w).own.initialReceipt?.state).toBe("chain_submitted");
    move(w, 80.7);
    expect(snapshot(w).own.initialReceipt?.state).toBe("canonical_locked");
  });
  it("fails a too-late canonical lock and blocks final revision", () => {
    const w = player();
    move(w, 94.8);
    commit(w, "initial");
    move(w, 95);
    expect(snapshot(w).own.initialReceipt?.state).toBe("failed");
    move(w, 165);
    expect(() => commit(w, "final")).toThrow("INITIAL_REQUIRED");
  });
  it("rejects out-of-phase mutations and enforces representative role", () => {
    const w = player();
    expect(() => commit(w, "initial")).toThrow("PHASE_CLOSED");
    expect(() => sendChat(w, "hello")).toThrow("PHASE_CLOSED");
    move(w, 20);
    sendChat(w, "Ayo pikirkan bukti.");
    expect(snapshot(w).chat.at(-1)?.text).toBe("Ayo pikirkan bukti.");
    expect(() => saveArgument(w, "Alasan jelas.")).toThrow("ACTION_FORBIDDEN");
    w.viewer.role = "representative";
    saveArgument(w, "Alasan jelas.");
    move(w, 80);
    expect(() => saveArgument(w, "Terlambat")).toThrow("ACTION_FORBIDDEN");
  });
  it("reuses an identical idempotency key and rejects a changed payload", () => {
    const w = player();
    move(w, 80);
    const key = randomUUID(),
      a = commit(w, "initial", "A", undefined, key),
      b = commit(w, "initial", "A", undefined, key);
    expect(a?.id).toBe(b?.id);
    expect(w.receipts[0]).toHaveLength(1);
    expect(() => commit(w, "initial", "B", undefined, key)).toThrow(
      "IDEMPOTENCY_CONFLICT",
    );
  });
  it("validates switch attribution and removes moderated text from payload", () => {
    const w = player();
    move(w, 80);
    commit(w, "initial");
    move(w, 165);
    expect(() => commit(w, "final", "B")).toThrow("ATTRIBUTION_REQUIRED");
    expect(() => commit(w, "final", "B", "card-0")).toThrow(
      "INVALID_ATTRIBUTION",
    );
    expect(() => commit(w, "final", "B", "arbitrary")).toThrow(
      "INVALID_ATTRIBUTION",
    );
    w.reports.push({
      id: "r",
      target: "card-1",
      reason: "review",
      hidden: true,
    });
    expect(snapshot(w).cards[1].text).toBe("");
    expect(() => commit(w, "final", "B", "card-1")).toThrow(
      "INVALID_ATTRIBUTION",
    );
    expect(commit(w, "final", "B", "own-reasoning")?.state).toBe(
      "service_accepted",
    );
  });
  it("defaults a missing final call to Stay but forfeits a failed final reveal", () => {
    const w = player();
    move(w, 80);
    commit(w, "initial");
    move(w, 190);
    expect(snapshot(w).results[0].purple.forfeit).toBe(false);
    resetMatch(w);
    w.ready = true;
    start(w);
    move(w, 80);
    commit(w, "initial");
    move(w, 184.8);
    commit(w, "final");
    move(w, 190);
    expect(snapshot(w).results[0].purple.forfeit).toBe(true);
  });
  it("settles canonical totals and publishes only a public replay projection", () => {
    const w = player();
    for (let r = 0; r < 3; r++) {
      move(w, r * 190 + 80);
      commit(w, "initial");
      move(w, r * 190 + 165);
      commit(w, "final");
    }
    move(w, 2371);
    const s = snapshot(w);
    expect(s.totals?.purple).toBe(257000000);
    expect(s.totals?.winner).toBe("purple");
    const replay = publishReplay(w);
    expect(publicReplay(replay.id)).toEqual(replay);
    expect(publishReplay(w).id).toBe(replay.id);
    expect(JSON.stringify(replay)).not.toContain(w.viewer.id);
    expect(replay).not.toHaveProperty("own");
    expect(replay).not.toHaveProperty("chat");
  });
  it("requires eligibility before starting even if readiness is tampered", () => {
    const w = createWorld();
    w.ready = true;
    expect(() => start(w)).toThrow("ELIGIBILITY_REQUIRED");
  });
  it("does not announce draw/no-contest before outcome", () => {
    const w = player();
    w.scenario = "draw";
    expect(snapshot(w).totals).toBeNull();
    for (let r = 0; r < 3; r++) {
      move(w, r * 190 + 80);
      commit(w, "initial");
    }
    move(w, 2371);
    expect(snapshot(w).totals?.winner).toBe("draw");
    w.scenario = "no_contest";
    expect(snapshot(w).totals?.winner).toBe("no_contest");
  });
});
async function request(
  path: string,
  body?: unknown,
  cookie?: string,
  origin = "http://127.0.0.1:3000",
) {
  const req = new NextRequest(`http://localhost:3000/api/v1/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      host: "127.0.0.1:3000",
      origin,
      ...(cookie ? { cookie: `hive_demo_session=${cookie}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return (body === undefined ? GET : POST)(req, {
    params: Promise.resolve({ route: path.split("/") }),
  });
}
describe("HTTP gateway boundaries", () => {
  it("enforces onboarding order and retains a created Squad name", async () => {
    const w = createWorld();
    expect((await request("onboarding/complete", {}, w.viewer.id)).status).toBe(
      409,
    );
    expect(
      (
        await request(
          "onboarding/squad",
          { action: "join", squadId: "aster" },
          w.viewer.id,
        )
      ).status,
    ).toBe(409);
    await request(
      "onboarding/identity",
      { handle: "TestHuman", avatar: 2 },
      w.viewer.id,
    );
    await request(
      "onboarding/squad",
      { action: "create", name: "New Horizon" },
      w.viewer.id,
    );
    expect(w.viewer.squadName).toBe("New Horizon");
    await request("onboarding/hive", { hiveId: "purple" }, w.viewer.id);
    expect((await request("onboarding/complete", {}, w.viewer.id)).status).toBe(
      200,
    );
  });
  it("supports localhost normalization without accepting unrelated origins", async () => {
    const good = await request("demo/session", {});
    expect(good.status).toBe(200);
    expect(good.headers.get("set-cookie")).toContain("HttpOnly");
    const bad = await request(
      "demo/session",
      {},
      undefined,
      "https://other.example",
    );
    expect(bad.status).toBe(403);
  });
  it("requires sessions and operator role on protected resources", async () => {
    expect((await request("matches/current/snapshot")).status).toBe(401);
    const w = createWorld();
    expect(
      (await request("operator/reports", undefined, w.viewer.id)).status,
    ).toBe(403);
  });
  it("never silently uses demo data in live mode", async () => {
    vi.stubEnv("HIVE_DATA_MODE", "live");
    expect((await request("hives")).status).toBe(503);
  });
  it("locks roster membership after match start", async () => {
    const w = player();
    expect(
      (await request("onboarding/squad", { action: "defer" }, w.viewer.id))
        .status,
    ).toBe(409);
  });
  it("invalidates the session at logout", async () => {
    const w = createWorld();
    expect((await request("auth/logout", {}, w.viewer.id)).status).toBe(200);
    expect((await request("home", undefined, w.viewer.id)).status).toBe(401);
  });
});
