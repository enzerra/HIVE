"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Bell,
  Check,
  ArrowRight,
  ArrowUpRight,
  Download,
  ShieldCheck,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/identity";
import {
  AuthGate,
  DemoNote,
  Empty,
  ErrorPanel,
  Loading,
  PageTitle,
} from "@/components/shared";
import { useSession } from "@/lib/client/session";
import { api, post } from "@/lib/client/api";
import type {
  Viewer,
  Preferences,
  Notification,
  Scenario,
  MatchView,
} from "@/domain/types";
export function NotificationsPage() {
  const { data: v } = useSession(),
    qc = useQueryClient(),
    q = useQuery({
      queryKey: ["notifications"],
      queryFn: () => api<Notification[]>("notifications"),
      enabled: !!v,
    }),
    [busy, setBusy] = useState("");
  return (
    <AuthGate>
      <PageTitle
        eyebrow="KEEP YOUR CIRCLE CLOSE"
        title="Dari lingkaranmu."
        description="Undangan, pertandingan, dan cerita yang perlu kamu tahu."
      />
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : !q.data?.length ? (
        <Empty
          title="Semuanya sudah kamu lihat."
          description="Undangan dan pembaruan yang relevan akan muncul di sini."
          href="/home"
          label="Kembali ke Home"
        />
      ) : (
        q.data.map((n) => (
          <article className="notification-row" key={n.id}>
            <div className="mt-1">
              <Bell size={18} className="muted" />
            </div>
            <div>
              <h3>
                {n.title}
                {!n.read && (
                  <span className="ml-2 text-primary" aria-label="Belum dibaca">
                    ·
                  </span>
                )}
              </h3>
              <p>{n.body}</p>
              <Link className="text-link" href={n.href}>
                Lihat selengkapnya
                <ArrowRight size={13} />
              </Link>
            </div>
            <Button
              variant="ghost"
              disabled={busy === n.id}
              onClick={async () => {
                setBusy(n.id);
                try {
                  await post(`notifications/${n.id}`, { read: !n.read });
                  await qc.invalidateQueries({ queryKey: ["notifications"] });
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setBusy("");
                }
              }}
            >
              {n.read ? (
                "Belum dibaca"
              ) : (
                <>
                  <Check size={13} />
                  Tandai dibaca
                </>
              )}
            </Button>
          </article>
        ))
      )}
      <DemoNote />
    </AuthGate>
  );
}
export function SettingsPage({ tab }: { tab: string }) {
  const { data: v } = useSession();
  return (
    <AuthGate>
      <PageTitle
        title="Buat HIVE terasa sepertimu."
        description="Identitas, kenyamanan, dan kontrol ada di tanganmu."
      />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Pengaturan">
          {[
            ["profile", "Profil"],
            ["preferences", "Preferensi"],
            ["privacy", "Privasi"],
            ["advanced", "Advanced"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={`/settings/${id}`}
              aria-current={tab === id ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        {v && <SettingsForm key={`${tab}-${v.id}`} tab={tab} viewer={v} />}
      </div>
    </AuthGate>
  );
}
function SettingsForm({ tab, viewer: v }: { tab: string; viewer: Viewer }) {
  const [handle, setHandle] = useState(v.handle),
    [avatar, setAvatar] = useState(v.avatar),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [scenario, setScenario] = useState<Scenario>("normal"),
    qc = useQueryClient(),
    router = useRouter(),
    { setTheme } = useTheme();
  async function prefs(change: Partial<Preferences>) {
    try {
      const p = await post<Preferences>("preferences", change);
      qc.setQueryData(["session"], { ...v, preferences: p });
      if (change.theme) setTheme(change.theme);
      if (change.motion)
        document.documentElement.dataset.reducedMotion = String(
          change.motion === "reduce",
        );
      toast.success("Preferensi disimpan.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  async function saveProfile() {
    setBusy(true);
    setError("");
    try {
      if (!/^[A-Za-z0-9_]{3,24}$/.test(handle)) {
        setError("Gunakan 3–24 huruf, angka, atau underscore.");
        return;
      }
      const updated = await post<Viewer>("me/profile", { handle, avatar });
      qc.setQueryData(["session"], updated);
      toast.success("Profil diperbarui.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="settings-section">
      {tab === "profile" ? (
        <>
          <h2>Identitasmu di HIVE.</h2>
          <p className="muted">
            Wajah yang dikenal temanmu. Nama yang kamu pilih sendiri.
          </p>
          <div className="avatar-picker">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                aria-label={`Pilih avatar ${i + 1}`}
                aria-pressed={avatar === i}
                onClick={() => setAvatar(i)}
              >
                <Avatar index={i} size={45} />
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="profile-handle">Nama di HIVE</label>
            <Input
              id="profile-handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={24}
            />
            <small>
              3–24 huruf, angka, atau underscore. Nama pada replay yang
              diterbitkan memakai snapshot saat pertandingan.
            </small>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button disabled={busy} onClick={saveProfile}>
            {busy ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
        </>
      ) : tab === "preferences" ? (
        <>
          <h2>Nyaman dengan caramu.</h2>
          <p className="muted">Tetap fokus pada orang dan percakapannya.</p>
          <div className="setting-row">
            <div>
              <h3>Tampilan</h3>
              <p>Light dan dark memakai struktur yang sama.</p>
            </div>
            <select
              className="native-select max-w-36"
              aria-label="Tema"
              value={v.preferences.theme}
              onChange={(e) =>
                prefs({ theme: e.target.value as Preferences["theme"] })
              }
            >
              <option value="system">Ikuti sistem</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="setting-row">
            <div>
              <h3>Kurangi gerakan</h3>
              <p>
                Hilangkan transisi tambahan. Preferensi sistem tetap dihormati.
              </p>
            </div>
            <Switch
              aria-label="Kurangi gerakan"
              checked={v.preferences.motion === "reduce"}
              onCheckedChange={(checked) =>
                prefs({ motion: checked ? "reduce" : "system" })
              }
            />
          </div>
          <div className="setting-row">
            <div>
              <h3>Sound</h3>
              <p>Nonaktif. Audio belum tersedia dalam demo frontend.</p>
            </div>
            <Switch
              aria-label="Sound belum tersedia"
              disabled
              checked={false}
            />
          </div>
          <div className="setting-row">
            <div>
              <h3>Pengingat Arena</h3>
              <p>
                Simpan preferensi pengingat untuk integrasi notifikasi
                berikutnya. Demo tidak mengirim push atau email.
              </p>
            </div>
            <Switch
              aria-label="Pengingat Arena"
              checked={v.preferences.reminders}
              onCheckedChange={(reminders) => prefs({ reminders })}
            />
          </div>
        </>
      ) : tab === "privacy" ? (
        <>
          <h2>Hadir dengan nyaman.</h2>
          <p className="muted">
            Kamu mengontrol apa yang dibagikan sebagai identitas pribadi.
          </p>
          <div className="setting-row">
            <div>
              <h3>Tampilkan presence</h3>
              <p>
                Preferensi untuk aktivitas online ketika layanan presence
                diaktifkan. Demo tidak menampilkan status online yang
                dibuat-buat.
              </p>
            </div>
            <Switch
              aria-label="Tampilkan presence"
              checked={v.preferences.presence}
              onCheckedChange={(presence) => prefs({ presence })}
            />
          </div>
          <div className="setting-row">
            <div>
              <h3>Pilihan dan chat privat</h3>
              <p>
                Pilihan individu dan chat Squad tidak diterbitkan dalam replay
                publik.
              </p>
            </div>
            <LockKeyhole size={17} className="muted" />
          </div>
          <div className="setting-row">
            <div>
              <h3>Data sesi demo</h3>
              <p>
                Data sementara tersimpan di memori server. Keluar menghapus
                sesi; memulai ulang server juga menghapusnya. Replay yang sudah
                dibagikan tidak memuat identitas pribadi.
              </p>
            </div>
            <ShieldCheck size={18} className="muted" />
          </div>
          <Button
            className="mt-6"
            variant="outline"
            onClick={async () => {
              await post("auth/logout");
              qc.clear();
              router.push("/");
              router.refresh();
            }}
          >
            Hapus sesi demo dan keluar
          </Button>
        </>
      ) : (
        <>
          <h2>Detail ketika kamu membutuhkannya.</h2>
          <p className="muted">
            Teknologi mendukung pengalaman, tanpa mengambil alih percakapan.
          </p>
          <div className="panel">
            <div className="metric-row">
              <span>Mode</span>
              <strong>Frontend demo</strong>
            </div>
            <div className="metric-row">
              <span>Google Auth</span>
              <strong>Belum terhubung</strong>
            </div>
            <div className="metric-row">
              <span>Embedded wallet</span>
              <strong>Belum diprovisikan</strong>
            </div>
            <div className="metric-row">
              <span>Monad / proofs</span>
              <strong>Simulasi</strong>
            </div>
            <div className="metric-row">
              <span>Ranked eligibility</span>
              <strong>Belum diverifikasi</strong>
            </div>
            <p className="form-note muted">
              Google Auth bukan bukti manusia unik. Verifikasi eligibility dan
              proteksi sybil harus selesai sebelum membuka kompetisi ranked
              live.
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-base mb-3">Kontrol eksplorasi demo</h3>
            <p className="muted text-xs leading-7 mb-5">
              Gunakan ini untuk meninjau state produk. Tidak mengubah izin pada
              sistem live.
            </p>
            <div className="field">
              <label htmlFor="demo-role">Peran dalam demo</label>
              <select
                id="demo-role"
                className="native-select"
                value={v.role}
                onChange={async (e) => {
                  try {
                    const updated = await post<Viewer>("demo/role", {
                      role: e.target.value,
                    });
                    qc.setQueryData(["session"], updated);
                    await qc.invalidateQueries({ queryKey: ["match"] });
                    toast.success("Peran demo diubah.");
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                }}
              >
                <option value="member">Human / member</option>
                <option value="representative">Squad representative</option>
                <option value="operator">Operator demo</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="demo-scenario">
                Skenario pertandingan berikutnya
              </label>
              <select
                id="demo-scenario"
                className="native-select"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as Scenario)}
              >
                <option value="normal">Outcome normal</option>
                <option value="negative">Wisdom Lift negatif</option>
                <option value="draw">Draw</option>
                <option value="void">Satu ronde void</option>
                <option value="no_contest">No contest</option>
                <option value="forfeit">Forfeit</option>
              </select>
              <small>
                Reset menghapus pilihan dan progres pertandingan pada sesi demo
                ini.
              </small>
            </div>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await post("matches/current/reset", { scenario });
                  await qc.invalidateQueries({ queryKey: ["match"] });
                  await qc.invalidateQueries({ queryKey: ["home"] });
                  toast.success(
                    "Pertandingan direset. Kembali ke Lobby untuk mulai.",
                  );
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <RotateCcw size={14} />
              Reset pertandingan demo
            </Button>
            <div className="flex flex-wrap gap-5 mt-6">
              <Link className="text-link" href="/arena/founding-001/lobby">
                Buka Lobby
                <ArrowRight size={14} />
              </Link>
              {v.role === "operator" && (
                <Link className="text-link" href="/operator/events">
                  Buka operator
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
export function ProofPage({ id }: { id: string }) {
  const q = useQuery({
    queryKey: ["proof", id],
    queryFn: () =>
      api<{
        mode: string;
        ruleVersion: string;
        source: string;
        network: string;
        metric: string;
        formula: string;
        roster: string;
        precision: string;
        snapshots: {
          game: string;
          start: number;
          end: number;
          growth: string;
        }[];
      }>(`proof/${id}`),
  });
  if (q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  const data = q.data;
  return (
    <>
      <PageTitle
        eyebrow="TRANSPARENCY, IN PLAIN SIGHT"
        title="Dari data menjadi hasil."
        description="Aturan, batasan, dan sumber yang membuat sebuah hasil dapat ditinjau."
        action={
          <Button
            variant="outline"
            onClick={() => {
              const file = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                }),
                url = URL.createObjectURL(file),
                a = document.createElement("a");
              a.href = url;
              a.download = `hive-demo-proof-${id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download size={15} />
            Ekspor data publik
          </Button>
        }
      />
      <p className="status-message">
        Dokumen ini menjelaskan simulasi. Tidak ada transaksi Monad, hash
        commitment live, atau bukti onchain yang diklaim telah terverifikasi.
      </p>
      <dl className="proof-grid">
        {[
          ["VERSI ATURAN", data.ruleVersion],
          ["SUMBER", data.source],
          ["NETWORK", data.network],
          ["METRIK", data.metric],
          ["SKOR RONDE", data.formula],
          ["ROSTER", data.roster],
          ["PRESISI", data.precision],
          ["STATUS", "Demo · tidak menambah reputasi ranked"],
        ].map(([name, value]) => (
          <div className="proof-row" key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-10 mb-6 text-xl">Snapshot contoh ronde 1</h2>
      <div className="table-scroll">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>GAME</th>
              <th>AWAL</th>
              <th>AKHIR</th>
              <th>PERUBAHAN RELATIF</th>
            </tr>
          </thead>
          <tbody>
            {data.snapshots.map((s) => (
              <tr key={s.game}>
                <td>{s.game}</td>
                <td>{s.start.toLocaleString("id-ID")}</td>
                <td>{s.end.toLocaleString("id-ID")}</td>
                <td>{s.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="demo-note">
        Snapshot ini hanya mendukung contoh historis founding-001 ronde 1.
        Skenario demo lain menggunakan outcome sintetis.
      </p>
      <div className="mt-8">
        <Link className="text-link" href="/replays/founding-001">
          Baca cerita pertandingannya
          <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}
type Report = { id: string; target: string; reason: string; hidden: boolean };
export function OperatorPage({ moderation = false }: { moderation?: boolean }) {
  const { data: v } = useSession();
  return (
    <AuthGate>
      {v?.role !== "operator" ? (
        <Empty
          title="Ruang ini khusus operator."
          description="Peranmu belum memiliki akses. Dalam demo, peran eksplorasi dapat dipilih melalui Advanced settings."
          href="/settings/advanced"
          label="Buka Advanced"
        />
      ) : (
        <OperatorTools moderation={moderation} />
      )}
    </AuthGate>
  );
}
function OperatorTools({ moderation }: { moderation: boolean }) {
  const qc = useQueryClient(),
    [title, setTitle] = useState(""),
    [date, setDate] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    q = useQuery({
      queryKey: ["operator", moderation],
      queryFn: () =>
        api<
          | {
              events: { id: string; title: string; date: string }[];
              match: MatchView;
            }
          | Report[]
        >(moderation ? "operator/reports" : "operator/events"),
    });
  return (
    <>
      <PageTitle
        eyebrow="INTERNAL · DEMO ONLY"
        title={
          moderation ? "Jaga percakapannya." : "Siapkan ruang pertandingan."
        }
        description="Kontrol operator untuk meninjau alur demo. Izin tetap diperiksa oleh server."
        action={
          <Button variant="outline" asChild>
            <Link
              href={moderation ? "/operator/events" : "/operator/moderation"}
            >
              {moderation ? "Events" : "Moderasi"}
              <ArrowRight size={14} />
            </Link>
          </Button>
        }
      />
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : moderation ? (
        !(q.data as Report[]).length ? (
          <Empty
            title="Belum ada laporan."
            description="Laporan argumen dari Council akan muncul di sini untuk ditinjau."
            href="/arena"
            label="Buka Arena"
          />
        ) : (
          <div className="stack">
            {(q.data as Report[]).map((r) => (
              <article className="panel" key={r.id}>
                <h3 className="mb-3">{r.target}</h3>
                <p className="muted text-sm mb-4">{r.reason}</p>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await post(`operator/reports/${r.id}`, {
                        hidden: !r.hidden,
                      });
                      await qc.invalidateQueries({ queryKey: ["operator"] });
                      await qc.invalidateQueries({ queryKey: ["match"] });
                    } catch (e) {
                      toast.error((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {r.hidden ? "Pulihkan argumen" : "Sembunyikan argumen"}
                </Button>
              </article>
            ))}
          </div>
        )
      ) : (
        <div className="operator-grid">
          <section className="panel">
            <h2>Draft event</h2>
            <div className="field">
              <label htmlFor="event-title">Nama event</label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="field">
              <label htmlFor="event-date">Tanggal dan jam lokal</label>
              <Input
                id="event-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <p className="form-note muted mb-5">
              Tersimpan sebagai draft demo. Tidak menerbitkan undangan atau
              membuka pertandingan live.
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button
              disabled={!title.trim() || !date || busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await post("operator/events", { title, date });
                  await qc.invalidateQueries({ queryKey: ["operator"] });
                  setTitle("");
                  setDate("");
                  toast.success("Draft event tersimpan.");
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Simpan draft
            </Button>
          </section>
          <section className="panel">
            <h2>Event dalam sesi ini</h2>
            {(
              q.data as {
                events: { id: string; title: string; date: string }[];
              }
            ).events.length ? (
              (
                q.data as {
                  events: { id: string; title: string; date: string }[];
                }
              ).events.map((e) => (
                <div className="setting-row" key={e.id}>
                  <div>
                    <h3>{e.title}</h3>
                    <p>{new Date(e.date).toLocaleString("id-ID")}</p>
                  </div>
                  <span className="text-xs muted">Draft</span>
                </div>
              ))
            ) : (
              <p className="muted text-sm">
                Belum ada draft event. Founding match tersedia sebagai fixture
                demo.
              </p>
            )}
            <Link className="text-link mt-7" href="/arena/founding-001/lobby">
              Tinjau roster Founding match
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      )}
    </>
  );
}
