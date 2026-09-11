"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { RoundTransition } from "@/components/round-transition";
import { LivingBeliefField } from "@/components/living-belief-field";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  FastForward,
  LockKeyhole,
  Send,
  ShieldCheck,
  Timer,
  TriangleAlert,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, Crest, Sigil } from "@/components/identity";
import {
  ArenaCard,
  AuthGate,
  DemoNote,
  Empty,
  ErrorPanel,
  Loading,
  MatchPair,
  PageTitle,
  ProofLink,
  ReportDialog,
  ShareDialog,
} from "@/components/shared";
import { api, post } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import {
  argumentStats,
  percent,
  score,
  lift,
  validArgument,
} from "@/domain/rules";
import {
  PHASES,
  type Choice,
  type MatchView,
  type Result,
  type PublicReceipt,
  type Card,
} from "@/domain/types";
import { squads } from "@/domain/community";
type Replay = {
  id: string;
  results: Result[];
  totals: NonNullable<MatchView["totals"]>;
  cards: Card[];
};
export function useMatch() {
  const { data: v } = useSession();
  return useQuery({
    queryKey: ["match"],
    queryFn: () => api<MatchView>("matches/current/snapshot"),
    enabled: !!v,
    refetchInterval: 1000,
    staleTime: 0,
    retry: 1,
  });
}
export function ArenaIndex() {
  const { data: v } = useSession(),
    q = useMatch(),
    [tab, setTab] = useState("upcoming");
  return (
    <AuthGate>
      <PageTitle
        eyebrow="BRING YOUR PERSPECTIVE"
        title="Bersama, masuk Arena."
        description="Dua Hive. Sepuluh Squad. Satu pertanyaan yang layak dipikirkan."
        action={
          <Button variant="outline" asChild>
            <Link href="/rankings">
              Rankings <ArrowUpRight size={15} />
            </Link>
          </Button>
        }
      />
      <div className="filter-tabs mb-7">
        {[
          ["upcoming", "Untukmu"],
          ["history", "Replay"],
          ["live", "Live"],
        ].map(([id, label]) => (
          <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "upcoming" ? (
        <>
          {q.data?.started ? (
            <div className="panel mb-8">
              <p className="eyebrow mb-4">PERTANDINGAN DEMO-MU</p>
              <h2>
                {q.data.settled
                  ? "Ceritanya sudah lengkap."
                  : "Ada perspektif yang menunggumu."}
              </h2>
              <p className="muted text-sm my-4">
                Purple vs Chog ·{" "}
                {q.data.settled
                  ? "Hasil tersedia"
                  : `Ronde ${q.data.round} · ${q.data.phase}`}
              </p>
              <Button asChild>
                <Link
                  href={`/arena/founding-001/${q.data.settled ? "results" : "play"}`}
                >
                  {q.data.settled ? "Buka hasil" : "Kembali ke pertandingan"}
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          ) : (
            <ArenaCard />
          )}
          {v?.squadId !== "aster" && (
            <p className="status-message">
              Untuk mencoba sebagai pemain, pilih Squad Aster di onboarding.
              Kamu tetap dapat membaca replay tanpa mengikuti kompetisi.
            </p>
          )}
        </>
      ) : tab === "history" ? (
        <Link className="roster-card" href="/replays/founding-001">
          <MatchPair compact />
          <div>
            <h3>Founding match</h3>
            <p>3 ronde · contoh lengkap dari Think sampai Resolve</p>
          </div>
          <ArrowRight size={17} />
        </Link>
      ) : (
        <Empty
          title="Belum ada Arena live saat ini."
          description="Sambil menunggu pertandingan berikutnya, lihat bagaimana perspektif berubah dalam replay."
          href="/replays/founding-001"
          label="Tonton replay"
        />
      )}
      <DemoNote />
    </AuthGate>
  );
}
export function LobbyPage() {
  const q = useMatch(),
    { data: v } = useSession(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    qc = useQueryClient(),
    router = useRouter();
  async function action(kind: "readiness" | "start") {
    setBusy(true);
    setError("");
    try {
      const s = await post<MatchView>(
        `matches/current/${kind}`,
        kind === "readiness" ? { ready: !q.data?.ready } : {},
      );
      qc.setQueryData(["match"], s);
      if (kind === "start") router.push("/arena/founding-001/play");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthGate>
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : (
        q.data && (
          <>
            <div className="lobby-heading">
              <p className="eyebrow">THE FOUNDING MATCH · DEMO</p>
              <h1>Perspektifmu punya tempat.</h1>
              <p>
                Kenali siapa yang bertanding. Siapkan Squad sebelum pilihan
                pertama dimulai.
              </p>
            </div>
            <div className="lobby-duel">
              {["purple", "chog"].map((id, side) => (
                <div className="contents" key={id}>
                  {side === 1 && (
                    <div className="lobby-versus">
                      vs
                      <small>
                        3 RONDE
                        <br />5 SQUAD / HIVE
                      </small>
                    </div>
                  )}
                  <section className="lobby-hive">
                    <header>
                      <Sigil
                        symbol={side}
                        color={side ? "green" : "indigo"}
                        size={55}
                      />
                      <div>
                        <h2>{side ? "Chog" : "Purple"}</h2>
                        <p>5 Squad · 20 Human · demo roster</p>
                      </div>
                    </header>
                    {squads
                      .filter((s) => s.hiveId === id)
                      .map((s) => (
                        <div className="member-row" key={s.id}>
                          <Crest symbol={s.symbol} size={30} />
                          <div>
                            <strong>
                              {s.name}
                              {s.id === "aster" && v?.squadId === "aster"
                                ? " · Squad-mu"
                                : ""}
                            </strong>
                            <small>4 Human · bobot Squad setara</small>
                          </div>
                          {s.id === "aster" ? (
                            <span className="text-xs muted ml-auto">
                              {q.data!.ready ? "Siap" : "Menunggumu"}
                            </span>
                          ) : (
                            <Check className="ml-auto muted" size={14} />
                          )}
                        </div>
                      ))}
                  </section>
                </div>
              ))}
            </div>
            <div className="panel">
              <div className="section-title">
                <h2>Singkat sebelum bermain.</h2>
                <ProofLink />
              </div>
              <p className="muted text-sm leading-8">
                Pikirkan sendiri, diskusikan dengan Squad, lalu kunci pilihan.
                Reveal membuka initial belief. Council memberi ruang untuk
                mendengar alasan lain. Setelah Revision ditutup, final belief
                menunggu outcome sebelum skor diumumkan.
              </p>
              <div className="profile-metrics">
                <span>3 ronde</span>
                <span>Tanpa taruhan</span>
                <span>Roster terkunci saat mulai</span>
              </div>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="lobby-bottom">
              <p>
                {q.data.started
                  ? "Roster sudah dikunci. Kembali ke fase terbaru."
                  : v?.squadId !== "aster"
                    ? "Bergabung ke Aster untuk mencoba alur pemain demo."
                    : "Anggota lain disimulasikan. Tandai kesiapanmu untuk memulai."}
              </p>
              <div className="flex gap-3">
                {q.data.started ? (
                  <Button asChild>
                    <Link href="/arena/founding-001/play">
                      Kembali ke Arena
                      <ArrowRight size={15} />
                    </Link>
                  </Button>
                ) : v?.squadId !== "aster" ? (
                  <Button asChild>
                    <Link href="/onboarding/squad">
                      Pilih Squad demo
                      <ArrowRight size={15} />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => action("readiness")}
                      disabled={busy}
                    >
                      {q.data.ready ? (
                        <>
                          <Check size={15} />
                          Saya siap
                        </>
                      ) : (
                        "Tandai siap"
                      )}
                    </Button>
                    <Button
                      disabled={!q.data.ready || busy}
                      onClick={() => action("start")}
                    >
                      Masuk Arena
                      <ArrowRight size={15} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <DemoNote />
          </>
        )
      )}
    </AuthGate>
  );
}
function Countdown({ snapshot: s }: { snapshot: MatchView }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const received = Date.now();
    const t = setInterval(() => setElapsed(Date.now() - received), 200);
    return () => clearInterval(t);
  }, [s.serverNow]);
  const seconds =
    s.deadline === null
      ? 0
      : Math.max(0, Math.ceil((s.deadline - s.serverNow - elapsed) / 1000));
  return (
    <span
      className={`timer ${seconds <= 10 ? "urgent" : ""}`}
      aria-label={`Sisa fase ${seconds} detik`}
    >
      <Timer size={15} />
      {String(Math.floor(seconds / 60)).padStart(2, "0")}:
      {String(seconds % 60).padStart(2, "0")}
    </span>
  );
}
function ReceiptStatus({ receipt: r }: { receipt: PublicReceipt | null }) {
  if (!r) return null;
  const labels = {
    service_accepted: "Pilihan diterima. Menunggu konfirmasi…",
    chain_submitted: "Konfirmasi sedang diproses…",
    canonical_locked: "Call berhasil dikunci.",
    failed: "Call gagal dikunci sebelum batas waktu.",
  };
  return (
    <div
      className={`receipt ${r.state === "canonical_locked" ? "locked" : r.state === "failed" ? "failed" : ""}`}
      role="status"
      aria-label={
        r.stage === "initial" ? "Status call awal" : "Status call final"
      }
    >
      {r.state === "canonical_locked" ? (
        <LockKeyhole size={16} />
      ) : r.state === "failed" ? (
        <TriangleAlert size={16} />
      ) : (
        <LoaderCircle size={16} className="animate-spin" />
      )}
      <div>
        {labels[r.state]}
        <p className="text-[10px] opacity-80">
          Receipt simulasi · {r.id.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}
function Beliefs({
  initial,
  final = false,
}: {
  initial: { purple: number | null; chog: number | null };
  final?: boolean;
}) {
  return (
    <div className="belief-reveal">
      {["purple", "chog"].map((id, i) => {
        const value = id === "purple" ? initial.purple : initial.chog;
        return (
          <div className="belief-panel" key={id}>
            <header>
              <Sigil symbol={i} color={i ? "green" : "indigo"} size={39} />
              <strong>{i ? "Chog" : "Purple"}</strong>
            </header>
            <div className="belief-value">
              {percent(value)}
              <small>pilih A</small>
            </div>
            <div className="belief-bar">
              <span
                style={{ width: value === null ? "0%" : `${value / 10000}%` }}
              />
            </div>
            <p>
              {value === null
                ? "Belief tidak tersedia · forfeit"
                : `${final ? "Final" : "Initial"} belief · bobot tiap Squad setara`}
            </p>
          </div>
        );
      })}
    </div>
  );
}
function SquadChat({ s }: { s: MatchView }) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    qc = useQueryClient();
  const enabled =
    !s.finishedPlaying && ["deliberate", "council"].includes(s.phase);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await post("matches/current/chat", { text: message });
      setMessage("");
      await qc.invalidateQueries({ queryKey: ["match"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="match-sidebar">
      <div className="section-title">
        <h3>Squad Aster</h3>
        <Crest size={27} />
      </div>
      <p className="aside-copy">Ruang privat untuk empat perspektif.</p>
      <div className="chat-messages">
        {s.chat.map((m) => (
          <div key={m.id} className="chat-line">
            <Avatar index={m.avatar} size={29} />
            <div>
              <strong>{m.author}</strong>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      {enabled ? (
        <form className="chat-form" onSubmit={send}>
          <Input
            aria-label="Pesan ke Squad"
            placeholder="Bagikan alasanmu…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
          />
          <Button
            size="icon"
            aria-label="Kirim pesan"
            disabled={!message.trim() || busy}
          >
            <Send size={15} />
          </Button>
        </form>
      ) : (
        <p className="chat-locked">
          <LockKeyhole className="inline mr-1.5" size={12} />
          Percakapan terbuka pada Deliberate dan Council.
        </p>
      )}
      <div className="mt-7 pt-6 border-t">
        <h3>Satu alasan yang jelas.</h3>
        <p className="aside-copy">
          Berikan bukti. Ajukan pertanyaan. Sisakan ruang untuk pandangan yang
          belum kamu pertimbangkan.
        </p>
      </div>
    </aside>
  );
}
function ArgumentEditor({ s }: { s: MatchView }) {
  const [text, setText] = useState(s.argument),
    [busy, setBusy] = useState(false),
    qc = useQueryClient(),
    stats = argumentStats(text);
  return (
    <div className="match-action">
      <h2>Argumen resmi Aster</h2>
      <p>
        Representative merangkum alasan Squad. Maksimal 30 kata dan 240
        karakter.
      </p>
      {s.canEditArgument ? (
        <>
          <Textarea
            className="mt-4"
            aria-label="Argumen resmi Squad"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center mt-3">
            <span
              className={`text-xs ${validArgument(text) ? "muted" : "negative"}`}
            >
              {stats.words}/30 kata · {stats.characters}/240 karakter
            </span>
            <Button
              variant="outline"
              disabled={!validArgument(text) || busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await post("matches/current/argument", { text });
                  await qc.invalidateQueries({ queryKey: ["match"] });
                  toast.success("Argumen tersimpan.");
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Simpan argumen
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-4 text-foreground!">“{s.argument}”</p>
      )}
      <p className="form-note">
        Argumen dibekukan saat Commit dimulai. Peran demo dapat diubah melalui
        Pengaturan → Advanced.
      </p>
    </div>
  );
}
export function PlayPage() {
  const q = useMatch();
  return (
    <AuthGate>
      {q.isPending ? (
        <Loading />
      ) : q.error && !q.data ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : q.data && !q.data.started ? (
        <Empty
          title="Kenali roster sebelum mulai."
          description="Masuk ke Lobby dan tandai kesiapanmu bersama Squad."
          href="/arena/founding-001/lobby"
          label="Buka Lobby"
        />
      ) : q.data ? (
        <>
          <RoundTransition
            key={
              q.data.finishedPlaying
                ? "match-ended"
                : `${q.data.round}-${q.data.phase}`
            }
            round={q.data.round}
            phase={q.data.finishedPlaying ? "ended" : q.data.phase}
            results={q.data.results}
          />
          <MatchRoom key={q.data.round} s={q.data} stale={q.isRefetchError} />
        </>
      ) : null}
    </AuthGate>
  );
}
function MatchRoom({ s, stale }: { s: MatchView; stale: boolean }) {
  const { data: viewer } = useSession();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const ownSquad = squads.find((squad) => squad.id === viewer?.squadId) ?? null;
  const qc = useQueryClient(),
    [draft, setDraft] = useState<Choice | null>(s.own.initialChoice),
    [revision, setRevision] = useState<"stay" | "switch">("stay"),
    [attribution, setAttribution] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    requestKey = useRef<string | null>(null),
    lastPayload = useRef("");
  const titles: Record<string, string> = {
    think: "Sebelum mendengar yang lain, pikirkan sendiri.",
    deliberate: "Empat orang. Lebih dari satu cara melihat.",
    commit: "Sudah punya keyakinan? Kunci pilihanmu.",
    reveal: "Ternyata, kita melihatnya berbeda.",
    council: "Dengarkan alasan di balik angkanya.",
    revision: "Tetap yakin, atau melihat sesuatu yang baru?",
    resolve: "Pilihan ditutup. Ceritanya belum selesai.",
  };
  async function advance() {
    setBusy(true);
    setError("");
    try {
      await post("matches/current/advance");
      await qc.invalidateQueries({ queryKey: ["match"] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function commit(stage: "initial" | "final") {
    const choice =
      stage === "initial"
        ? draft
        : revision === "stay"
          ? s.own.initialChoice
          : s.own.initialChoice === "A"
            ? "B"
            : "A";
    if (!choice) return;
    setBusy(true);
    setError("");
    const payload = JSON.stringify({
      stage,
      choice,
      round: s.round,
      attribution:
        stage === "final" && revision === "switch" ? attribution : undefined,
    });
    if (lastPayload.current !== payload) {
      requestKey.current = crypto.randomUUID();
      lastPayload.current = payload;
    }
    try {
      await post("matches/current/commitments", {
        ...JSON.parse(payload),
        key: requestKey.current,
      });
      await qc.invalidateQueries({ queryKey: ["match"] });
    } catch (e) {
      setError((e as Error).message);
      await qc.invalidateQueries({ queryKey: ["match"] });
    } finally {
      setBusy(false);
    }
  }
  const isDraft =
    ["think", "deliberate", "commit"].includes(s.phase) &&
    !s.own.initialReceipt &&
    !s.finishedPlaying;
  return (
    <>
      <div className="match-top">
        <div>
          <MatchPair compact />
          <span className="eyebrow muted">RONDE {s.round} / 3</span>
        </div>
        {!s.finishedPlaying && <Countdown snapshot={s} />}
      </div>
      <div className="phase-track" aria-label="Fase pertandingan">
        {PHASES.map((phase, i) => (
          <span
            key={phase}
            className={
              s.phaseIndex === i ? "active" : s.phaseIndex > i ? "past" : ""
            }
            aria-current={s.phaseIndex === i ? "step" : undefined}
          >
            <i>{s.phaseIndex > i ? <Check size={10} /> : i + 1}</i>
            {phase[0].toUpperCase() + phase.slice(1)}
          </span>
        ))}
      </div>
      {stale && (
        <p className="status-message danger" role="alert">
          Koneksi sedang dipulihkan. Tindakan dinonaktifkan sampai status
          terbaru diterima.
        </p>
      )}
      <LivingBeliefField
        snapshot={s}
        stale={stale}
        reduced={viewer?.preferences.motion === "reduce"}
        activeCard={activeCard}
        squad={ownSquad}
        latestMessageId={s.chat.at(-1)?.id ?? null}
        onCard={(id) => {
          setActiveCard(id);
          document
            .getElementById(`argument-${id}`)
            ?.focus({ preventScroll: true });
          document
            .getElementById(`argument-${id}`)
            ?.scrollIntoView({ block: "nearest", behavior: "instant" });
        }}
      />
      <div className="match-layout">
        <section className="match-content">
          <p className="eyebrow">
            {s.settled
              ? "RESOLVED"
              : s.finishedPlaying
                ? "OUTCOME PENDING"
                : s.phase.toUpperCase()}
          </p>
          <h1>
            {s.settled
              ? "Semua ronde sudah punya hasil."
              : s.finishedPlaying
                ? "Terima kasih sudah membawa perspektifmu."
                : titles[s.phase]}
          </h1>
          <p className="muted">
            Pertanyaan ronde {s.round}: game mana yang mencatat pertumbuhan
            relatif concurrent players lebih tinggi dalam jendela observasi 30
            menit?
          </p>
          {s.phaseIndex >= 3 && !s.finishedPlaying && (
            <ReceiptStatus receipt={s.own.initialReceipt} />
          )}
          {s.phaseIndex >= 3 && !s.own.initialReceipt && !s.finishedPlaying && (
            <p className="status-message danger">
              Initial call tidak terkunci sebelum deadline. Ronde ini akan
              menjadi forfeit; kamu tetap bisa mengikuti cerita pertandingannya.
            </p>
          )}
          {!s.finishedPlaying && (
            <div className="prompt-options">
              {(["A", "B"] as Choice[]).map((choice) => (
                <button
                  key={choice}
                  className="choice-option"
                  disabled={!isDraft || busy || stale}
                  aria-pressed={(s.own.initialChoice ?? draft) === choice}
                  onClick={() => setDraft(choice)}
                >
                  <span className="choice-letter">{choice}</span>
                  <strong>
                    {choice === "A" ? "Counter-Strike 2" : "Dota 2"}
                  </strong>
                  <p>Pertumbuhan relatif pemain</p>
                  {(s.own.initialChoice ?? draft) === choice && (
                    <Check size={17} />
                  )}
                </button>
              ))}
            </div>
          )}
          {s.phase === "think" && !s.finishedPlaying && (
            <div className="match-action">
              <h2>Mulai dengan pikiranmu sendiri.</h2>
              <p>
                Pilihan di atas masih draft dan hanya terlihat olehmu. Kamu
                dapat mengubahnya sebelum dikunci saat Commit.
              </p>
            </div>
          )}
          {s.phase === "deliberate" && !s.finishedPlaying && (
            <ArgumentEditor s={s} />
          )}{" "}
          {s.phase === "commit" && !s.finishedPlaying && (
            <div className="match-action">
              <h2>Call pertamamu.</h2>
              <p>
                Setelah canonical lock, pilihan tidak bisa diubah sampai
                Revision. Diterima server belum berarti berhasil dikunci.
              </p>
              {!s.own.initialReceipt && (
                <Button
                  className="mt-5"
                  disabled={!draft || busy || stale}
                  onClick={() => commit("initial")}
                >
                  <LockKeyhole size={15} />
                  {busy ? "Mengirim…" : `Kunci pilihan ${draft ?? ""}`}
                </Button>
              )}
              <ReceiptStatus receipt={s.own.initialReceipt} />
            </div>
          )}
          {["reveal", "council", "revision"].includes(s.phase) &&
            !s.finishedPlaying &&
            s.initial && (
              <>
                <Beliefs initial={s.initial} />
                <p className="text-xs muted mb-6">
                  Ini initial belief, belum hasil pertandingan. Skor menunggu
                  final belief dan outcome.
                </p>
              </>
            )}
          {s.phase === "council" && !s.finishedPlaying && (
            <>
              <h2 className="text-xl">Suara dari Hive Purple</h2>
              <p className="muted text-xs mt-3">
                Baca alasan Squad lain. Identitas dan angka adalah konteks,
                bukan petunjuk siapa yang pasti benar.
              </p>
              <div className="council-list">
                {s.cards.map((c) => (
                  <article
                    key={c.id}
                    id={`argument-${c.id}`}
                    tabIndex={0}
                    onFocus={() => setActiveCard(c.id)}
                    onMouseEnter={() => setActiveCard(c.id)}
                    className={`argument-card ${activeCard === c.id ? "argument-highlight" : ""} ${c.unavailable ? "unavailable" : ""}`}
                  >
                    <header>
                      <Crest symbol={c.symbol} size={28} />
                      <strong>{c.squad}</strong>
                      <span>{percent(c.belief)} A</span>
                      <ReportDialog target={`card-${c.symbol}`} />
                    </header>
                    <p>
                      {c.unavailable
                        ? "Argumen tidak tersedia setelah tinjauan moderasi."
                        : c.text}
                    </p>
                  </article>
                ))}
              </div>
            </>
          )}
          {s.phase === "revision" && !s.finishedPlaying && (
            <div className="match-action">
              <h2>Keputusan terakhirmu.</h2>
              {s.own.initialReceipt?.state !== "canonical_locked" ? (
                <p>
                  Initial call tidak berhasil dikunci. Revisi tidak tersedia;
                  ronde ini dicatat sebagai forfeit untuk Hivemu.
                </p>
              ) : s.own.finalReceipt ? (
                <ReceiptStatus receipt={s.own.finalReceipt} />
              ) : (
                <>
                  <p>
                    Pilihan awalmu: <strong>{s.own.initialChoice}</strong>.
                    Tidak mengirim final call akan menjadi Defaulted Stay.
                  </p>
                  <div className="revision-options">
                    <button
                      aria-pressed={revision === "stay"}
                      onClick={() => setRevision("stay")}
                    >
                      Stay
                      <small>Tetap pada pilihan {s.own.initialChoice}</small>
                    </button>
                    <button
                      aria-pressed={revision === "switch"}
                      onClick={() => setRevision("switch")}
                    >
                      Switch
                      <small>
                        Beralih ke {s.own.initialChoice === "A" ? "B" : "A"}
                      </small>
                    </button>
                  </div>
                  {revision === "switch" && (
                    <div className="field">
                      <label htmlFor="attribution">
                        Apa yang membantu mengubah pikiranmu?
                      </label>
                      <select
                        id="attribution"
                        className="native-select"
                        value={attribution}
                        onChange={(e) => setAttribution(e.target.value)}
                      >
                        <option value="">Pilih satu alasan</option>
                        {s.cards
                          .filter((c) => c.symbol !== 0 && !c.unavailable)
                          .map((c) => (
                            <option key={c.id} value={`card-${c.symbol}`}>
                              Argumen Squad {c.squad}
                            </option>
                          ))}
                        <option value="own-squad">
                          Diskusi dalam Squad sendiri
                        </option>
                        <option value="own-reasoning">
                          Pertimbangan pribadi
                        </option>
                      </select>
                      <small>
                        Atribusi pada argumen resmi bersifat opsional. Kategori
                        alasan tetap diperlukan.
                      </small>
                    </div>
                  )}
                  <Button
                    disabled={
                      busy || stale || (revision === "switch" && !attribution)
                    }
                    onClick={() => commit("final")}
                  >
                    <LockKeyhole size={15} />
                    {busy
                      ? "Mengirim…"
                      : revision === "stay"
                        ? "Kunci Stay"
                        : "Kunci Switch"}
                  </Button>
                </>
              )}
            </div>
          )}
          {s.phase === "resolve" && !s.finishedPlaying && (
            <div className="match-action">
              <h2>Menyelesaikan reveal final.</h2>
              <p>
                Final belief belum ditampilkan sebelum barrier dan validasi
                selesai. Setelah ini, ronde berikutnya dimulai dan outcome akan
                menyusul.
              </p>
            </div>
          )}
          {s.finishedPlaying && (
            <>
              {s.final && <Beliefs initial={s.final} final />}
              <div className="match-action">
                <h2>
                  {s.settled
                    ? "Replay-mu siap dibaca."
                    : "Menunggu outcome yang sah."}
                </h2>
                <p>
                  {s.settled
                    ? "Lihat hasil setiap ronde, perubahan keyakinan, dan skor akhir dua Hive."
                    : "Final belief sudah terbuka. Outcome memakai jendela observasi 30 menit. Dalam demo, kamu bisa memajukan waktu untuk melihat hasil."}
                </p>
                {s.settled && (
                  <Button className="mt-5" asChild>
                    <Link href="/arena/founding-001/results">
                      Lihat hasil pertandingan <ArrowRight size={15} />
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
          {s.results.some((r) => r.round < s.round) && (
            <div className="mt-7">
              <h3 className="text-sm mb-4">Ronde sebelumnya</h3>
              {s.results
                .filter((r) => r.round < s.round)
                .map((r) => (
                  <div className="metric-row" key={r.round}>
                    <span>Ronde {r.round}</span>
                    <strong>
                      {r.status === "pending"
                        ? `Final ${percent(r.purple.final)} A · outcome pending`
                        : r.status === "void"
                          ? "Void"
                          : `${score(r.purple.score)} — ${score(r.chog.score)}`}
                    </strong>
                  </div>
                ))}
            </div>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </section>
        <SquadChat s={s} />
      </div>
      <div className="demo-controls">
        <p>
          DEMO · Waktu dan anggota lain disimulasikan. Tombol ini memajukan fase
          untuk mengeksplorasi alur tanpa menunggu durasi penuh.
        </p>
        {!s.settled && (
          <Button variant="outline" onClick={advance} disabled={busy || stale}>
            <FastForward size={14} />
            {s.finishedPlaying
              ? "Majukan ke outcome demo"
              : "Majukan fase demo"}
          </Button>
        )}
        {s.settled && <ProofLink />}
      </div>
    </>
  );
}
function OutcomeSummary({ data }: { data: Replay }) {
  const t = data.totals;
  return (
    <div className="result-hero">
      <p className="eyebrow">FOUNDING MATCH · HASIL DEMO</p>
      <div className="flex justify-center">
        {t.winner === "no_contest" ? (
          <ShieldCheck className="muted" size={52} />
        ) : t.winner === "draw" ? (
          <MatchPair compact />
        ) : (
          <Sigil
            size={76}
            symbol={t.winner === "chog" ? 1 : 0}
            color={t.winner === "chog" ? "green" : "indigo"}
          />
        )}
      </div>
      <h1>
        {t.winner === "no_contest"
          ? "Pertandingan tanpa klasemen."
          : t.winner === "draw"
            ? "Pertandingan seri."
            : `${t.winner === "purple" ? "Purple" : "Chog"} memenangkan pertandingan.`}
      </h1>
      <p className="muted text-sm">
        {t.winner === "no_contest"
          ? "Kurang dari dua ronde memiliki outcome sah. Tidak dicatat sebagai menang atau kalah."
          : `${t.valid} ronde sah · Selisih ${score(Math.abs(t.purple - t.chog))} poin. Pemenang ditentukan oleh total skor seluruh ronde sah, bukan jumlah kemenangan ronde.`}
      </p>
      <div className="result-scores">
        <div>
          <strong>{score(t.purple)}</strong>
          <span>PURPLE · SKOR MATCH</span>
        </div>
        <span className="score-divider">/</span>
        <div>
          <strong>{score(t.chog)}</strong>
          <span>CHOG · SKOR MATCH</span>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto text-left">
        <table className="w-full text-sm">
          <caption className="text-left font-semibold mb-3">
            Ringkasan penilaian pertandingan
          </caption>
          <thead>
            <tr className="border-b">
              <th className="p-3">Ronde</th>
              <th className="p-3">Jawaban benar</th>
              <th className="p-3">Purple</th>
              <th className="p-3">Chog</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r) => (
              <tr key={r.round} className="border-b">
                <th className="p-3">{r.round}</th>
                <td className="p-3">
                  {r.status === "resolved" && r.outcome
                    ? `${r.outcome} · ${r.outcome === "A" ? "Counter-Strike 2" : "Dota 2"}`
                    : r.status === "void"
                      ? "Dibatalkan · tidak dihitung"
                      : "Menunggu hasil"}
                </td>
                {[r.purple, r.chog].map((p, i) => (
                  <td key={i} className="p-3 tabular-nums">
                    {score(p.score)}
                    {p.forfeit ? (
                      <span className="block text-xs muted">
                        Call tidak sah
                      </span>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="p-3" colSpan={2}>
                Total poin ronde sah
              </th>
              <td className="p-3 font-semibold">{score(t.purple)}</td>
              <td className="p-3 font-semibold">{score(t.chog)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
function RoundDetail({ r }: { r: Result }) {
  return (
    <>
      <div className="section-title">
        <h2>Ronde {r.round}</h2>
        <span className="text-xs muted">
          {r.status === "resolved"
            ? `Outcome ${r.outcome} · ${r.outcome === "A" ? "Counter-Strike 2" : "Dota 2"}`
            : r.status === "void"
              ? "Void · tidak dihitung"
              : "Outcome pending"}
        </span>
      </div>
      <section className="panel mb-6" aria-label="Jawaban ronde">
        <p className="eyebrow">
          {r.status === "resolved"
            ? "JAWABAN BENAR · HASIL DEMO"
            : "STATUS JAWABAN"}
        </p>
        <h2>
          {r.status === "resolved" && r.outcome
            ? `${r.outcome} · ${r.outcome === "A" ? "Counter-Strike 2" : "Dota 2"}`
            : r.status === "void"
              ? "Ronde dibatalkan"
              : "Jawaban belum tersedia"}
        </h2>
        <p className="muted text-sm">
          Pertanyaan: game mana yang memiliki pertumbuhan relatif pemain
          bersamaan lebih tinggi dalam jendela observasi 30 menit?
        </p>
        <p className="form-note muted">
          {r.status === "resolved"
            ? "Jawaban ini ditetapkan oleh simulasi demo. Data pertumbuhan Steam aktual belum terhubung; hasil ini bukan klaim performa game secara langsung."
            : r.status === "void"
              ? "Tidak ada jawaban sah. Ronde ini tidak menambah skor pertandingan."
              : "Penilaian baru tersedia setelah hasil observasi ditetapkan."}
        </p>
      </section>
      <div className="result-grid">
        {[r.purple, r.chog].map((p, i) => (
          <section className="panel" key={i}>
            <div className="flex items-center gap-3 mb-5">
              <Sigil symbol={i} color={i ? "green" : "indigo"} size={40} />
              <h2 className="mb-0!">
                {i ? "Chog" : "Purple"}
                {p.forfeit ? " · Forfeit" : ""}
              </h2>
            </div>
            <div className="metric-row">
              <span>Dukungan awal untuk A</span>
              <strong>{percent(p.initial)}</strong>
            </div>
            <div className="metric-row">
              <span>Dukungan akhir · A / B</span>
              <strong>
                {p.final === null
                  ? "Tidak tersedia"
                  : `${percent(p.final)} / ${percent(1_000_000 - p.final)}`}
              </strong>
            </div>
            <div className="metric-row">
              <span>Skor ronde · maksimum 100</span>
              <strong>
                {score(p.score)}
                {p.score !== null ? " poin" : ""}
              </strong>
            </div>
            {r.status === "resolved" &&
              r.outcome &&
              !p.forfeit &&
              p.final !== null && (
                <p className="my-4 text-sm leading-relaxed">
                  Dukungan akhir untuk jawaban benar ({r.outcome}) adalah{" "}
                  <strong>
                    {percent(r.outcome === "A" ? p.final : 1_000_000 - p.final)}
                  </strong>
                  . Dengan rumus penilaian, dukungan ini menghasilkan{" "}
                  <strong>{score(p.score)} dari 100 poin</strong>.
                </p>
              )}
            <div className="metric-row">
              <span>Perbaikan ketepatan · Wisdom Lift</span>
              <strong
                className={
                  p.lift !== null && p.lift > 0
                    ? "positive"
                    : p.lift !== null && p.lift < 0
                      ? "negative"
                      : ""
                }
              >
                {lift(p.lift)}
              </strong>
            </div>
            <div className="metric-row">
              <span>Perubahan skor dari dukungan awal</span>
              <strong>
                {p.scoreLift !== null && p.scoreLift > 0 ? "+" : ""}
                {score(p.scoreLift)}
              </strong>
            </div>
            <p className="form-note muted">
              {p.forfeit
                ? "Forfeit berarti call wajib tidak terungkap secara sah. Pada ronde dengan hasil sah, Hive mendapat 0 poin, bukan dinilai dari jawabannya. Dukungan dan Wisdom Lift tidak tersedia."
                : r.status === "void"
                  ? "Tidak ada outcome sah. Ronde ini tidak masuk skor match atau reputasi."
                  : p.lift !== null && p.lift < 0
                    ? "Final belief menjauh dari outcome. Mengubah pikiran tidak selalu meningkatkan ketepatan."
                    : r.status === "pending"
                      ? "Skor dan Wisdom Lift menunggu jawaban sah."
                      : "Wisdom Lift menunjukkan perubahan dukungan untuk jawaban benar setelah diskusi. Nilai 0 berarti ketepatan tidak berubah; ini bukan bonus poin."}
            </p>
          </section>
        ))}
      </div>
      <details className="panel mt-6">
        <summary className="cursor-pointer font-semibold">
          Bagaimana skor dan Wisdom Lift dihitung?
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed muted">
          <p>
            A = Counter-Strike 2. B = Dota 2. Dukungan Hive dihitung dari
            rata-rata dukungan setiap Squad; tiap Squad memiliki bobot sama.
          </p>
          <p>
            Skor ronde = 100 × [1 − (1 − dukungan akhir untuk jawaban benar)²].
            Persentase diubah ke desimal: 80% menjadi 0,8.
          </p>
          <p>
            Contoh: dukungan 80% untuk jawaban benar menghasilkan 100 × [1 − (1
            − 0,8)²] = <strong>96 poin</strong>. Dukungan 100% menghasilkan 100
            poin; 50% menghasilkan 75 poin; 0% menghasilkan 0 poin.
          </p>
          <p>
            Wisdom Lift = dukungan akhir untuk jawaban benar − dukungan awal
            untuk jawaban benar. Dari 60% ke 80% berarti +20 poin persentase
            (pp). Nilai negatif berarti ketepatan menurun. Wisdom Lift tidak
            ditambahkan lagi ke skor ronde.
          </p>
          <p>
            Total pertandingan menjumlahkan skor ronde sah. Ronde dibatalkan
            tidak dihitung; call tidak sah mendapat 0 pada ronde sah. Total sama
            berarti seri. Kurang dari dua ronde sah berarti tidak ada hasil
            menang/kalah. Angka tampilan dibulatkan; penilaian memakai presisi
            internal.
          </p>
        </div>
      </details>
    </>
  );
}
export function ResultsPage() {
  const q = useMatch(),
    [round, setRound] = useState(1);
  return (
    <AuthGate>
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : !q.data?.settled ? (
        <Empty
          title="Hasil yang sah butuh waktu."
          description="Belum semua outcome selesai. Buka pertandingan untuk melihat status terbaru."
          href="/arena/founding-001/play"
          label="Kembali ke pertandingan"
        />
      ) : (
        <>
          <OutcomeSummary
            data={{
              id: "current",
              results: q.data.results,
              totals: q.data.totals!,
              cards: q.data.cards,
            }}
          />
          <div className="replay-timeline">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                aria-pressed={round === n}
                onClick={() => setRound(n)}
              >
                Ronde {n}
              </button>
            ))}
          </div>
          <RoundDetail r={q.data.results[round - 1]} />
          <div className="result-actions">
            <Button asChild>
              <Link href="/replays/current">
                Buka replay-mu <ArrowRight size={15} />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/squads/aster">Kembali ke Squad</Link>
            </Button>
            <ProofLink id="current" />
          </div>
          <DemoNote />
        </>
      )}
    </AuthGate>
  );
}
export function ReplayPage({
  id,
  watch = false,
}: {
  id: string;
  watch?: boolean;
}) {
  const params = useSearchParams(),
    router = useRouter(),
    round = Math.min(3, Math.max(1, Number(params.get("round")) || 1)),
    q = useQuery({
      queryKey: ["replay", id],
      queryFn: () => api<Replay>(`replays/${id}`),
    });
  if (q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  const r = q.data.results[round - 1];
  return (
    <>
      {watch && (
        <p className="status-message">
          Tidak ada siaran live untuk pertandingan ini. Kamu sedang menonton
          replay demo yang sudah selesai.
        </p>
      )}
      <div className="flex justify-between items-center mb-3">
        <Link className="text-link subtle" href="/arena">
          <ArrowLeft size={14} />
          Semua Arena
        </Link>
        <ShareDialog id={q.data.id} />
      </div>
      <OutcomeSummary data={q.data} />
      <div className="replay-timeline">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            aria-pressed={round === n}
            onClick={() =>
              router.replace(`/replays/${id}?round=${n}`, { scroll: false })
            }
          >
            Ronde {n}
          </button>
        ))}
      </div>
      <div className="panel mb-8">
        <p className="eyebrow muted mb-4">PERTANYAAN RONDE {round}</p>
        <h2 className="text-2xl leading-snug">
          Counter-Strike 2 atau Dota 2: game mana yang tumbuh lebih cepat?
        </h2>
        <p className="muted text-xs mt-4 leading-7">
          Diukur dari perubahan relatif concurrent players dalam jendela 30
          menit. Semua data pada replay ini adalah ilustrasi.
        </p>
      </div>
      <div className="replay-chapter">
        <span>01</span>
        <div>
          <h3>Berawal dari keyakinan yang berbeda.</h3>
          <p>
            Initial belief dibuka setelah Commit. Bobot setiap Squad setara.
          </p>
        </div>
      </div>
      <Beliefs initial={{ purple: r.purple.initial, chog: r.chog.initial }} />
      {round === 1 && (
        <>
          <div className="replay-chapter">
            <span>02</span>
            <div>
              <h3>Alasan lain mendapat ruang.</h3>
              <p>Argumen resmi dari Council Hive Purple.</p>
            </div>
          </div>
          <div className="roster-grid">
            {q.data.cards.slice(0, 4).map((c) => (
              <article className="argument-card" key={c.id}>
                <header>
                  <Crest symbol={c.symbol} size={27} />
                  <strong>{c.squad}</strong>
                </header>
                <p>
                  {c.unavailable
                    ? "Argumen tidak tersedia setelah moderasi."
                    : c.text}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
      <div className="replay-chapter">
        <span>{round === 1 ? "03" : "02"}</span>
        <div>
          <h3>Keputusan selesai. Outcome memberi konteks.</h3>
          <p>
            {r.purple.lift !== null && r.purple.lift < 0
              ? "Perubahan keyakinan kali ini menjauh dari outcome."
              : "Final belief baru dapat dinilai setelah outcome sah tersedia."}
          </p>
        </div>
      </div>
      <RoundDetail r={r} />
      <div className="result-actions">
        <ShareDialog id={q.data.id} />
        <Button asChild variant="outline">
          <Link href="/sign-in">
            Bawa perspektifmu sendiri <ArrowRight size={15} />
          </Link>
        </Button>
        <ProofLink id={q.data.id} />
      </div>
      <DemoNote />
    </>
  );
}
