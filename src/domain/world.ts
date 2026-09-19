import type {
  OpenCallStage,
  WorldLocation,
  WorldLocationStatus,
} from "./types";

export type HomeWorldProjection = {
  onboarded: boolean;
  squadId: string | null;
  squadName: string | null;
  squadSize: number;
  unavailable?: boolean;
  match: {
    started: boolean;
    finishedPlaying: boolean;
    settled: boolean;
  } | null;
  call: {
    id: string;
    stage: OpenCallStage;
    participants: number;
    initialLocked: boolean;
  } | null;
};

function arenaStatus(
  input: HomeWorldProjection,
): Pick<WorldLocation, "status" | "visualState" | "description" | "action"> {
  if (!input.onboarded)
    return {
      status: "locked",
      visualState: "identity-required",
      description: "Lengkapi identitasmu sebelum masuk pertandingan.",
      action: "Lanjutkan onboarding",
    };
  if (!input.match || input.unavailable)
    return {
      status: "idle",
      visualState: "unknown",
      description: "Status pertandingan belum tersedia.",
      action: "Buka Arena",
    };
  if (input.match?.settled)
    return {
      status: "attention",
      visualState: "result-ready",
      description: "Founding Match selesai. Ceritanya siap dibaca.",
      action: "Lihat hasil",
    };
  if (input.match?.started)
    return {
      status: input.match.finishedPlaying ? "active" : "live",
      visualState: input.match.finishedPlaying
        ? "outcome-pending"
        : "match-live",
      description: input.match.finishedPlaying
        ? "Pilihan selesai. Reality sedang memeriksa outcome."
        : "Purple dan Chog sedang bertanding.",
      action: input.match.finishedPlaying
        ? "Lihat status"
        : "Kembali bertanding",
    };
  return {
    status: "active",
    visualState: "lobby-open",
    description: "Founding Match menunggu Squad-mu.",
    action: "Masuk lobby",
  };
}

function pulseStatus(
  input: HomeWorldProjection,
): Pick<WorldLocation, "status" | "visualState" | "description" | "action"> {
  if (!input.onboarded)
    return {
      status: "locked",
      visualState: "identity-required",
      description: "Quick Call terbuka setelah identitasmu siap.",
      action: "Lanjutkan onboarding",
    };
  if (input.unavailable)
    return {
      status: "idle",
      visualState: "unknown",
      description: "Status Pulse belum tersedia.",
      action: "Buka Pulse",
    };
  if (!input.call)
    return {
      status: "idle",
      visualState: "quiet",
      description: "Belum ada Call yang siap diverifikasi.",
      action: "Buka Pulse",
    };
  if (input.call.stage === "resolved" || input.call.stage === "void")
    return {
      status: "attention",
      visualState:
        input.call.stage === "resolved" ? "outcome-ready" : "call-void",
      description:
        input.call.stage === "resolved"
          ? "Reality sudah mengumumkan hasil Quick Call."
          : "Call ditutup netral karena sumber tidak dapat diverifikasi.",
      action: input.call.stage === "resolved" ? "Lihat hasil" : "Lihat detail",
    };
  if (input.call.stage === "resolving")
    return {
      status: "active",
      visualState: "resolver-active",
      description: "Prediksi ditutup. Reality sedang memeriksa hasil.",
      action: "Lihat timer",
    };
  return {
    status: "live",
    visualState: input.call.initialLocked ? "discussion-open" : "call-open",
    description: input.call.initialLocked
      ? "Call-mu terkunci. Diskusi Squad masih terbuka."
      : "Satu pertanyaan ringan sedang terbuka hari ini.",
    action: input.call.initialLocked ? "Buka diskusi" : "Buat prediksi",
  };
}

function location(
  value: WorldLocation,
  status: WorldLocationStatus = value.status,
): WorldLocation {
  return { ...value, status };
}

export function buildWorldLocations(
  input: HomeWorldProjection,
): WorldLocation[] {
  const arena = arenaStatus(input);
  const pulse = pulseStatus(input);
  const arenaDestination = !input.onboarded
    ? "/onboarding/identity"
    : input.match?.settled
      ? "/arena/founding-001/results"
      : input.match?.started
        ? "/arena/founding-001/play"
        : "/arena/founding-001";
  const pulseDestination = !input.onboarded
    ? "/onboarding/identity"
    : input.call
      ? input.call.stage === "resolved"
        ? `/calls/${input.call.id}/result`
        : `/calls/${input.call.id}`
      : "/calls";

  return [
    location({
      id: "arena",
      destination: arenaDestination,
      label: "Arena",
      activityCount: null,
      ...arena,
    }),
    location({
      id: "squad",
      destination: !input.onboarded
        ? "/onboarding/identity"
        : input.squadId
          ? `/squads/${input.squadId}`
          : input.onboarded
            ? "/onboarding/squad"
            : "/onboarding/identity",
      label: "Squad Quarter",
      description: input.squadId
        ? `${input.squadName ?? "Squad-mu"} punya ruang untuk berpikir bersama.`
        : "Temukan orang-orang yang akan bermain bersamamu.",
      action: input.squadId ? "Buka ruang Squad" : "Temukan Squad",
      status: !input.onboarded
        ? "locked"
        : input.squadId
          ? "active"
          : "attention",
      activityCount: input.squadId ? input.squadSize : null,
      visualState: input.squadId ? "squad-ready" : "squad-needed",
    }),
    location({
      id: "hive",
      destination: "/explore",
      label: "Hive Tower",
      description: "Temukan komunitas, kultur, dan frekuensi yang cocok.",
      action: "Jelajahi Hives",
      status: input.onboarded ? "active" : "attention",
      activityCount: null,
      visualState: "directory-open",
    }),
    location({
      id: "pulse",
      destination: pulseDestination,
      label: "Pulse Beacon",
      activityCount: input.unavailable
        ? null
        : (input.call?.participants ?? null),
      ...pulse,
    }),
    location({
      id: "replay",
      destination: "/replays/founding-001",
      label: "Replay Theater",
      description:
        input.match?.settled && !input.unavailable
          ? "Founding Match sudah menjadi cerita yang dapat dibagikan."
          : "Jelajahi replay contoh dari Founding Match.",
      action: "Tonton replay",
      status: input.match?.settled && !input.unavailable ? "attention" : "idle",
      activityCount: null,
      visualState:
        input.match?.settled && !input.unavailable
          ? "new-replay"
          : "archive-open",
    }),
    location({
      id: "wisdom",
      destination: "/rankings",
      label: "Hall of Wisdom",
      description: "Lihat reputasi yang lahir dari keputusan terverifikasi.",
      action: "Buka rankings",
      status: "active",
      activityCount: null,
      visualState:
        input.match?.settled && !input.unavailable
          ? "standings-ready"
          : "season-open",
    }),
  ];
}
