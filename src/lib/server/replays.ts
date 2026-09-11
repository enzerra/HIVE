import { randomUUID } from "node:crypto";
import { snapshot, exampleReplay, AppError } from "./engine";
import type { createWorld } from "./engine";
type Replay = ReturnType<typeof exampleReplay>;
const memory = globalThis as unknown as {
  hivePublicReplays?: Map<string, Replay>;
  hiveReplayKeys?: Map<string, string>;
};
const published =
  memory.hivePublicReplays ??
  (memory.hivePublicReplays = new Map<string, Replay>());
const keys =
  memory.hiveReplayKeys ?? (memory.hiveReplayKeys = new Map<string, string>());
export function publishReplay(world: ReturnType<typeof createWorld>) {
  const s = snapshot(world, Date.now(), true);
  if (!s.settled || !s.totals) throw new AppError("REPLAY_PENDING", 409);
  const key = `${world.viewer.id}:${world.startedAt}`,
    existing = keys.get(key);
  if (existing && published.has(existing)) return published.get(existing)!;
  const id = `demo-${randomUUID()}`;
  const cards = exampleReplay().cards.map((c, i) => ({
    ...c,
    text: world.reports.some((r) => r.target === `card-${i}` && r.hidden)
      ? "Argumen tidak tersedia setelah moderasi."
      : i === 0
        ? world.arguments[0]
        : c.text,
  }));
  const replay: Replay = {
    id,
    results: structuredClone(s.results),
    totals: { ...s.totals },
    cards,
  };
  published.set(id, replay);
  keys.set(key, id);
  return replay;
}
export function publicReplay(id: string) {
  const replay = published.get(id);
  if (!replay)
    throw new AppError(
      "RESOURCE_NOT_FOUND",
      404,
      "Replay tidak ditemukan atau sesi server telah berakhir.",
    );
  return replay;
}
