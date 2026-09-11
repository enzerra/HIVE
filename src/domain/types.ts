export const PHASES = [
  "think",
  "deliberate",
  "commit",
  "reveal",
  "council",
  "revision",
  "resolve",
] as const;
export type Phase = (typeof PHASES)[number];
export type Choice = "A" | "B";
export type Scenario =
  "normal" | "negative" | "draw" | "void" | "no_contest" | "forfeit";
export type Preferences = {
  theme: "system" | "light" | "dark";
  motion: "system" | "reduce";
  sound: boolean;
  presence: boolean;
  reminders: boolean;
};
export type Viewer = {
  id: string;
  handle: string;
  avatar: number;
  squadId: string | null;
  squadName?: string;
  hiveId: string | null;
  onboarded: boolean;
  deferred: boolean;
  role: "member" | "representative" | "operator";
  preferences: Preferences;
};
export type Hive = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  members: number;
  squads: number;
  symbol: number;
  color: string;
  tags: string[];
};
export type Squad = {
  id: string;
  name: string;
  hiveId: string;
  symbol: number;
  members: string[];
  forming?: boolean;
};
export type Receipt = {
  id: string;
  key: string;
  stage: "initial" | "final";
  choice: Choice;
  state: "service_accepted" | "chain_submitted" | "canonical_locked" | "failed";
  at: number;
  deadline: number;
  attribution?: string;
};
export type PublicReceipt = Omit<
  Receipt,
  "choice" | "attribution" | "deadline"
>;
export type Result = {
  round: number;
  outcome: Choice | null;
  status: "resolved" | "void" | "pending";
  purple: {
    initial: number | null;
    final: number | null;
    score: number | null;
    lift: number | null;
    scoreLift: number | null;
    forfeit: boolean;
  };
  chog: {
    initial: number | null;
    final: number | null;
    score: number | null;
    lift: number | null;
    scoreLift: number | null;
    forfeit: boolean;
  };
};
export type Card = {
  id: string;
  squad: string;
  symbol: number;
  belief: number | null;
  text: string;
  unavailable?: boolean;
};
export type MatchView = {
  id: string;
  version: number;
  serverNow: number;
  started: boolean;
  ready: boolean;
  round: number;
  phase: Phase;
  phaseIndex: number;
  deadline: number | null;
  finishedPlaying: boolean;
  settled: boolean;
  scenario: Scenario;
  initial: { purple: number | null; chog: number } | null;
  final: { purple: number | null; chog: number } | null;
  own: {
    initialChoice: Choice | null;
    finalChoice: Choice | null;
    initialReceipt: PublicReceipt | null;
    finalReceipt: PublicReceipt | null;
    defaulted: boolean;
  };
  cards: Card[];
  chat: { id: string; author: string; text: string; avatar: number }[];
  argument: string;
  canEditArgument: boolean;
  results: Result[];
  totals: {
    purple: number;
    chog: number;
    valid: number;
    winner: "purple" | "chog" | "draw" | "no_contest";
  } | null;
  outcomeAt: number | null;
};
export type Notification = {
  id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
};
