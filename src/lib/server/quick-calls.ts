import { randomUUID } from "node:crypto";
import {
  normalizeArgument,
  scoreMicro,
  validArgument,
  wisdomMicro,
} from "@/domain/rules";
import type { Choice, OpenCall, OpenCallStage } from "@/domain/types";
import { AppError } from "./engine";

type CallState = {
  stage: OpenCallStage;
  initialChoice: Choice | null;
  finalChoice: Choice | null;
  initialLocked: boolean;
  finalLocked: boolean;
  reason: string;
  discussion: OpenCall["discussion"];
};
const store = globalThis as unknown as {
  hiveQuickCalls?: Map<string, CallState>;
};
const states = store.hiveQuickCalls ?? (store.hiveQuickCalls = new Map());
const seededDiscussion = [
  {
    id: "call-chat-1",
    author: "Raka",
    text: "Bandingkan persentase pertumbuhannya, bukan jumlah pemain awal.",
    avatar: 1,
  },
  {
    id: "call-chat-2",
    author: "Mira",
    text: "Jam aktif komunitas kedua game bisa memengaruhi snapshot akhir.",
    avatar: 3,
  },
];
function state(viewerId: string) {
  let value = states.get(viewerId);
  if (!value) {
    value = {
      stage: "open",
      initialChoice: null,
      finalChoice: null,
      initialLocked: false,
      finalLocked: false,
      reason: "",
      discussion: [...seededDiscussion],
    };
    states.set(viewerId, value);
  }
  return value;
}
export function quickCall(viewerId: string): OpenCall {
  const s = state(viewerId);
  const resolved = s.stage === "resolved";
  const outcome: Choice | null = resolved ? "A" : null;
  const final = s.finalChoice ?? s.initialChoice;
  const initialP = s.initialChoice === "A" ? 1_000_000 : 0;
  const finalP = final === "A" ? 1_000_000 : 0;
  return {
    id: "steam-rivals-001",
    kind: "quick",
    stage: s.stage,
    title: "Steam Momentum · Quick Pulse",
    question:
      "Dalam 60 menit, game mana yang mencatat pertumbuhan relatif concurrent players lebih tinggi?",
    optionA: "Counter-Strike 2",
    optionB: "Dota 2",
    source: "Steam snapshot resolver · simulasi demo",
    metric: "Perubahan relatif concurrent players",
    window: "60 menit",
    participants: s.initialLocked ? 128 : 127,
    squads: 18,
    initialChoice: s.initialChoice,
    finalChoice: s.finalChoice,
    initialLocked: s.initialLocked,
    finalLocked: s.finalLocked,
    reason: s.reason,
    belief: s.initialLocked ? { a: 570000, b: 430000 } : null,
    discussion: s.initialLocked ? s.discussion : [],
    outcome,
    score: resolved && final ? scoreMicro(finalP, outcome!) : null,
    wisdomLift:
      resolved && final ? wisdomMicro(initialP, finalP, outcome!) : null,
    evidence: resolved
      ? {
          capturedAt: "2026-09-11T12:00:00.000Z",
          a: { start: 100000, end: 112000, growth: "+12%" },
          b: { start: 80000, end: 85600, growth: "+7%" },
        }
      : null,
  };
}
export function listQuickCalls(viewerId: string) {
  return [quickCall(viewerId)];
}
export function publicQuickCall(): OpenCall {
  return {
    ...quickCall("public-resolved-demo"),
    stage: "resolved",
    initialChoice: null,
    finalChoice: null,
    initialLocked: false,
    finalLocked: false,
    reason: "",
    belief: { a: 570000, b: 430000 },
    discussion: [],
    outcome: "A",
    score: null,
    wisdomLift: null,
    evidence: {
      capturedAt: "2026-09-11T12:00:00.000Z",
      a: { start: 100000, end: 112000, growth: "+12%" },
      b: { start: 80000, end: 85600, growth: "+7%" },
    },
  };
}
export function lockQuickCall(
  viewerId: string,
  choice: Choice,
  reason: string,
) {
  const s = state(viewerId);
  if (s.stage !== "open" || s.initialLocked)
    throw new AppError("CALL_ALREADY_LOCKED", 409);
  if (!validArgument(reason)) throw new AppError("ARGUMENT_LIMIT", 422);
  s.initialChoice = choice;
  s.initialLocked = true;
  s.reason = normalizeArgument(reason);
  s.stage = "discussing";
  return quickCall(viewerId);
}
export function reviseQuickCall(viewerId: string, choice: Choice) {
  const s = state(viewerId);
  if (s.stage !== "discussing" || !s.initialLocked)
    throw new AppError("CALL_PHASE_CLOSED", 409);
  s.finalChoice = choice;
  s.finalLocked = true;
  return quickCall(viewerId);
}
export function discussQuickCall(
  viewerId: string,
  author: string,
  avatar: number,
  text: string,
) {
  const s = state(viewerId);
  if (s.stage !== "discussing" || !s.initialLocked)
    throw new AppError("CALL_PHASE_CLOSED", 409);
  const clean = normalizeArgument(text);
  if (!clean || Array.from(clean).length > 240)
    throw new AppError("VALIDATION_FAILED", 422);
  s.discussion.push({ id: randomUUID(), author, avatar, text: clean });
  return quickCall(viewerId);
}
export function advanceQuickCall(viewerId: string) {
  const s = state(viewerId);
  if (s.stage === "discussing") {
    if (!s.finalLocked) {
      s.finalChoice = s.initialChoice;
      s.finalLocked = true;
    }
    s.stage = "resolving";
  } else if (s.stage === "resolving") s.stage = "resolved";
  else throw new AppError("CALL_PHASE_CLOSED", 409);
  return quickCall(viewerId);
}
export function voidQuickCall(viewerId: string) {
  const s = state(viewerId);
  if (s.stage !== "discussing" && s.stage !== "resolving")
    throw new AppError("CALL_PHASE_CLOSED", 409);
  s.stage = "void";
  return quickCall(viewerId);
}
