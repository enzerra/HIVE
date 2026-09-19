"use client";
import Link from "next/link";
import {
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { ArrowRight, ArrowLeft, RefreshCw, Scan } from "lucide-react";
import type { OpenCall, Viewer, WorldLocation } from "@/domain/types";
import { buildWorldLocations } from "@/domain/world";
import { squadById } from "@/domain/community";
import {
  WORLD_SCENE,
  worldAsset,
  worldEntrance,
  modifiedNavigation,
  type WorldId,
} from "./world-scene-config";
import { useWorldMotion, useWorldTravel } from "./use-world-travel";
import "./home-world.css";
import "./home-world-game.css";
import "./world-sky.css";
import { useWorldWalker } from "./use-world-walker";
import { walkingKey, WORLD_DOORS } from "@/domain/world-walking";

const labels = {
  idle: "Tenang",
  active: "Terbuka",
  live: "Live",
  attention: "Baru",
  locked: "Onboarding",
};
const shortNames: Record<WorldId, string> = {
  arena: "Arena",
  hive: "Hive Tower",
  squad: "Squad Lounge",
  pulse: "Pulse",
  replay: "Replay",
  wisdom: "Wisdom",
};
function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 760px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function HomeWorld({
  viewer,
  match,
  call,
  loading = false,
  degraded = false,
  retry,
}: {
  viewer: Viewer;
  match: {
    started: boolean;
    settled: boolean;
    finishedPlaying: boolean;
  } | null;
  call: OpenCall | null;
  loading?: boolean;
  degraded?: boolean;
  retry: () => void;
}) {
  const reduced = useWorldMotion(viewer.preferences.motion);
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia("(max-width: 760px)").matches,
    () => false,
  );
  const travel = useWorldTravel(reduced);
  const [walking, setWalking] = useState(true);
  const pilot = useWorldWalker(
    walking && travel.state.stage === "idle",
    `hive-world-position-v2:${viewer.handle}`,
  );
  const [focused, setFocused] = useState<WorldId | null>(null);
  const [inspected, setInspected] = useState<WorldId | null>(null);
  const [terrainFailed, setTerrainFailed] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const [arenaReady, setArenaReady] = useState({ idle: false, active: false });
  const squad = squadById(viewer.squadId ?? "");
  const locations = useMemo(
    () =>
      buildWorldLocations({
        onboarded: viewer.onboarded,
        squadId: viewer.squadId,
        squadName: squad?.name ?? viewer.squadName ?? null,
        squadSize: squad?.members.length ?? 0,
        match,
        call,
        unavailable: loading || degraded,
      }),
    [viewer, squad, match, call, loading, degraded],
  );
  const selectedId =
    travel.state.id ??
    (walking ? pilot.nearby : null) ??
    (mobile ? focused : inspected);
  const selected = locations.find((item) => item.id === selectedId);
  const cameraId = travel.state.id ?? (mobile && !walking ? focused : null);
  const cameraScene = WORLD_SCENE.find((item) => item.id === cameraId);
  const camera = cameraScene?.camera;
  const zoom =
    travel.state.stage !== "idle"
      ? 2.8
      : camera
        ? cameraScene.assetSize === 512
          ? 3.2
          : 2.2
        : 1;
  const transform = camera
    ? `translate(${768 - camera.x * zoom}px, ${410 - camera.y * zoom}px) scale(${zoom})`
    : "translate(0px, 0px) scale(1)";
  const arenaOpen =
    travel.state.id === "arena" && arenaReady.idle && arenaReady.active;
  function fail(id: string) {
    setFailed((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  }
  function navigate(
    event: MouseEvent<HTMLElement | SVGElement>,
    item: WorldLocation,
  ) {
    if (modifiedNavigation(event)) return;
    event.preventDefault();
    if (walking && pilot.nearby !== item.id && !terrainFailed) {
      setInspected(item.id);
      return;
    }
    enterLocation(item);
  }
  function enterLocation(item: WorldLocation) {
    pilot.stop();
    const ready = item.id !== "arena" || (arenaReady.idle && arenaReady.active);
    travel.enter(
      item.id,
      worldEntrance(item),
      ready && !terrainFailed && !failed.includes(item.id),
    );
  }
  return (
    <section
      className="home-world"
      data-reduced={reduced}
      data-travel={travel.state.stage}
      data-walking={walking}
      data-terrain-failed={terrainFailed}
      data-near-door={Boolean(pilot.nearby)}
    >
      <header className="world-intro">
        <div>
          <p className="world-kicker">HIVE WORLD · FOUNDING DEMO</p>
          <h1>Selamat datang, {viewer.handle}.</h1>
          <p>Satu dunia. Orang-orangmu. Perspektif baru.</p>
        </div>
        <Link
          className="world-squad-link"
          href={
            !viewer.onboarded
              ? "/onboarding/identity"
              : viewer.squadId
                ? `/squads/${viewer.squadId}`
                : "/onboarding/squad"
          }
        >
          {squad?.name ?? viewer.squadName ?? "Temukan Squad"}{" "}
          <ArrowRight size={16} />
        </Link>
      </header>
      <div className="world-play-toolbar">
        <button
          aria-pressed={walking}
          onClick={() => {
            pilot.stop();
            setWalking(!walking);
            setFocused(null);
          }}
        >
          {walking ? "Mode berjalan · aktif" : "Mode navigasi langsung"}
        </button>
        <p id="world-walk-help">
          {walking
            ? "Klik peta, lalu WASD / panah untuk berjalan. Dekati pintu, tekan E untuk masuk."
            : "Klik bangunan untuk langsung masuk."}
        </p>
      </div>
      <div
        className="world-frame"
        tabIndex={walking ? 0 : -1}
        aria-label="Area berjalan HIVE"
        aria-describedby="world-walk-help"
        onPointerDown={(event) => {
          if (walking && !(event.target as Element).closest("button,a"))
            event.currentTarget.focus({ preventScroll: true });
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pilot.stop();
        }}
        onKeyDown={(event) => {
          if (
            !walking ||
            event.altKey ||
            event.metaKey ||
            event.ctrlKey ||
            (event.target as Element).closest(
              'input,textarea,select,[contenteditable="true"],button,a',
            )
          )
            return;
          if (walkingKey(event.key)) {
            event.preventDefault();
            pilot.press(event.key, event.repeat);
          }
          if (
            event.key.toLowerCase() === "e" &&
            !event.repeat &&
            pilot.nearby
          ) {
            event.preventDefault();
            const item = locations.find((l) => l.id === pilot.nearby);
            if (item) enterLocation(item);
          }
        }}
      >
        <div
          className="world-status"
          role="status"
          hidden={!loading && !degraded}
        >
          {degraded
            ? "Status aktivitas belum tersedia"
            : loading
              ? "Memuat status aktivitas…"
              : "Jelajahi duniamu"}
          {degraded && (
            <button onClick={retry} aria-label="Muat ulang aktivitas">
              <RefreshCw size={14} /> Coba lagi
            </button>
          )}
        </div>
        {!terrainFailed ? (
          <svg
            className="world-canvas"
            viewBox="0 0 1536 820"
            aria-label="Peta interaktif HIVE"
            role="group"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setFocused(null);
                setInspected(null);
              }
            }}
          >
            <g className="world-camera" style={{ transform } as CSSProperties}>
              <image
                className="world-terrain"
                href={worldAsset("plaza")}
                width="1536"
                height="1024"
                onError={() => setTerrainFailed(true)}
              />
              <g aria-hidden="true" pointerEvents="none">
                <image
                  href={worldAsset("lamp")}
                  x="625"
                  y="350"
                  width="60"
                  height="60"
                />
                <image
                  href={worldAsset("banner")}
                  x="835"
                  y="342"
                  width="65"
                  height="65"
                />
              </g>
              {[
                ...WORLD_SCENE,
                {
                  id: "player" as const,
                  position: {
                    ...pilot.walker,
                    // The door terraces are part of the building sprite: a
                    // visitor on those terraces must render in front of it.
                    y:
                      pilot.nearby &&
                      ["arena", "hive", "squad"].includes(pilot.nearby)
                        ? Math.max(
                            (WORLD_SCENE.find(
                              (item) => item.id === pilot.nearby,
                            )?.position.y ?? 0) + 1,
                            pilot.walker.y,
                          )
                        : pilot.walker.y,
                  },
                },
              ]
                .sort((a, b) => a.position.y - b.position.y)
                .map((scene) => {
                  if (scene.id === "player")
                    return walking ? (
                      <g
                        key="player"
                        className="world-player"
                        transform={`translate(${pilot.walker.x} ${pilot.walker.y})`}
                        pointerEvents="none"
                        aria-label="Karaktermu"
                      >
                        <ellipse
                          cy="-2"
                          rx="20"
                          ry="7"
                          fill="#080d20"
                          opacity=".45"
                        />
                        <circle
                          cy="-2"
                          r="24"
                          fill="none"
                          stroke="#c2b8ff"
                          strokeWidth="2"
                          opacity=".7"
                          transform="scale(1 .4)"
                        />
                        <g transform={`scale(${pilot.walker.left ? -1 : 1} 1)`}>
                          <image
                            href={worldAsset(
                              `${["wolf", "fox", "frog"][viewer.avatar % 3]}-${pilot.walker.step && !reduced ? "step" : "idle"}`,
                            )}
                            x="-48"
                            y="-90"
                            width="96"
                            height="96"
                          />
                        </g>
                        <text
                          y="-88"
                          textAnchor="middle"
                          className="world-player-name"
                        >
                          Kamu
                        </text>
                      </g>
                    ) : null;
                  const item = locations.find(
                    (location) => location.id === scene.id,
                  )!;
                  const scale = scene.width / scene.assetSize;
                  const x = scene.position.x - scene.width * scene.anchor[0];
                  const y = scene.position.y - scene.width * scene.anchor[1];
                  const disabledOnMap =
                    !walking && mobile && focused !== scene.id;
                  return (
                    <g
                      key={scene.id}
                      transform={`translate(${x} ${y}) scale(${scale})`}
                    >
                      <a
                        href={worldEntrance(item)}
                        className="world-object"
                        data-location={scene.id}
                        data-status={item.status}
                        data-selected={
                          selectedId === scene.id ||
                          (walking && pilot.nearby === scene.id)
                        }
                        data-mobile-disabled={disabledOnMap}
                        aria-label={`${item.label}. ${item.description} ${item.action}.`}
                        aria-hidden={disabledOnMap || undefined}
                        tabIndex={disabledOnMap ? -1 : 0}
                        onMouseEnter={() => setInspected(scene.id)}
                        onFocus={() => setInspected(scene.id)}
                        onClick={(event) => navigate(event, item)}
                      >
                        <g className="world-object-lift">
                          {!failed.includes(scene.id) && (
                            <image
                              className="world-building-image"
                              transform={
                                scene.mirrored
                                  ? `translate(${scene.assetSize} 0) scale(-1 1)`
                                  : undefined
                              }
                              href={worldAsset(scene.asset)}
                              width={scene.assetSize}
                              height={scene.assetSize}
                              onLoad={() => {
                                if (scene.id === "arena")
                                  setArenaReady((value) => ({
                                    ...value,
                                    idle: true,
                                  }));
                              }}
                              onError={() => fail(scene.id)}
                            />
                          )}
                          {scene.id === "arena" &&
                            !failed.includes("arena-active") && (
                              <image
                                className="world-arena-active"
                                data-open={arenaOpen}
                                href={worldAsset("arena-active")}
                                width="768"
                                height="768"
                                onLoad={() =>
                                  setArenaReady((value) => ({
                                    ...value,
                                    active: true,
                                  }))
                                }
                                onError={() => fail("arena-active")}
                              />
                            )}
                          <polygon
                            className="world-hit"
                            transform={
                              scene.mirrored
                                ? `translate(${scene.assetSize} 0) scale(-1 1)`
                                : undefined
                            }
                            points={scene.hitPolygon}
                          />
                          {failed.includes(scene.id) && (
                            <text
                              className="world-missing"
                              x={scene.assetSize / 2}
                              y={scene.assetSize * 0.7}
                              textAnchor="middle"
                            >
                              {shortNames[scene.id]}
                            </text>
                          )}
                          <g
                            className="world-object-label"
                            transform={`translate(${scene.assetSize / 2} ${scene.assetSize * 0.96}) scale(${1 / scale})`}
                            aria-hidden="true"
                          >
                            <rect
                              x="-66"
                              y="0"
                              width="132"
                              height="33"
                              rx="9"
                            />
                            <text textAnchor="middle" y="22">
                              {shortNames[scene.id]}
                            </text>
                          </g>
                        </g>
                      </a>
                    </g>
                  );
                })}
              {walking && (
                <g pointerEvents="none" aria-hidden="true">
                  {Object.entries(WORLD_DOORS).map(([id, p]) => (
                    <ellipse
                      key={id}
                      cx={p.x}
                      cy={p.y}
                      rx="20"
                      ry="9"
                      fill={pilot.nearby === id ? "#b4a1ff66" : "#aaa2e912"}
                      stroke={pilot.nearby === id ? "#e1d9ff" : "#a49bb855"}
                      strokeWidth="2"
                      strokeDasharray={pilot.nearby === id ? undefined : "4 5"}
                    />
                  ))}
                </g>
              )}
              {walking &&
                pilot.nearby &&
                (() => {
                  const item = locations.find(
                    (location) => location.id === pilot.nearby,
                  )!;
                  return (
                    <g
                      transform={`translate(${pilot.walker.x} ${pilot.walker.y - 130})`}
                    >
                      <a
                        href={worldEntrance(item)}
                        onClick={(event) => navigate(event, item)}
                        className="world-door-prompt"
                        aria-label={`Masuk ${shortNames[item.id]} di dekat karakter`}
                      >
                        <rect
                          x="-110"
                          y="-25"
                          width="220"
                          height="48"
                          rx="12"
                        />
                        <text textAnchor="middle" y="5">
                          E · Masuk {shortNames[item.id]}
                        </text>
                      </a>
                    </g>
                  );
                })()}
            </g>
          </svg>
        ) : (
          <div className="world-fallback" role="status">
            <Scan size={32} />
            <h2>Peta belum termuat.</h2>
            <p>Semua tujuan tetap tersedia di navigasi cepat.</p>
            <button
              onClick={() => {
                setTerrainFailed(false);
                setFailed([]);
              }}
            >
              Muat ulang gambar
            </button>
          </div>
        )}
        <div className="world-mist" aria-hidden="true" />
        {travel.state.stage !== "idle" && (
          <div className="world-arrival" role="status" aria-live="polite">
            Memasuki {selected?.label ?? "wilayah"}…
          </div>
        )}
      </div>
      {walking && !terrainFailed && (
        <div className="world-walk-controls">
          <div
            className="world-joystick"
            role="group"
            aria-label="Joystick sentuh"
            onPointerDown={(e) => {
              if (travel.state.stage !== "idle") return;
              e.currentTarget.setPointerCapture(e.pointerId);
              const r = e.currentTarget.getBoundingClientRect();
              pilot.stick.current = {
                x: (e.clientX - r.left - r.width / 2) / 40,
                y: (e.clientY - r.top - r.height / 2) / 40,
              };
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const r = e.currentTarget.getBoundingClientRect();
              pilot.stick.current = {
                x: (e.clientX - r.left - r.width / 2) / 40,
                y: (e.clientY - r.top - r.height / 2) / 40,
              };
            }}
            onPointerUp={() => pilot.stop()}
            onPointerCancel={() => pilot.stop()}
            onLostPointerCapture={() => pilot.stop()}
          >
            <span aria-hidden="true">✥</span>
          </div>
          <div role="status">
            <strong>
              {pilot.nearby
                ? locations.find((l) => l.id === pilot.nearby)?.label
                : "Jelajahi plaza"}
            </strong>
            <p>
              {pilot.nearby
                ? "Pintu dalam jangkauan. Siap masuk?"
                : "Ikuti jalur menuju lingkaran di depan lokasi."}
            </p>
          </div>
          <button
            className="world-interact"
            disabled={!pilot.nearby || travel.state.stage !== "idle"}
            onClick={() => {
              const item = locations.find((l) => l.id === pilot.nearby);
              if (item) enterLocation(item);
            }}
          >
            <kbd>E</kbd>{" "}
            {pilot.nearby
              ? `Masuk ${shortNames[pilot.nearby]}`
              : "Dekati pintu"}
          </button>
        </div>
      )}
      {mobile && !walking && !terrainFailed && (
        <nav className="world-focus-controls" aria-label="Fokus lokasi di peta">
          {locations.map((item) => (
            <button
              key={item.id}
              aria-pressed={focused === item.id}
              onClick={() => setFocused(item.id)}
              disabled={travel.state.stage !== "idle"}
            >
              {shortNames[item.id]}
            </button>
          ))}
          {focused && (
            <button
              className="world-overview"
              onClick={() => setFocused(null)}
              disabled={travel.state.stage !== "idle"}
            >
              <ArrowLeft size={14} /> Seluruh peta
            </button>
          )}
        </nav>
      )}
      <div className="world-detail" aria-live="polite">
        {selected ? (
          <>
            <div>
              <small>
                {labels[selected.status]}
                {selected.activityCount !== null
                  ? ` · ${selected.activityCount} ${selected.id === "squad" ? "anggota Squad (demo)" : "peserta Call (demo)"}`
                  : ""}
              </small>
              <strong>{selected.label}</strong>
              <p>{selected.description}</p>
            </div>
            {walking && pilot.nearby !== selected.id && !terrainFailed ? (
              <span className="world-walk-hint">
                Berjalan mendekat untuk masuk.
              </span>
            ) : (
              <Link
                href={worldEntrance(selected)}
                onClick={(event) => navigate(event, selected)}
              >
                {selected.action} <ArrowRight size={16} />
              </Link>
            )}
          </>
        ) : (
          <p>
            {walking
              ? "Ikuti jalur plaza. Klik peta untuk mengaktifkan kontrol keyboard."
              : mobile
                ? "Pilih lokasi untuk melihat lebih dekat, lalu masuk."
                : "Sentuh bangunan untuk menjelajah. Setiap tempat punya ceritanya."}
          </p>
        )}
      </div>
      <details className="world-shortcuts" open={terrainFailed || undefined}>
        <summary>Navigasi cepat</summary>
        <nav className="world-dock" aria-label="Navigasi cepat HIVE">
          {locations.map((item) => (
            <Link key={item.id} href={worldEntrance(item)}>
              <strong>{item.label}</strong>
              <span>
                {item.action} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </nav>
      </details>
    </section>
  );
}
