"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Copy,
  FastForward,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { api, post } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
import { percent, score, lift } from "@/domain/rules";
import type { Choice, OpenCall } from "@/domain/types";
import { Avatar, Crest } from "@/components/identity";
import {
  AuthGate,
  Empty,
  ErrorPanel,
  Loading,
  PageTitle,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import "./calls.css";

const labels = {
  open: "OPEN",
  discussing: "DISCUSSING",
  resolving: "RESOLVING",
  resolved: "RESOLVED",
  void: "VOID",
} as const;
function useCalls() {
  return useQuery({
    queryKey: ["calls"],
    queryFn: () => api<OpenCall[]>("calls"),
    staleTime: 0,
  });
}
function CallVisual({
  call,
  compact = false,
}: {
  call: OpenCall;
  compact?: boolean;
}) {
  return (
    <div className={`call-visual ${compact ? "compact" : ""}`}>
      <div className="call-game game-a">
        <span>A</span>
        <strong>CS2</strong>
      </div>
      <div className="call-pulse" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="call-game game-b">
        <span>B</span>
        <strong>DOTA 2</strong>
      </div>
      {call.belief && (
        <div
          className="call-belief"
          aria-label={`Belief komunitas ${percent(call.belief.a)} A dan ${percent(call.belief.b)} B`}
        >
          <i style={{ width: `${call.belief.a / 10000}%` }} />
          <span>{percent(call.belief.a)} A</span>
          <span>{percent(call.belief.b)} B</span>
        </div>
      )}
    </div>
  );
}
export function CallCard({ call }: { call: OpenCall }) {
  return (
    <Link href={`/calls/${call.id}`} className="open-call-card">
      <header>
        <span className={`call-status status-${call.stage}`}>
          {labels[call.stage]}
        </span>
        <span>
          <Clock3 size={12} /> {call.window}
        </span>
      </header>
      <CallVisual call={call} compact />
      <p className="eyebrow">{call.title}</p>
      <h3>{call.question}</h3>
      <footer>
        <span>
          {call.participants} Human · {call.squads} Squad
        </span>
        <strong>
          {call.initialLocked ? "Lanjutkan Call" : "Buat prediksi"}
          <ArrowRight size={14} />
        </strong>
      </footer>
    </Link>
  );
}
export function CallsPage() {
  const q = useCalls();
  const [filter, setFilter] = useState("Untukmu");
  const filters = ["Untukmu", "Quick", "Resolving soon", "Resolved"];
  const visible = q.data?.filter((call) => {
    if (filter === "Quick") return call.kind === "quick";
    if (filter === "Resolving soon") return call.stage === "resolving";
    if (filter === "Resolved") return call.stage === "resolved";
    return true;
  });
  return (
    <AuthGate>
      <PageTitle
        scene="pulse"
        eyebrow="OPEN CALLS · ANYTIME"
        title="Apa yang akan terjadi selanjutnya?"
        description="Prediksi kapan saja. Kunci pikiranmu sebelum melihat suara komunitas."
      />
      <div className="call-filter" role="tablist" aria-label="Filter Open Call">
        {filters.map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={filter === name}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : visible?.length ? (
        <div className="calls-grid">
          {visible.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      ) : (
        <Empty
          title={
            filter === "Untukmu"
              ? "Belum ada Open Call."
              : `Belum ada Call di ${filter}.`
          }
          description="Call akan muncul ketika sumber outcome siap diverifikasi."
        />
      )}
    </AuthGate>
  );
}
export function QuickCallPage({ id }: { id: string }) {
  const session = useSession(),
    qc = useQueryClient();
  const q = useQuery({
    queryKey: ["call", id],
    queryFn: () => api<OpenCall>(`calls/${id}`),
    enabled: !!session.data,
    staleTime: 0,
  });
  const [choice, setChoice] = useState<Choice | null>(null),
    [finalChoice, setFinalChoice] = useState<Choice | null>(null),
    [reason, setReason] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function mutate(path: string, body: unknown = {}) {
    setBusy(true);
    try {
      const data = await post<OpenCall>(`calls/${id}/${path}`, body);
      qc.setQueryData(["call", id], data);
      qc.invalidateQueries({ queryKey: ["calls"] });
      return data;
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (session.isPending || q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return null;
  const call = q.data,
    selected = call.initialChoice ?? choice,
    revision = finalChoice ?? call.finalChoice ?? call.initialChoice;
  return (
    <AuthGate>
      <Link href="/calls" className="text-link subtle">
        <ArrowLeft size={14} />
        Semua Open Call
      </Link>
      <div className="call-detail-head">
        <div>
          <p className="eyebrow">
            {call.title} <span className="demo-tag">DEMO</span>
          </p>
          <h1>{call.question}</h1>
          <p className="muted">
            {call.metric} · jendela {call.window}
          </p>
        </div>
        <span className={`call-status status-${call.stage}`}>
          {labels[call.stage]}
        </span>
      </div>
      <CallVisual call={call} />
      <div className="call-detail-layout">
        <main className="call-main">
          {call.stage === "open" && (
            <section className="panel">
              <h2>Pilih sebelum melihat komunitas.</h2>
              <p className="muted text-sm">
                Pilihan dan alasanmu tetap privat sampai dikunci.
              </p>
              <div className="call-options">
                {(["A", "B"] as Choice[]).map((c) => (
                  <button
                    key={c}
                    aria-pressed={selected === c}
                    onClick={() => setChoice(c)}
                  >
                    <span>{c}</span>
                    <strong>{c === "A" ? call.optionA : call.optionB}</strong>
                    {selected === c && <Check size={16} />}
                  </button>
                ))}
              </div>
              <label className="field">
                <span>Alasan singkat</span>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={240}
                  placeholder="Sinyal apa yang mendukung prediksimu?"
                />
                <small>{Array.from(reason).length}/240 karakter</small>
              </label>
              <Button
                disabled={!choice || !reason.trim() || busy}
                onClick={() => mutate("lock", { choice, reason })}
              >
                <LockKeyhole size={15} />
                Kunci prediksi {choice}
              </Button>
            </section>
          )}
          {call.stage === "discussing" && (
            <>
              <section className="panel call-revision">
                <p className="eyebrow">PREDIKSIMU TERKUNCI</p>
                <h2>
                  {call.initialChoice} ·{" "}
                  {call.initialChoice === "A" ? call.optionA : call.optionB}
                </h2>
                <blockquote>“{call.reason}”</blockquote>
                <h3>Setelah membaca diskusi, apa keputusan finalmu?</h3>
                <div className="call-options">
                  {(["A", "B"] as Choice[]).map((c) => (
                    <button
                      key={c}
                      aria-pressed={revision === c}
                      onClick={() => setFinalChoice(c)}
                    >
                      <span>{c}</span>
                      <strong>
                        {c === call.initialChoice ? "Stay" : "Switch"}
                      </strong>
                    </button>
                  ))}
                </div>
                <Button
                  disabled={!revision || busy}
                  onClick={() => mutate("revise", { choice: revision })}
                >
                  <ShieldCheck size={15} />
                  {call.finalLocked
                    ? "Perbarui final call"
                    : "Kunci final call"}
                </Button>
              </section>
              <section className="panel">
                <h2>Diskusi Squad</h2>
                <div className="call-chat">
                  {call.discussion.map((m) => (
                    <div key={m.id}>
                      <Avatar index={m.avatar} size={30} />
                      <p>
                        <strong>{m.author}</strong>
                        {m.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="call-message">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={240}
                    placeholder="Bagikan alasanmu ke Squad…"
                  />
                  <Button
                    size="icon"
                    aria-label="Kirim pesan"
                    disabled={!message.trim() || busy}
                    onClick={async () => {
                      if (await mutate("discussion", { text: message }))
                        setMessage("");
                    }}
                  >
                    <MessageCircle size={16} />
                  </Button>
                </div>
              </section>
            </>
          )}
          {call.stage === "resolving" && (
            <section className="panel call-wait">
              <div className="resolve-orbit">
                <Sparkles />
              </div>
              <h2>Reality is checking the call.</h2>
              <p>
                Snapshot akhir sedang dibandingkan dengan baseline awal.
                Distribusi di atas adalah belief komunitas, bukan hasil.
              </p>
            </section>
          )}
          {(call.stage === "resolved" || call.stage === "void") && (
            <CallResult call={call} />
          )}
        </main>
        <aside className="call-side">
          <section>
            <p className="eyebrow">SOURCE OF TRUTH</p>
            <h3>{call.source}</h3>
            <dl>
              <div>
                <dt>Metric</dt>
                <dd>{call.metric}</dd>
              </div>
              <div>
                <dt>Window</dt>
                <dd>{call.window}</dd>
              </div>
              <div>
                <dt>Partisipasi</dt>
                <dd>{call.participants} Human</dd>
              </div>
            </dl>
            <p className="form-note">
              Resolver dan snapshot masih berupa simulasi demo; tidak ada klaim
              data Steam live. Jumlah partisipasi dan percakapan juga
              ilustratif.
            </p>
          </section>
          <section>
            <Crest symbol={0} size={36} />
            <h3>Aster mengikuti Call</h3>
            <p>
              {call.initialLocked
                ? "Diskusi terbuka setelah prediksimu terkunci."
                : "Suara komunitas tetap tersembunyi sebelum lock."}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  toast.success("Tautan undangan Squad disalin.");
                } catch {
                  toast.error("Salin URL dari bilah alamat browser.");
                }
              }}
            >
              <Copy size={14} /> Undang Squad
            </Button>
          </section>
        </aside>
      </div>
      {(call.stage === "discussing" || call.stage === "resolving") && (
        <div className="demo-controls">
          <p>DEMO · Majukan siklus Open Call tanpa menunggu waktu nyata.</p>
          <Button
            variant="outline"
            disabled={
              busy || (call.stage === "discussing" && !call.finalLocked)
            }
            onClick={() => mutate("advance")}
          >
            <FastForward size={14} />
            {call.stage === "discussing"
              ? "Tutup Call dan mulai Resolve"
              : "Selesaikan outcome demo"}
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => mutate("void")}
          >
            Simulasikan source gagal
          </Button>
        </div>
      )}
    </AuthGate>
  );
}
function CallResult({ call }: { call: OpenCall }) {
  const e = call.evidence;
  if (call.stage === "void")
    return (
      <section className="panel call-result call-void">
        <p className="eyebrow">VOID · SOURCE UNAVAILABLE</p>
        <div className="result-answer">
          <ShieldCheck />
          <div>
            <span>Tidak ada jawaban sah</span>
            <h2>Call dibatalkan dengan aman.</h2>
          </div>
        </div>
        <p className="muted">
          Snapshot akhir tidak dapat diverifikasi. Prediksi tidak dinilai dan
          reputasi semua peserta tetap utuh.
        </p>
      </section>
    );
  return (
    <section className="panel call-result">
      <p className="eyebrow">OUTCOME · HASIL DEMO</p>
      <div className="result-answer">
        <ShieldCheck />
        <div>
          <span>Jawaban benar</span>
          <h2>
            {call.outcome} ·{" "}
            {call.outcome === "A" ? call.optionA : call.optionB}
          </h2>
        </div>
      </div>
      {e && (
        <div className="evidence-race">
          <div>
            <span>{call.optionA}</span>
            <strong>{e.a.growth}</strong>
            <small>
              {e.a.start.toLocaleString("id-ID")} →{" "}
              {e.a.end.toLocaleString("id-ID")}
            </small>
          </div>
          <div>
            <span>{call.optionB}</span>
            <strong>{e.b.growth}</strong>
            <small>
              {e.b.start.toLocaleString("id-ID")} →{" "}
              {e.b.end.toLocaleString("id-ID")}
            </small>
          </div>
        </div>
      )}
      {call.initialChoice ? (
        <div className="call-score">
          <div>
            <span>Prediksi awal</span>
            <strong>{call.initialChoice}</strong>
          </div>
          <div>
            <span>Prediksi final</span>
            <strong>{call.finalChoice ?? call.initialChoice}</strong>
          </div>
          <div>
            <span>Skor</span>
            <strong>{score(call.score)}</strong>
          </div>
          <div>
            <span>Wisdom Lift</span>
            <strong>{lift(call.wisdomLift)}</strong>
          </div>
        </div>
      ) : (
        <p className="public-score-note">
          Skor dan Wisdom Lift personal hanya terlihat oleh peserta Call.
        </p>
      )}
      <p className="form-note">
        Snapshot ilustrasi diambil{" "}
        {e?.capturedAt ? new Date(e.capturedAt).toLocaleString("id-ID") : "—"}.
        Pertumbuhan relatif tertinggi menentukan jawaban.
      </p>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              `${window.location.origin}/calls/${call.id}/result`,
            );
            toast.success("Tautan hasil publik disalin.");
          } catch {
            toast.error("Salin URL dari bilah alamat browser.");
          }
        }}
      >
        <Copy size={14} />
        Bagikan hasil
      </Button>
    </section>
  );
}

export function QuickCallResultPage({ id }: { id: string }) {
  const q = useQuery({
    queryKey: ["public-call", id],
    queryFn: () => api<OpenCall>(`calls/${id}/public`),
  });
  if (q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return null;
  return (
    <div className="call-public-result">
      <PageTitle
        eyebrow="OPEN CALL · PUBLIC RESULT"
        title="Reality resolved the call."
        description="Bukti outcome bisa dibaca siapa pun, tanpa akun HIVE."
      />
      <CallVisual call={q.data} />
      <CallResult call={q.data} />
      <div className="public-result-cta">
        <p>Ingin mengunci prediksimu sebelum melihat suara komunitas?</p>
        <Button asChild>
          <Link href="/sign-in">
            Gabung Open Call <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
