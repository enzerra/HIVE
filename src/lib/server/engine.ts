import { randomUUID } from "node:crypto";
import {
  BOUNDARIES,
  meanBelief,
  scoreMicro,
  wisdomMicro,
  normalizeArgument,
  validArgument,
} from "@/domain/rules";
import {
  PHASES,
  type Viewer,
  type Receipt,
  type Result,
  type MatchView,
  type Scenario,
  type Notification,
  type Choice,
  type PublicReceipt,
} from "@/domain/types";

export class AppError extends Error {
  constructor(
    public code: string,
    public status = 400,
    message = code,
  ) {
    super(message);
  }
}
type World = {
  viewer: Viewer;
  onboardingStep?: number;
  startedAt: number | null;
  offset: number;
  ready: boolean;
  version: number;
  scenario: Scenario;
  receipts: Receipt[][];
  arguments: string[];
  chat: { id: string; author: string; text: string; avatar: number }[][];
  notifications: Notification[];
  following: string[];
  reports: { id: string; target: string; reason: string; hidden: boolean }[];
  events: { id: string; title: string; date: string }[];
};
const globalStore = globalThis as unknown as {
  hiveWorlds?: Map<string, World>;
};
export const worlds: Map<string, World> =
  globalStore.hiveWorlds ?? (globalStore.hiveWorlds = new Map<string, World>());
