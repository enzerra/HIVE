import type { MatchView } from "./types";

export type FieldSnapshot = Pick<
  MatchView,
  | "round"
  | "phase"
  | "initial"
  | "final"
  | "own"
  | "cards"
  | "finishedPlaying"
  | "settled"
  | "results"
>;

/** A presentation boundary: hidden values must not affect geometry or markup. */
export function fieldState(s: FieldSnapshot, stale = false) {
  const open =
    ["reveal", "council", "revision", "resolve"].includes(s.phase) ||
    s.finishedPlaying;
  const finalOpen =
    (s.phase === "resolve" || s.finishedPlaying) && s.final !== null;
  const result = s.results.find((r) => r.round === s.round);
  const voided = result?.status === "void";
  const belief =
    stale || voided || !open ? null : finalOpen ? s.final : s.initial;
  const receipt = s.own.finalReceipt ?? s.own.initialReceipt;
  const forfeit = result?.purple.forfeit || (open && !s.own.initialReceipt);
  const status = stale
    ? "Koneksi dipulihkan"
    : voided
      ? "Ronde dibatalkan"
      : forfeit
        ? "Call tidak sah · forfeit"
        : s.settled
          ? "Hasil tersedia"
          : s.finishedPlaying
            ? "Final terkunci · outcome pending"
            : s.phase === "resolve"
              ? finalOpen
                ? "Snapshot final ronde"
                : "Menunggu final belief sah"
              : receipt?.state === "failed"
                ? "Penguncian gagal"
                : receipt?.state === "canonical_locked"
                  ? "Pilihan terkunci"
                  : receipt
                    ? "Pilihan sedang dikunci"
                    : s.phase === "think"
                      ? "Pikirkan sendiri"
                      : s.phase === "deliberate"
                        ? "Percakapan Squad"
                        : "Menunggu pilihan";
  return {
    belief,
    finalOpen: finalOpen && !stale && !voided,
    status,
    forfeit,
    neutral: stale || voided || !!forfeit || receipt?.state === "failed",
    receipt: stale ? null : receipt,
    cards: !stale && !s.finishedPlaying && s.phase === "council" ? s.cards : [],
  };
}
