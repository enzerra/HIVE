"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Settings } from "lucide-react";
import { Sigil } from "./identity";
import type { MatchView } from "@/domain/types";
import { hiveById } from "@/domain/community";
import { useSession } from "@/lib/client/session";
import { useWorldMotion, useWorldTravel } from "./use-world-travel";
import { modifiedNavigation, worldAsset } from "./world-scene-config";
import "./arena-district.css";

export function ArenaDistrict({
  match,
  pending,
  error,
  retry,
}: {
  match?: MatchView;
  pending: boolean;
  error: Error | null;
  retry: () => void;
}) {
  const { data: viewer } = useSession();
  const reduced = useWorldMotion(viewer?.preferences.motion);
  const travel = useWorldTravel(reduced);
  const [ready, setReady] = useState({ idle: false, active: false });
  const [failed, setFailed] = useState(false);
  const destination = !viewer?.onboarded
    ? "/onboarding/identity"
    : match?.settled
      ? "/arena/founding-001/results"
      : match?.started
        ? "/arena/founding-001/play"
        : "/arena/founding-001";
  const action = !viewer?.onboarded
    ? "Lengkapi identitas"
    : match?.settled
      ? "Buka hasil pertandingan"
      : match?.started
        ? "Lanjutkan pertandingan"
        : "Masuk lobby";
  // MatchView's current contract defines the purple and chog sides. Resolve
  // their display identity from the community directory, not visual fixtures.
  const sides: (keyof NonNullable<MatchView["initial"]>)[] = ["purple", "chog"];
  const participants = match
    ? sides.map((id) => hiveById(id)).filter((hive) => hive !== undefined)
    : [];
  const entering = travel.state.stage !== "idle";
  return (
    <section
      className="arena-district"
      data-reduced={reduced}
      data-entering={entering}
      aria-labelledby="district-title"
    >
      <nav className="district-hud" aria-label="Navigasi Arena">
        <Link href="/home">
          <ArrowLeft size={16} /> World
        </Link>
        <span>FOUNDING MATCH · DEMO</span>
        <div>
          <Link
            href={
              viewer ? `/humans/${encodeURIComponent(viewer.handle)}` : "/home"
            }
          >
            Profil
          </Link>
          <Link href="/settings" aria-label="Pengaturan">
            <Settings size={17} />
          </Link>
        </div>
      </nav>
      <header className="district-heading">
        <p>HIVE WORLD / ARENA</p>
        <h1>Perspektifmu punya panggung.</h1>
        <span>Masuk bersama Squad. Temukan sudut pandang baru.</span>
      </header>
      {participants.length > 0 && (
        <div
          className="district-rivals"
          aria-label={participants.map((hive) => hive.name).join(" melawan ")}
        >
          {participants.map((hive, i) => (
            <div key={hive.id}>
              {i > 0 && (
                <span className="district-vs" aria-hidden="true">
                  VS
                </span>
              )}
              <Sigil size={44} symbol={hive.symbol} color={hive.color} />
              <strong>{hive.name}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="district-stage">
        <div className="district-halo" aria-hidden="true" />
        {!failed && (
          <div className="district-building" aria-hidden="true">
            <Image
              src={worldAsset("arena-idle")}
              alt=""
              width={768}
              height={768}
              preload
              unoptimized
              onLoad={() => setReady((value) => ({ ...value, idle: true }))}
              onError={() => setFailed(true)}
            />
            <Image
              className="district-active"
              data-open={entering && ready.idle && ready.active}
              src={worldAsset("arena-active")}
              alt=""
              width={768}
              height={768}
              loading="eager"
              unoptimized
              onLoad={() => setReady((value) => ({ ...value, active: true }))}
              onError={() => setReady((value) => ({ ...value, active: false }))}
            />
          </div>
        )}
        {error ? (
          <div className="district-status" role="alert">
            <p>Status pertandingan belum termuat.</p>
            <button onClick={retry}>Coba lagi</button>
          </div>
        ) : pending ? (
          <div className="district-status" role="status">
            Memuat status pertandingan…
          </div>
        ) : !match ? (
          <div className="district-status" role="status">
            <p>Belum ada pertandingan tersedia.</p>
            <button onClick={retry}>Periksa lagi</button>
          </div>
        ) : (
          <Link
            href={destination}
            className="district-gate"
            aria-label={action}
            onClick={(event) => {
              if (modifiedNavigation(event)) return;
              event.preventDefault();
              travel.enter(
                "arena",
                destination,
                ready.idle && ready.active && !failed,
              );
            }}
          >
            <span className="district-door-hit" aria-hidden="true" />
            <span className="district-gate-label">
              <small>
                {match.settled
                  ? "HASIL TERSEDIA"
                  : match.finishedPlaying
                    ? "MENUNGGU OUTCOME"
                    : match.started
                      ? `RONDE ${match.round} · ${match.phase.toUpperCase()}`
                      : "LOBBY TERSEDIA"}
              </small>
              <strong>
                {action} <ArrowUpRight size={17} />
              </strong>
            </span>
          </Link>
        )}
      </div>
      {entering && (
        <p className="district-progress" role="status">
          Memasuki Arena…
        </p>
      )}
      <footer className="district-footer">
        <span>
          {failed
            ? "Gambar belum termuat. Gerbang tetap dapat dibuka."
            : "Sentuh pintu Arena untuk melanjutkan."}
        </span>
        <Link href="/replays/founding-001">
          Replay contoh <ArrowUpRight size={15} />
        </Link>
        <Link href="/rankings">
          Hall of Wisdom <ArrowUpRight size={15} />
        </Link>
      </footer>
    </section>
  );
}
