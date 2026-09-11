"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, LockKeyhole, Radio, ShieldCheck } from "lucide-react";
import { Crest, Mark, Sigil } from "./identity";
import { fieldState, type FieldSnapshot } from "@/domain/belief-field";
import { percent } from "@/domain/rules";
import "./living-belief-field.css";

type Props = {
  snapshot: FieldSnapshot;
  stale: boolean;
  reduced: boolean;
  activeCard: string | null;
  onCard: (id: string) => void;
  squad: { name: string; symbol: number } | null;
  latestMessageId: string | null;
};

export function LivingBeliefField({
  snapshot: s,
  stale,
  reduced,
  activeCard,
  onCard,
  squad,
  latestMessageId,
}: Props) {
  const state = fieldState(s, stale);
  const root = useRef<HTMLElement>(null);
  const lastMessage = useRef(latestMessageId);
  const [pulse, setPulse] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (lastMessage.current === latestMessageId) return;
    lastMessage.current = latestMessageId;
    if (s.phase !== "deliberate" || stale || !latestMessageId) return;
    const start = setTimeout(() => setPulse(true), 0);
    const end = setTimeout(() => setPulse(false), 900);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [latestMessageId, s.phase, stale]);
  const paused =
    reduced ||
    hidden ||
    state.neutral ||
    s.phase === "resolve" ||
    s.finishedPlaying;
  const phaseLabel = s.finishedPlaying ? "MATCH ENDED" : s.phase.toUpperCase();
  const center = state.neutral ? (
    <Radio size={27} />
  ) : state.receipt?.state === "canonical_locked" && s.phase === "commit" ? (
    <ShieldCheck size={30} />
  ) : s.phase === "commit" ? (
    <LockKeyhole size={27} />
  ) : (
    <Mark size={36} />
  );
  return (
    <section
      ref={root}
      className={`belief-field field-${s.phase} ${s.finishedPlaying ? "field-ended" : ""} ${pulse ? "field-pulse" : ""}`}
      data-paused={paused}
      data-hidden={hidden}
      data-reduced={reduced}
      aria-label="Living Belief Field"
      onPointerMove={(e) => {
        if (
          paused ||
          e.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const box = e.currentTarget.getBoundingClientRect();
        root.current?.style.setProperty(
          "--field-x",
          `${((e.clientX - box.left) / box.width - 0.5) * 10}px`,
        );
        root.current?.style.setProperty(
          "--field-y",
          `${((e.clientY - box.top) / box.height - 0.5) * 8}px`,
        );
      }}
      onPointerLeave={() => {
        root.current?.style.setProperty("--field-x", "0px");
        root.current?.style.setProperty("--field-y", "0px");
      }}
    >
      <header className="field-header">
        <span className="eyebrow">LIVING BELIEF FIELD</span>
        <span>
          RONDE 0{s.round} / 03 · {phaseLabel}
        </span>
      </header>
      <p className="field-question">
        Game mana yang mencatat pertumbuhan relatif pemain bersamaan lebih
        tinggi dalam 30 menit?
      </p>
      <div className="field-stage">
        <svg
          className="field-wires"
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M130 130C280 15 370 15 500 130S750 245 870 130" />
          <path d="M130 130C280 245 370 245 500 130S750 15 870 130" />
          <path className="field-wire-direct" d="M130 130H870" />
          <circle cx="500" cy="130" r="95" />
          <circle cx="500" cy="130" r="115" />
        </svg>
        {["Purple", "Chog"].map((name, i) => {
          const value = state.belief
            ? i
              ? state.belief.chog
              : state.belief.purple
            : null;
          return (
            <div key={name} className={`field-pole field-pole-${i}`}>
              <div className="field-sigil">
                <Sigil symbol={i} color={i ? "green" : "indigo"} size={72} />
              </div>
              <strong>{name}</strong>
              <span className="field-pole-caption">
                {value === null
                  ? "Belief belum tersedia"
                  : `${state.finalOpen ? "Final" : "Awal"} · ${percent(value)} A`}
              </span>
              <div className="field-meter" aria-hidden="true">
                <i
                  style={{ width: value === null ? "0%" : `${value / 10000}%` }}
                />
              </div>
              {value !== null && <small>{percent(1_000_000 - value)} B</small>}
            </div>
          );
        })}
        <div className="field-core-area">
          {s.finishedPlaying && !state.neutral && (
            <div className="field-merge" aria-hidden="true">
              {s.results.map((r, i) => (
                <span
                  key={r.round}
                  style={
                    {
                      "--merge-x": `${(i - 1) * 100}px`,
                      "--merge-y": `${i === 1 ? -90 : 60}px`,
                    } as CSSProperties
                  }
                >
                  0{r.round}
                </span>
              ))}
            </div>
          )}
          <div className="field-core-orbit" aria-hidden="true" />
          {state.belief &&
            [state.belief.purple, state.belief.chog].map(
              (value, i) =>
                value !== null && (
                  <i
                    key={i}
                    className={`field-belief-marker field-marker-${i}`}
                    style={{
                      transform: `rotate(${(value / 1_000_000 - 0.5) * 150 + (i ? 180 : 0)}deg)`,
                    }}
                    aria-hidden="true"
                  />
                ),
            )}
          <div
            className="field-core"
            key={`${s.phase}-${state.receipt?.state ?? "idle"}`}
          >
            {center}
          </div>
          <span className="field-core-label">
            {state.finalOpen
              ? "FINAL BELIEF"
              : state.belief
                ? "INITIAL BELIEF"
                : "PERSPEKTIF"}
          </span>
        </div>
      </div>
      <p className="field-status" role="status">
        {state.status}
        {s.own.defaulted && !stale ? " · Defaulted Stay" : ""}
      </p>
      <div className="field-choices">
        <span>
          <b>A</b> Counter-Strike 2
        </span>
        <span>
          <b>B</b> Dota 2
        </span>
      </div>
      {state.cards.length > 0 ? (
        <div className="field-squads" aria-label="Argumen Squad Purple">
          {state.cards.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={c.unavailable}
              aria-pressed={activeCard === c.id}
              onClick={() => onCard(c.id)}
            >
              <Crest symbol={c.symbol} size={25} />
              <span>{c.squad}</span>
              {activeCard === c.id && <Check size={12} />}
            </button>
          ))}
        </div>
      ) : squad && s.phase === "deliberate" && !stale ? (
        <div className="field-own-squad">
          <Crest symbol={squad.symbol} size={25} />
          <span>
            {squad.name} · {pulse ? "Pesan baru" : "Diskusi Squad-mu"}
          </span>
        </div>
      ) : null}
      {s.finishedPlaying && (
        <div className="field-snapshots" aria-label="Snapshot final ronde">
          {s.results.map((r, i) => (
            <div
              key={r.round}
              style={{ "--snapshot-order": i } as CSSProperties}
            >
              <span>RONDE 0{r.round}</span>
              <strong>
                {stale
                  ? "Koneksi terputus"
                  : r.status === "void"
                    ? "Dibatalkan"
                    : `${percent(r.purple.final)} / ${percent(r.chog.final)}`}
              </strong>
              <small>Dukungan final A · Purple / Chog</small>
            </div>
          ))}
        </div>
      )}
      <footer>
        {state.neutral
          ? "Visual dinetralkan sampai status pertandingan tersedia."
          : state.belief
            ? "Dukungan untuk pilihan, bukan skor atau petunjuk siapa yang benar."
            : "Pilihan komunitas tetap tersembunyi sampai Reveal."}
      </footer>
    </section>
  );
}
