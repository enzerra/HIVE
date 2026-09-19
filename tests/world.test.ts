import { describe, expect, it } from "vitest";
import { buildWorldLocations } from "@/domain/world";
import {
  WORLD_SCENE,
  modifiedNavigation,
  worldEntrance,
} from "@/components/world-scene-config";

const base = {
  onboarded: true,
  squadId: "aster",
  squadName: "Aster",
  squadSize: 4,
  match: { started: false, finishedPlaying: false, settled: false },
  call: {
    id: "steam-rivals-001",
    stage: "open" as const,
    participants: 127,
    initialLocked: false,
  },
};

describe("HIVE World projection", () => {
  it("keeps unavailable data neutral and never invents online counts", () => {
    const missing = buildWorldLocations({
      ...base,
      match: null,
      call: null,
      squadId: null,
    });
    expect(missing.find((item) => item.id === "arena")).toMatchObject({
      status: "idle",
      visualState: "unknown",
    });
    expect(missing.every((item) => item.activityCount === null)).toBe(true);
    const stale = buildWorldLocations({
      ...base,
      unavailable: true,
      match: { started: true, settled: true, finishedPlaying: true },
    });
    expect(stale.find((item) => item.id === "arena")?.status).toBe("idle");
    expect(stale.find((item) => item.id === "pulse")).toMatchObject({
      status: "idle",
      activityCount: null,
    });
    expect(stale.find((item) => item.id === "replay")?.status).toBe("idle");
  });
  it("preserves onboarding even if a partial profile already has a Squad", () => {
    const locations = buildWorldLocations({ ...base, onboarded: false });
    for (const id of ["arena", "squad", "pulse"]) {
      const item = locations.find((location) => location.id === id)!;
      expect(item.status).toBe("locked");
      expect(worldEntrance(item)).toBe("/onboarding/identity");
    }
  });
  it("uses the Arena district entrance without losing the match destination", () => {
    for (const match of [
      base.match,
      { started: true, settled: false, finishedPlaying: false },
      { started: true, settled: false, finishedPlaying: true },
      { started: true, settled: true, finishedPlaying: true },
    ]) {
      const item = buildWorldLocations({ ...base, match }).find(
        (location) => location.id === "arena",
      )!;
      expect(worldEntrance(item)).toBe("/arena");
      if (match.finishedPlaying && !match.settled)
        expect(item).toMatchObject({
          status: "active",
          visualState: "outcome-pending",
        });
    }
  });
  it("preserves native modifier clicks and all six scene destinations", () => {
    const plain = {
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      defaultPrevented: false,
    };
    expect(modifiedNavigation(plain)).toBe(false);
    for (const key of [
      "metaKey",
      "ctrlKey",
      "shiftKey",
      "altKey",
      "defaultPrevented",
    ])
      expect(modifiedNavigation({ ...plain, [key]: true })).toBe(true);
    expect(modifiedNavigation({ ...plain, button: 1 })).toBe(true);
    const locations = buildWorldLocations(base);
    expect(new Set(WORLD_SCENE.map((item) => item.id))).toEqual(
      new Set(locations.map((item) => item.id)),
    );
    for (const item of locations.filter((item) => item.id !== "arena"))
      expect(worldEntrance(item)).toBe(item.destination);
    for (const scene of WORLD_SCENE) {
      expect(scene.camera.x).toBeGreaterThan(0);
      expect(scene.camera.x).toBeLessThan(1536);
      expect(scene.camera.y).toBeLessThan(1024);
      expect(scene.hitPolygon.split(" ").length).toBeGreaterThan(4);
    }
  });
  it("maps real match and call state onto meaningful locations", () => {
    const locations = buildWorldLocations(base);
    const arena = locations.find((item) => item.id === "arena");
    const pulse = locations.find((item) => item.id === "pulse");
    const squad = locations.find((item) => item.id === "squad");

    expect(arena).toMatchObject({
      status: "active",
      visualState: "lobby-open",
      destination: "/arena/founding-001",
      activityCount: null,
    });
    expect(pulse).toMatchObject({
      status: "live",
      visualState: "call-open",
      destination: "/calls/steam-rivals-001",
      activityCount: 127,
    });
    expect(squad).toMatchObject({
      status: "active",
      activityCount: 4,
      destination: "/squads/aster",
    });
  });

  it("routes a live match and a resolved call to their current destinations", () => {
    const locations = buildWorldLocations({
      ...base,
      match: { started: true, finishedPlaying: false, settled: false },
      call: { ...base.call, stage: "resolved" },
    });

    expect(locations.find((item) => item.id === "arena")).toMatchObject({
      status: "live",
      visualState: "match-live",
      destination: "/arena/founding-001/play",
    });
    expect(locations.find((item) => item.id === "pulse")).toMatchObject({
      status: "attention",
      visualState: "outcome-ready",
      destination: "/calls/steam-rivals-001/result",
    });
  });

  it("turns settled activity into result and replay signals", () => {
    const locations = buildWorldLocations({
      ...base,
      match: { started: true, finishedPlaying: true, settled: true },
    });

    expect(locations.find((item) => item.id === "arena")).toMatchObject({
      status: "attention",
      visualState: "result-ready",
      destination: "/arena/founding-001/results",
    });
    expect(locations.find((item) => item.id === "replay")).toMatchObject({
      status: "attention",
      visualState: "new-replay",
      activityCount: null,
    });
  });

  it("keeps navigation usable without inventing activity", () => {
    const locations = buildWorldLocations({
      ...base,
      squadId: null,
      squadName: null,
      squadSize: 0,
      match: null,
      call: null,
    });

    expect(locations.find((item) => item.id === "squad")).toMatchObject({
      status: "attention",
      activityCount: null,
      destination: "/onboarding/squad",
    });
    expect(locations.find((item) => item.id === "pulse")).toMatchObject({
      status: "idle",
      activityCount: null,
      destination: "/calls",
    });
  });
});
