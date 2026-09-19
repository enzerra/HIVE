import { describe, expect, it } from "vitest";
import {
  canWalk,
  moveWalker,
  nearbyDoor,
  WORLD_DOORS,
  WORLD_SPAWN,
  walkingKey,
  WALK_ROUTES,
} from "../src/domain/world-walking";
describe("World walking", () => {
  it("keeps spawn and all door approaches reachable", () => {
    expect(canWalk(WORLD_SPAWN)).toBe(true);
    for (const [id, p] of Object.entries(WORLD_DOORS)) {
      expect(canWalk(p)).toBe(true);
      expect(nearbyDoor(p)).toBe(id);
    }
    expect(nearbyDoor(WORLD_SPAWN)).toBeNull();
  });
  it("rejects island edges, building interiors and invalid positions", () => {
    for (const p of [
      { x: 0, y: 0 },
      { x: 360, y: 200 },
      { x: 1230, y: 200 },
      { x: 1500, y: 900 },
      { x: NaN, y: 400 },
    ])
      expect(canWalk(p)).toBe(false);
  });
  it("normalizes diagonal speed and clamps background frame jumps", () => {
    const straight = moveWalker(WORLD_SPAWN, { x: 1, y: 0 }, 0.02);
    const diagonal = moveWalker(WORLD_SPAWN, { x: 1, y: 1 }, 0.02);
    expect(
      Math.hypot(diagonal.x - WORLD_SPAWN.x, diagonal.y - WORLD_SPAWN.y),
    ).toBeCloseTo(straight.x - WORLD_SPAWN.x);
    const resumed = moveWalker(WORLD_SPAWN, { x: 1, y: 0 }, 10);
    expect(resumed.x - WORLD_SPAWN.x).toBeLessThanOrEqual(8.5);
  });
  it("cannot walk through the Arena or beyond its approach", () => {
    let p = WORLD_DOORS.arena;
    for (let i = 0; i < 500; i++) p = moveWalker(p, { x: 0, y: -1 }, 0.05);
    expect(canWalk(p)).toBe(true);
    expect(p.y).toBeGreaterThanOrEqual(251);
  });
  it("blocks the former cliff shortcuts and follows every approach continuously", () => {
    for (const point of [
      { x: 1100, y: 350 },
      { x: 1230, y: 355 },
      { x: 1140, y: 700 },
      { x: 550, y: 550 },
      { x: 760, y: 620 },
    ])
      expect(canWalk(point)).toBe(false);
    for (const route of WALK_ROUTES) {
      let p = route[0];
      for (const target of route.slice(1)) {
        for (
          let i = 0;
          i < 200 && Math.hypot(target.x - p.x, target.y - p.y) > 5;
          i++
        )
          p = moveWalker(p, { x: target.x - p.x, y: target.y - p.y }, 0.025);
        expect(Math.hypot(target.x - p.x, target.y - p.y)).toBeLessThanOrEqual(
          5,
        );
      }
    }
  });
  it("maps only movement keys and never treats chat letters as interactions", () => {
    expect(walkingKey("ArrowUp")).toEqual({ x: 0, y: -1 });
    expect(walkingKey("W")).toEqual({ x: 0, y: -1 });
    expect(walkingKey("e")).toBeNull();
  });
});
