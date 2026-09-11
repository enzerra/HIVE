import type { Choice } from "./types";
export const SCALE = 1_000_000n;
export const DURATIONS = [20, 60, 15, 10, 60, 20, 5] as const;
export const BOUNDARIES = [0, 20, 80, 95, 105, 165, 185, 190] as const;
export function meanBelief(
  counts: number[],
  sizes: number[] = counts.map(() => 4),
) {
  if (
    !counts.length ||
    counts.length !== sizes.length ||
    counts.some(
      (v, i) =>
        !Number.isInteger(v) ||
        v < 0 ||
        v > sizes[i] ||
        sizes[i] < 3 ||
        sizes[i] > 5,
    )
  )
    throw new Error("Invalid roster");
  return Number(
    counts.reduce(
      (sum, n, i) => sum + (BigInt(n) * SCALE) / BigInt(sizes[i]),
      0n,
    ) / BigInt(counts.length),
  );
}
export function scoreMicro(p: number, outcome: Choice) {
  const d = BigInt(p) - (outcome === "A" ? SCALE : 0n);
  return Number((100n * SCALE * (SCALE * SCALE - d * d)) / (SCALE * SCALE));
}
export function wisdomMicro(initial: number, final: number, outcome: Choice) {
  const y = outcome === "A" ? 1_000_000 : 0;
  return 100 * (Math.abs(initial - y) - Math.abs(final - y));
}
export function normalizeArgument(text: string) {
  return text.normalize("NFC").replace(/\s+/gu, " ").trim();
}
export function argumentStats(text: string) {
  const canonical = normalizeArgument(text);
  return {
    canonical,
    words: canonical ? canonical.split(" ").length : 0,
    characters: Array.from(canonical).length,
  };
}
export function validArgument(text: string) {
  const s = argumentStats(text);
  return s.words > 0 && s.words <= 30 && s.characters <= 240;
}
export function percent(p: number | null) {
  return p === null
    ? "N/A"
    : new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(
        p / 10_000,
      ) + "%";
}
export function score(p: number | null) {
  return p === null
    ? "N/A"
    : new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(p / 1_000_000);
}
export function lift(p: number | null) {
  return p === null
    ? "N/A"
    : (p > 0 ? "+" : "") +
        new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(
          p / 1_000_000,
        ) +
        " pp";
}
export function safeReturn(path: string | null | undefined) {
  return path &&
    /^\/(home|arena|hives|squads|invite|settings)(\/|\?|$)/.test(path) &&
    !path.includes("\\")
    ? path
    : "/home";
}
