"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sigil } from "./identity";
import type { Result } from "@/domain/types";
const phases: Record<string, [string, string]> = {
  think: ["Think", "Baca pertanyaannya. Tentukan perspektifmu sendiri."],
  deliberate: ["Deliberate", "Diskusikan alasanmu bersama Squad."],
  commit: ["Commit", "Saatnya mengunci pilihan awal."],
  reveal: ["Reveal", "Pilihan dibuka. Lihat perbedaan antarkelompok."],
  council: ["Council", "Dengarkan argumen sebelum menilai kembali."],
  revision: ["Revision", "Pertahankan pilihan atau revisi keyakinanmu."],
  resolve: ["Resolve", "Pilihan final ditutup. Ronde sedang diselesaikan."],
};
/** Parent keys this cue by authoritative round + phase, never by polling time. */
export function RoundTransition({
  round,
  phase,
  results = [],
}: {
  round: number;
  phase: string;
  results?: Result[];
}) {
  if (phase === "think" || phase === "ended") {
    return (
      <MatchCinematic
        round={round}
        ended={phase === "ended"}
        results={results}
      />
    );
  }
  return <PhaseTransition round={round} phase={phase} />;
}

function MatchCinematic({
  round,
  ended,
  results,
}: {
  round: number;
  ended: boolean;
  results: Result[];
}) {
  const [stage, setStage] = useState(
    ended ? "ended" : round === 1 ? "opening" : "round",
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const enter = setTimeout(() => setMounted(true), 0);
    const next =
      !ended && round === 1
        ? setTimeout(() => setStage("round"), 2300)
        : undefined;
    const exit = setTimeout(
      () => setStage("closed"),
      !ended && round === 1 ? 5700 : 3800,
    );
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStage("closed");
    };
    window.addEventListener("keydown", escape);
    return () => {
      clearTimeout(enter);
      clearTimeout(next);
      clearTimeout(exit);
      window.removeEventListener("keydown", escape);
    };
  }, [round, ended]);
  if (!mounted || stage === "closed") return null;
  const variant = stage === "round" ? `round-${round}` : stage;
  const title =
    stage === "opening"
      ? "Meet your rivals."
      : ended
        ? "Match ended."
        : [
            "",
            "Perspektif pertama.",
            "Tantang keyakinanmu.",
            "Make your final call.",
          ][round];
  return createPortal(
    <div className={`hive-cinema cinema-${variant}`} key={variant}>
      <div className="cinema-art" aria-hidden="true">
        <svg viewBox="0 0 800 600" className="cinema-map">
          <g className="cinema-orbits">
            <ellipse cx="400" cy="300" rx="280" ry="160" />
            <ellipse cx="400" cy="300" rx="200" ry="250" />
            <circle cx="400" cy="300" r="190" />
          </g>
          <g className="cinema-cross">
            <path d="M80 300H720M400 40V560" />
            <path d="M200 100L600 500M600 100L200 500" />
          </g>
        </svg>
        {["Purple", "Chog"].map((name, index) => (
          <div
            className={`cinema-gate cinema-gate-${index ? "right" : "left"}`}
            key={name}
          >
            {(stage === "opening" || ended) && (
              <div className="cinema-gate-identity">
                <span>HIVE COMMUNITY</span>
                <Sigil
                  symbol={index}
                  color={index ? "green" : "indigo"}
                  size={144}
                />
                <strong>{name}</strong>
                <small>{ended ? "Permainan selesai" : "Masuk Arena"}</small>
              </div>
            )}
          </div>
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <i
            className="cinema-spark"
            key={i}
            style={{
              left: `${8 + ((i * 31) % 84)}%`,
              top: `${10 + ((i * 19) % 80)}%`,
              animationDelay: `${i * 45}ms`,
            }}
          />
        ))}
      </div>
      <div className="cinema-content" role="status" aria-live="polite">
        {stage !== "opening" && !ended && (
          <div className="cinema-hives" aria-label="Komunitas yang bertanding">
            {["Purple", "Chog"].map((name, index) => (
              <div
                className={`cinema-hive-card cinema-hive-${index}`}
                key={name}
              >
                <span className="cinema-hive-label">HIVE COMMUNITY</span>
                <div className="cinema-hive-portrait" aria-hidden="true">
                  <Sigil
                    symbol={index}
                    color={index ? "green" : "indigo"}
                    size={112}
                  />
                </div>
                <strong>{name}</strong>
                <span className="cinema-hive-caption">
                  {ended
                    ? "Permainan selesai"
                    : stage === "opening"
                      ? "Masuk Arena"
                      : `Ronde 0${round}`}
                </span>
                <div className="cinema-hive-marks" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="eyebrow">
          {stage === "opening"
            ? "HIVE ARENA · PURPLE × CHOG"
            : ended
              ? "PURPLE × CHOG · PERMAINAN SELESAI"
              : `RONDE 0${round} / 03 · THINK`}
        </p>
        <div className="cinema-emblem" aria-hidden="true">
          {ended && (
            <div className="cinema-round-seals">
              {results.map((r) => (
                <span key={r.round}>R{r.round}</span>
              ))}
            </div>
          )}
          {stage === "opening" ? (
            <div className="cinema-versus">
              <span>VS</span>
            </div>
          ) : ended ? (
            <svg viewBox="0 0 140 140">
              <path d="M70 8L123 39V101L70 132L17 101V39Z" />
              <path className="cinema-check" d="M43 70L62 89L99 50" />
            </svg>
          ) : (
            <span className="cinema-number">0{round}</span>
          )}
        </div>
        <h2>{title}</h2>
        <p className="cinema-description">
          {stage === "opening"
            ? "Dua Hive. Tiga ronde. Setiap perspektif berarti."
            : ended
              ? "Semua ronde telah ditutup. Hasil dan pemenang menunggu outcome yang sah."
              : round === 1
                ? "Baca pertanyaan. Mulai dari pikiranmu sendiri."
                : round === 2
                  ? "Babak baru, pertanyaan baru. Temukan sudut pandang berikutnya."
                  : "Ronde terakhir. Berikan alasan terbaik bersama Squad-mu."}
        </p>
        <div className="cinema-chapters" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={ended || n <= round ? "lit" : ""}>
              {ended ? "✓" : `0${n}`}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="cinema-skip"
          onClick={() => setStage(stage === "opening" ? "round" : "closed")}
        >
          {stage === "opening"
            ? "Masuk ronde 1"
            : ended
              ? "Lihat status pertandingan"
              : "Mulai berpikir"}
          <span aria-hidden="true"> ↗</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

function PhaseTransition({ round, phase }: { round: number; phase: string }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const enter = setTimeout(() => setMounted(true), 0);
    const leave = setTimeout(() => setVisible(false), 4200);
    return () => {
      clearTimeout(enter);
      clearTimeout(leave);
    };
  }, []);
  if (!mounted || !visible) return null;
  const [name, description] = phases[phase] ?? [
    phase,
    "Periksa fase pertandingan yang sedang aktif.",
  ];
  const isRoundStart = phase === "think";
  return createPortal(
    <div
      className="arena-transition-layer"
      ref={scene}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          !scene.current ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        scene.current.style.setProperty("--arena-x", `${x * 18}px`);
        scene.current.style.setProperty("--arena-y", `${y * 12}px`);
      }}
    >
      <div className="arena-transition-rays" aria-hidden="true" />
      <div className="arena-transition-pixels" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="arena-contender arena-contender-left" aria-hidden="true">
        <Sigil symbol={0} color="indigo" size={92} />
        <span>PURPLE</span>
      </div>
      <div className="arena-contender arena-contender-right" aria-hidden="true">
        <Sigil symbol={1} color="green" size={92} />
        <span>CHOG</span>
      </div>
      <div className="round-transition" role="status" aria-live="polite">
        <div className="round-transition-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>0{round}</span>
        </div>
        <div className="round-transition-copy">
          <p className="eyebrow">
            {isRoundStart ? "RONDE BARU" : `RONDE ${round} · FASE BARU`}
          </p>
          <strong>{isRoundStart ? `Ronde ${round} dimulai` : name}</strong>
          <p>{description}</p>
          <div className="round-phase-track" aria-hidden="true">
            {Object.keys(phases).map((item, index) => (
              <span key={item} className={item === phase ? "active" : ""}>
                <i />
                {index + 1}
              </span>
            ))}
          </div>
          <span className="round-transition-progress" aria-hidden="true" />
        </div>
        <button
          type="button"
          aria-label="Tutup pemberitahuan ronde"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}