const initialVectors = [
  [3, 1, 4, 1, 2],
  [2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2],
];
const finalVectors = [
  [4, 2, 4, 2, 2],
  [2, 2, 2, 2, 2],
  [1, 1, 2, 1, 1],
];
const rivals = [
  [3, 2, 3, 2, 2],
  [3, 3, 3, 3, 4],
  [1, 1, 1, 1, 0],
];
const argumentText = [
  "Momentum terakhir mendukung A, tetapi kita perlu melihat pertumbuhan relatif, bukan hanya jumlah pemain awal.",
  "Lonjakan belum tentu bertahan. Pola pemain sore ini memberi alasan untuk mempertimbangkan B.",
  "A punya aktivitas komunitas yang kuat. Kami melihat tanda bahwa pertumbuhannya dapat berlanjut.",
  "Basis awal yang lebih kecil bisa membuat pertumbuhan relatif B lebih besar.",
  "Kami masih terbagi. Kedua game memiliki sinyal menarik, tetapi bukti saat ini belum cukup kuat.",
];
export function createWorld() {
  const id = randomUUID();
  const w: World = {
    viewer: {
      id,
      handle: "Nara",
      avatar: 0,
      squadId: null,
      hiveId: null,
      onboarded: false,
      deferred: false,
      role: "member",
      preferences: {
        theme: "system",
        motion: "system",
        sound: false,
        presence: true,
        reminders: true,
      },
    },
    startedAt: null,
    onboardingStep: 0,
    offset: 0,
    ready: false,
    version: 1,
    scenario: "normal",
    receipts: [[], [], []],
    arguments: [...Array(3)].map(() => argumentText[0]),
    chat: [0, 1, 2].map((i) => [
      {
        id: `chat-${i}`,
        author: "Raka",
        text: "Coba lihat pertumbuhan relatifnya, bukan jumlah pemainnya saja.",
        avatar: 1,
      },
    ]),
    notifications: [
      {
        id: "n1",
        title: "Aster menunggumu",
        body: "Lengkapi identitasmu dan kenali Squad-mu.",
        href: "/squads/aster",
        read: false,
      },
      {
        id: "n2",
        title: "Satu cerita, banyak sudut pandang",
        body: "Replay Purple vs Chog bisa kamu baca sekarang.",
        href: "/replays/founding-001",
        read: false,
      },
    ],
    following: [],
    reports: [],
    events: [],
  };
  worlds.set(id, w);
  return w;
}
export function getWorld(id: string | undefined) {
  return id ? worlds.get(id) : undefined;
}
export function needWorld(id: string | undefined) {
  const w = getWorld(id);
  if (!w) throw new AppError("SESSION_REQUIRED", 401);
  return w;
}
export function clock(w: World, real = Date.now()) {
  return real + w.offset;
}
export function position(w: World, real = Date.now()) {
  const now = clock(w, real);
  const elapsed =
    w.startedAt === null ? 0 : Math.max(0, (now - w.startedAt) / 1000);
  const round = Math.min(2, Math.floor(elapsed / 190));
  const local = elapsed - round * 190;
  const phaseIndex = Math.min(
    6,
    BOUNDARIES.slice(1).findIndex((b) => local < b),
  );
  const index = phaseIndex < 0 ? 6 : phaseIndex;
  return {
    now,
    elapsed,
    round,
    index,
    phase: PHASES[index],
    finished: elapsed >= 570,
    deadline:
      w.startedAt === null
        ? null
        : w.startedAt + (round * 190 + BOUNDARIES[index + 1]) * 1000,
  };
}
function updateReceipt(r: Receipt, now: number) {
  const after = now - r.at;
  r.state =
    r.at + 600 >= r.deadline
      ? "failed"
      : after >= 600
        ? "canonical_locked"
        : after >= 200
          ? "chain_submitted"
          : "service_accepted";
  return r;
}
function receipt(
  w: World,
  round: number,
  stage: "initial" | "final",
  now: number,
) {
  const r = w.receipts[round].find((r) => r.stage === stage);
  return r ? updateReceipt(r, now) : null;
}
function publicReceipt(r: Receipt | null): PublicReceipt | null {
  return r
    ? { id: r.id, key: r.key, stage: r.stage, state: r.state, at: r.at }
    : null;
}
function beliefs(w: World, round: number, now: number) {
  const ri = receipt(w, round, "initial", now),
    rf = receipt(w, round, "final", now);
  const baseI = [...initialVectors[round]],
    baseF = [...finalVectors[round]];
  const seededI: Choice = "A";
  const seededF: Choice = "A";
  const failed =
    w.scenario === "forfeit" ||
    !ri ||
    ri.state !== "canonical_locked" ||
    !!(rf && rf.state !== "canonical_locked");
  if (ri) {
    baseI[0] += (ri.choice === "A" ? 1 : 0) - (seededI === "A" ? 1 : 0);
    baseF[0] +=
      ((rf?.choice ?? ri.choice) === "A" ? 1 : 0) - (seededF === "A" ? 1 : 0);
  }
  if (w.scenario === "draw")
    return { initial: 500000, final: 500000, chog: 500000, failed };
  return {
    initial: meanBelief(baseI),
    final: meanBelief(baseF),
    chog: meanBelief(rivals[round]),
    failed,
  };
}
function result(w: World, round: number, now: number, example = false): Result {
  const elapsed = w.startedAt === null ? -1 : (now - w.startedAt) / 1000;
  const initialOpen = example || elapsed >= round * 190 + 95;
  const finalOpen = example || elapsed >= (round + 1) * 190;
  const available = example || elapsed >= (round + 1) * 190 + 1800;
  const b = beliefs(w, round, now),
    fail = !example && finalOpen && b.failed;
  const outcome: Choice =
    w.scenario === "negative" ? "B" : round === 0 ? "A" : "B";
  const voided =
    (w.scenario === "void" && round === 1) ||
    (w.scenario === "no_contest" && round > 0);
  const initial = example ? meanBelief(initialVectors[round]) : b.initial,
    final = example ? meanBelief(finalVectors[round]) : b.final;
  const status = !available ? "pending" : voided ? "void" : "resolved";
  const validInitial =
    example || receipt(w, round, "initial", now)?.state === "canonical_locked";
  return {
    round: round + 1,
    outcome: status === "resolved" ? outcome : null,
    status,
    purple: {
      initial: initialOpen && !fail && validInitial ? initial : null,
      final: finalOpen && !fail ? final : null,
      score:
        status !== "resolved" ? null : fail ? 0 : scoreMicro(final, outcome),
      lift:
        status !== "resolved" || fail
          ? null
          : wisdomMicro(initial, final, outcome),
      scoreLift:
        status !== "resolved" || fail
          ? null
          : scoreMicro(final, outcome) - scoreMicro(initial, outcome),
      forfeit: fail,
    },
    chog: {
      initial: initialOpen ? b.chog : null,
      final: finalOpen ? b.chog : null,
      score: status === "resolved" ? scoreMicro(b.chog, outcome) : null,
      lift: status === "resolved" ? 0 : null,
      scoreLift: status === "resolved" ? 0 : null,
      forfeit: false,
    },
  };
}
export function totals(results: Result[]) {
  const resolved = results.filter((r) => r.status === "resolved");
  const valid = resolved.length,
    purple = resolved.reduce((s, r) => s + (r.purple.score ?? 0), 0),
    chog = resolved.reduce((s, r) => s + (r.chog.score ?? 0), 0);
  return {
    purple,
    chog,
    valid,
    winner:
      valid < 2
        ? ("no_contest" as const)
        : purple === chog
          ? ("draw" as const)
          : purple > chog
            ? ("purple" as const)
            : ("chog" as const),
  };
}
export function exampleReplay() {
  const w = createWorld();
  worlds.delete(w.viewer.id);
  const results = [0, 1, 2].map((r) => result(w, r, 0, true));
  return {
    id: "founding-001",
    results,
    totals: totals(results),
    cards: argumentText.map((text, i) => ({
      id: `card-${i}`,
      squad: ["Aster", "Orbit", "Moss", "Echo", "Nova"][i],
      symbol: i,
      belief: [750000, 250000, 1000000, 250000, 500000][i],
      text,
    })),
  };
}
export function snapshot(
  w: World,
  real = Date.now(),
  spectator = false,
): MatchView {
  const p = position(w, real),
    b = beliefs(w, p.round, p.now);
  const started = w.startedAt !== null,
    initialAllowed = started && (p.index >= 3 || p.finished),
    finalAllowed = started && p.elapsed >= (p.round + 1) * 190;
  const ri = receipt(w, p.round, "initial", p.now),
    rf = receipt(w, p.round, "final", p.now);
  const rawResults = [0, 1, 2].map((r) => result(w, r, p.now));
  const settled = started && rawResults.every((r) => r.status !== "pending");
  const results = rawResults;
  return {
    id: "current",
    version: w.version + Math.floor(p.elapsed),
    serverNow: p.now,
    started,
    ready: w.ready,
    round: p.round + 1,
    phase: p.phase,
    phaseIndex: p.index,
    deadline: p.finished ? null : p.deadline,
    finishedPlaying: p.finished,
    settled,
    scenario: w.scenario,
    initial: initialAllowed
      ? {
          purple: ri?.state === "canonical_locked" ? b.initial : null,
          chog: b.chog,
        }
      : null,
    final: finalAllowed
      ? { purple: b.failed ? null : b.final, chog: b.chog }
      : null,
    own: spectator
      ? {
          initialChoice: null,
          finalChoice: null,
          initialReceipt: null,
          finalReceipt: null,
          defaulted: false,
        }
      : {
          initialChoice: ri?.choice ?? null,
          finalChoice: rf?.choice ?? null,
          initialReceipt: publicReceipt(ri),
          finalReceipt: publicReceipt(rf),
          defaulted: finalAllowed && !rf && !!ri,
        },
    cards:
      initialAllowed && p.index >= 4
        ? argumentText.map((text, i) => ({
            id: `r${p.round + 1}-card-${i}`,
            squad: ["Aster", "Orbit", "Moss", "Echo", "Nova"][i],
            symbol: i,
            belief:
              i === 0
                ? ri?.state !== "canonical_locked"
                  ? null
                  : (initialVectors[p.round][0] - (ri.choice === "B" ? 1 : 0)) *
                    250000
                : initialVectors[p.round][i] * 250000,
            text: w.reports.some((r) => r.target === `card-${i}` && r.hidden)
              ? ""
              : i === 0
                ? w.arguments[p.round]
                : text,
            unavailable: w.reports.some(
              (r) => r.target === `card-${i}` && r.hidden,
            ),
          }))
        : [],
    chat: spectator || !started || p.index === 0 ? [] : w.chat[p.round],
    argument:
      spectator || !started || p.index === 0 ? "" : w.arguments[p.round],
    canEditArgument:
      !spectator &&
      w.viewer.role === "representative" &&
      p.phase === "deliberate",
    results,
    totals: settled ? totals(results) : null,
    outcomeAt:
      w.startedAt === null
        ? null
        : w.startedAt + ((p.round + 1) * 190 + 1800) * 1000,
  };
}
export function start(w: World) {
  if (w.viewer.squadId !== "aster" || w.viewer.deferred || !w.viewer.onboarded)
    throw new AppError("ELIGIBILITY_REQUIRED", 403);
  if (!w.ready) throw new AppError("NOT_READY", 409);
  if (w.startedAt === null) {
    w.startedAt = clock(w);
    w.version++;
  }
  return snapshot(w);
}
export function advance(w: World) {
  const p = position(w);
  if (w.startedAt === null) return start(w);
  const target = p.finished
    ? w.startedAt + (570 + 1800) * 1000 + 1
    : p.deadline! + 1;
  w.offset += Math.max(0, target - p.now);
  w.version++;
  return snapshot(w);
}
export function decide(
  w: World,
  body: {
    stage: "initial" | "final";
    choice: Choice;
    key: string;
    round: number;
    attribution?: string;
  },
  real = Date.now(),
) {
  const p = position(w, real);
  if (w.startedAt === null || w.viewer.deferred || w.viewer.squadId !== "aster")
    throw new AppError("ACTION_FORBIDDEN", 403);
  const existing = w.receipts.flat().find((r) => r.key === body.key);
  if (existing) {
    if (
      existing.choice !== body.choice ||
      existing.stage !== body.stage ||
      existing.attribution !== body.attribution ||
      !w.receipts[body.round - 1]?.includes(existing)
    )
      throw new AppError("IDEMPOTENCY_CONFLICT", 409);
    return publicReceipt(updateReceipt(existing, p.now));
  }
  if (
    p.finished ||
    body.round !== p.round + 1 ||
    p.phase !== (body.stage === "initial" ? "commit" : "revision")
  )
    throw new AppError("PHASE_CLOSED", 409);
  if (w.receipts[p.round].some((r) => r.stage === body.stage))
    throw new AppError("ALREADY_COMMITTED", 409);
  if (body.stage === "final") {
    const initial = receipt(w, p.round, "initial", p.now);
    if (initial?.state !== "canonical_locked")
      throw new AppError("INITIAL_REQUIRED", 409);
    if (initial.choice !== body.choice && !body.attribution)
      throw new AppError("ATTRIBUTION_REQUIRED", 422);
    if (initial.choice === body.choice && body.attribution)
      throw new AppError("INVALID_ATTRIBUTION", 422);
    if (
      body.attribution &&
      (![
        "card-1",
        "card-2",
        "card-3",
        "card-4",
        "own-squad",
        "own-reasoning",
      ].includes(body.attribution) ||
        w.reports.some((r) => r.target === body.attribution && r.hidden))
    )
      throw new AppError("INVALID_ATTRIBUTION", 422);
  }
  const r: Receipt = {
    id: randomUUID(),
    key: body.key,
    stage: body.stage,
    choice: body.choice,
    state: "service_accepted",
    at: p.now,
    deadline: p.deadline!,
    attribution: body.attribution,
  };
  w.receipts[p.round].push(r);
  w.version++;
  return publicReceipt(r);
}
export function saveArgument(w: World, text: string) {
  if (
    w.startedAt === null ||
    position(w).phase !== "deliberate" ||
    w.viewer.role !== "representative" ||
    w.viewer.squadId !== "aster"
  )
    throw new AppError("ACTION_FORBIDDEN", 403);
  if (!validArgument(text)) throw new AppError("ARGUMENT_LIMIT", 422);
  w.arguments[position(w).round] = normalizeArgument(text);
  w.version++;
}
export function sendChat(w: World, text: string) {
  const p = position(w);
  if (
    w.startedAt === null ||
    w.viewer.squadId !== "aster" ||
    p.finished ||
    !["deliberate", "council"].includes(p.phase)
  )
    throw new AppError("PHASE_CLOSED", 409);
  if (!text.trim() || Array.from(text).length > 1000)
    throw new AppError("VALIDATION_FAILED", 422);
  w.chat[p.round].push({
    id: randomUUID(),
    author: w.viewer.handle,
    text: text.trim(),
    avatar: w.viewer.avatar,
  });
  w.version++;
}
export function resetMatch(w: World, scenario: Scenario = "normal") {
  w.startedAt = null;
  w.offset = 0;
  w.ready = false;
  w.receipts = [[], [], []];
  w.scenario = scenario;
  w.version++;
  return snapshot(w);
}
