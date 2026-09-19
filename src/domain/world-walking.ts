import type { WorldLocation } from "./types";
export type Point = { x: number; y: number };
export const WORLD_SPAWN: Point = { x: 750, y: 395 };
export const WORLD_DOORS: Record<WorldLocation["id"], Point> = {
  arena: { x: 380, y: 265 },
  hive: { x: 1280, y: 265 },
  squad: { x: 1170, y: 535 },
  pulse: { x: 590, y: 390 },
  replay: { x: 895, y: 395 },
  wisdom: { x: 760, y: 423 },
};
// Walkable paths in terrain canvas coordinates. Feet remain on plaza/bridges;
// building interiors, vegetation and island edges are outside these corridors.
// Explicit bends follow the painted stairs/bridge. Never connect island centers
// with straight chords: those chords run across transparent cliff space.
export const WALK_ROUTES: Point[][] = [
  [
    WORLD_SPAWN,
    { x: 640, y: 370 },
    { x: 585, y: 335 },
    { x: 535, y: 285 },
    { x: 475, y: 295 },
    { x: 380, y: 295 },
    WORLD_DOORS.arena,
  ],
  [
    WORLD_SPAWN,
    { x: 855, y: 345 },
    { x: 900, y: 305 },
    { x: 965, y: 275 },
    { x: 1040, y: 265 },
    { x: 1100, y: 255 },
    { x: 1160, y: 220 },
    { x: 1210, y: 250 },
    WORLD_DOORS.hive,
  ],
  [
    WORLD_SPAWN,
    { x: 850, y: 435 },
    { x: 905, y: 460 },
    { x: 960, y: 500 },
    { x: 1050, y: 535 },
    { x: 1125, y: 570 },
    { x: 1160, y: 585 },
    WORLD_DOORS.squad,
  ],
  [WORLD_SPAWN, WORLD_DOORS.pulse],
  [WORLD_SPAWN, WORLD_DOORS.replay],
  [WORLD_SPAWN, WORLD_DOORS.wisdom],
];
const paths: [Point, Point, number][] = WALK_ROUTES.flatMap((route) =>
  route.slice(1).map((p, i): [Point, Point, number] => [route[i], p, 14]),
);
const plaza = [
  { x: 590, y: 350 },
  { x: 740, y: 325 },
  { x: 890, y: 355 },
  { x: 920, y: 415 },
  { x: 850, y: 450 },
  { x: 795, y: 460 },
  { x: 715, y: 450 },
  { x: 595, y: 415 },
];
function inPlaza(p: Point) {
  let inside = false;
  for (let i = 0, j = plaza.length - 1; i < plaza.length; j = i++) {
    const a = plaza[i],
      b = plaza[j];
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    )
      inside = !inside;
  }
  return inside;
}
function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
export function canWalk(p: Point) {
  return (
    Number.isFinite(p.x) &&
    Number.isFinite(p.y) &&
    (inPlaza(p) || paths.some(([a, b, r]) => distanceToSegment(p, a, b) <= r))
  );
}
export function moveWalker(p: Point, direction: Point, seconds: number): Point {
  const length = Math.hypot(direction.x, direction.y);
  if (!length || !Number.isFinite(length)) return p;
  const distance =
    170 * Math.min(Math.max(seconds, 0), 0.05) * Math.min(length, 1);
  const dx = (direction.x / length) * distance,
    dy = (direction.y / length) * distance;
  const next = { x: p.x + dx, y: p.y + dy };
  if (canWalk(next)) return next;
  if (canWalk({ x: next.x, y: p.y })) return { x: next.x, y: p.y };
  if (canWalk({ x: p.x, y: next.y })) return { x: p.x, y: next.y };
  return p;
}
export function nearbyDoor(p: Point) {
  return (
    (Object.entries(WORLD_DOORS) as [WorldLocation["id"], Point][]).find(
      ([, door]) => Math.hypot(p.x - door.x, p.y - door.y) < 25,
    )?.[0] ?? null
  );
}
export function walkingKey(key: string): Point | null {
  return (
    (
      {
        w: { x: 0, y: -1 },
        arrowup: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        arrowdown: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        arrowleft: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        arrowright: { x: 1, y: 0 },
      } as Record<string, Point>
    )[key.toLowerCase()] ?? null
  );
}
