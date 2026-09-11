import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/shell";
import { Loading } from "@/components/shared";
import {
  HomePage,
  ExplorePage,
  HivePage,
  SquadPage,
  HumanPage,
  RankingsPage,
} from "@/features/community";
import { SignInPage, OnboardingPage, InvitePage } from "@/features/onboarding";
import {
  ArenaIndex,
  LobbyPage,
  PlayPage,
  ResultsPage,
  ReplayPage,
} from "@/features/arena";
import {
  SettingsPage,
  NotificationsPage,
  ProofPage,
  OperatorPage,
} from "@/features/settings";
import {
  CallsPage,
  QuickCallPage,
  QuickCallResultPage,
} from "@/features/calls";
type Props = { params: Promise<{ path: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const names: Record<string, string> = {
    home: "Home",
    explore: "Temukan Hive",
    arena: "Arena",
    calls: "Open Calls",
    hives: "Komunitas",
    squads: "Squad",
    humans: "Human",
    rankings: "Rankings",
    replays: "Replay",
    watch: "Watch",
    proof: "View proof",
    "sign-in": "Gabung",
    onboarding: "Perkenalan",
    settings: "Pengaturan",
    notifications: "Notifikasi",
    operator: "Operator",
    invite: "Undangan",
  };
  return {
    title: `${names[path[0]] ?? "Jelajahi"} — HIVE`,
    robots: [
      "operator",
      "invite",
      "settings",
      "onboarding",
      "home",
      "notifications",
    ].includes(path[0])
      ? { index: false, follow: false }
      : undefined,
  };
}
export default async function Page({ params }: Props) {
  const { path: p } = await params;
  let screen: React.ReactNode;
  switch (p[0]) {
    case "home":
      if (p.length !== 1) notFound();
      screen = <HomePage />;
      break;
    case "explore":
      if (p.length !== 1) notFound();
      screen = <ExplorePage />;
      break;
    case "hives":
      if (p.length !== 2) notFound();
      screen = <HivePage slug={p[1]} />;
      break;
    case "squads":
      if (p.length !== 2) notFound();
      screen = <SquadPage id={p[1]} />;
      break;
    case "humans":
      if (p.length !== 2) notFound();
      screen = <HumanPage handle={decodeURIComponent(p[1])} />;
      break;
    case "rankings":
      if (p.length !== 1) notFound();
      screen = <RankingsPage />;
      break;
    case "sign-in":
      if (p.length !== 1) notFound();
      screen = <SignInPage />;
      break;
    case "onboarding":
      if (
        p.length !== 2 ||
        !["identity", "squad", "hive", "ready"].includes(p[1])
      )
        notFound();
      screen = <OnboardingPage step={p[1]} />;
      break;
    case "invite":
      if (p.length !== 2) notFound();
      screen = <InvitePage token={p[1]} />;
      break;
    case "arena":
      if (p.length === 1) {
        screen = <ArenaIndex />;
        break;
      }
      if (p[1] !== "founding-001" || p.length > 3) notFound();
      screen =
        p[2] === "play" ? (
          <PlayPage />
        ) : p[2] === "results" ? (
          <ResultsPage />
        ) : !p[2] || p[2] === "lobby" ? (
          <LobbyPage />
        ) : null;
      if (!screen) notFound();
      break;
    case "calls":
      if (p.length === 1) screen = <CallsPage />;
      else if (p.length === 2 && p[1] === "steam-rivals-001")
        screen = <QuickCallPage id={p[1]} />;
      else if (
        p.length === 3 &&
        p[1] === "steam-rivals-001" &&
        p[2] === "result"
      )
        screen = <QuickCallResultPage id={p[1]} />;
      else notFound();
      break;
    case "replays":
    case "watch":
      if (p.length !== 2) notFound();
      screen = <ReplayPage id={p[1]} watch={p[0] === "watch"} />;
      break;
    case "proof":
      if (p.length !== 2) notFound();
      screen = <ProofPage id={p[1]} />;
      break;
    case "notifications":
      if (p.length !== 1) notFound();
      screen = <NotificationsPage />;
      break;
    case "settings":
      if (
        p.length > 2 ||
        (p[1] &&
          !["profile", "preferences", "privacy", "advanced"].includes(p[1]))
      )
        notFound();
      screen = <SettingsPage tab={p[1] ?? "profile"} />;
      break;
    case "operator":
      if (!["events", "moderation"].includes(p[1]) || p.length > 3) notFound();
      screen = <OperatorPage moderation={p[1] === "moderation"} />;
      break;
    default:
      notFound();
  }
  return (
    <PageShell
      focus={
        p[0] === "onboarding" ||
        p[0] === "sign-in" ||
        (p[0] === "arena" && p.length > 1)
      }
    >
      <Suspense fallback={<Loading />}>{screen}</Suspense>
    </PageShell>
  );
}
