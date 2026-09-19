"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Search,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarGroup, Crest, Sigil } from "@/components/identity";
import {
  ArenaCard,
  AuthGate,
  DemoNote,
  Empty,
  ErrorPanel,
  Loading,
  PageTitle,
  SectionTitle,
} from "@/components/shared";
import { useSession } from "@/lib/client/session";
import { api, post } from "@/lib/client/api";
import { hives, squads, hiveById, squadById } from "@/domain/community";
import type { Hive } from "@/domain/types";
import type { OpenCall } from "@/domain/types";
import { HomeWorld } from "@/components/home-world";

function Activity() {
  return (
    <>
      <article className="feed-item">
        <Avatar index={1} size={36} />
        <div>
          <p>
            <Link href="/humans/Raka">
              <strong>Raka</strong>
            </Link>{" "}
            membuka percakapan di{" "}
            <Link href="/squads/aster">
              <strong>Aster</strong>
            </Link>
            .
          </p>
          <p className="muted">
            “Yang menarik bukan cuma pilihan kita, tapi alasan di baliknya.”
          </p>
        </div>
        <time>Contoh</time>
      </article>
      <article className="feed-item">
        <Sigil size={36} />
        <div>
          <p>
            <strong>Purple</strong> punya cerita dari Arena.
          </p>
          <Link className="feed-preview" href="/replays/founding-001">
            <div>
              <strong>Purple vs Chog · Founding match</strong>
              <p>Dari 55% ke 70%. Apa yang mengubah keyakinan mereka?</p>
            </div>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </article>
      <article className="feed-item">
        <Avatar index={2} size={36} />
        <div>
          <p>
            <Link href="/humans/Mika">
              <strong>Mika</strong>
            </Link>{" "}
            bergabung dengan <strong>Aster</strong>.
          </p>
          <p className="muted">Satu perspektif baru untuk dibawa ke Arena.</p>
        </div>
        <time>Contoh</time>
      </article>
    </>
  );
}
export function HomePage() {
  const { data: v } = useSession();
  const home = useQuery({
    queryKey: ["home"],
    queryFn: () =>
      api<{ started: boolean; settled: boolean; finishedPlaying: boolean }>(
        "home",
      ),
    enabled: !!v,
    staleTime: 0,
  });
  const calls = useQuery({
    queryKey: ["calls"],
    queryFn: () => api<OpenCall[]>("calls"),
    enabled: !!v?.onboarded,
    staleTime: 0,
  });
  return (
    <AuthGate>
      {v && (
        <HomeWorld
          viewer={v}
          match={home.data ?? null}
          call={calls.data?.[0] ?? null}
          loading={home.isPending || (v.onboarded && calls.isPending)}
          degraded={!!home.error || !!calls.error}
          retry={() => {
            void home.refetch();
            if (v.onboarded) void calls.refetch();
          }}
        />
      )}
    </AuthGate>
  );
}
export function ExplorePage() {
  const params = useSearchParams(),
    router = useRouter();
  const term = params.get("q") ?? "",
    filter = params.get("filter") ?? "all";
  const q = useQuery({
    queryKey: ["hives"],
    queryFn: () => api<Hive[]>("hives"),
  });
  function change(key: string, value: string) {
    const p = new URLSearchParams(params);
    if (value && value !== "all") p.set(key, value);
    else p.delete(key);
    router.replace(`/explore?${p}`, { scroll: false });
  }
  const list = q.data?.filter(
    (h) =>
      (filter !== "new" || h.tags.includes("Komunitas baru")) &&
      `${h.name} ${h.tagline} ${h.tags.join(" ")}`
        .toLowerCase()
        .includes(term.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        scene="hive"
        eyebrow="FIND YOUR FREQUENCY"
        title="Orang yang tepat. Perspektif baru."
        description="Cari komunitas yang terasa seperti tempatmu. Tidak harus berpikir sama."
      />
      <div className="filter-bar">
        <div className="filter-tabs" aria-label="Filter komunitas">
          <button
            aria-pressed={filter === "all"}
            onClick={() => change("filter", "all")}
          >
            Semua Hive
          </button>
          <button
            aria-pressed={filter === "new"}
            onClick={() => change("filter", "new")}
          >
            Komunitas baru
          </button>
        </div>
        <div className="search-box">
          <Search size={16} />
          <Input
            aria-label="Cari Hive atau minat"
            placeholder="Cari Hive atau minat…"
            value={term}
            onChange={(e) => change("q", e.target.value)}
          />
        </div>
      </div>
      {q.isPending ? (
        <Loading />
      ) : q.error ? (
        <ErrorPanel error={q.error} retry={() => q.refetch()} />
      ) : list?.length ? (
        <div className="directory-grid">
          {list.map((h) => (
            <Link className="hive-preview" href={`/hives/${h.slug}`} key={h.id}>
              <div>
                <Sigil symbol={h.symbol} color={h.color} size={55} />
                <ArrowUpRight size={17} />
              </div>
              <h3>{h.name}</h3>
              <p>{h.tagline}</p>
              <div className="tag-list">
                {h.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="preview-bottom">
                <AvatarGroup count={3} size={25} />
                <span>
                  {h.members} anggota · {h.squads} Squad
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="Belum menemukan frekuensimu?"
          description="Coba nama atau minat lain, atau lihat semua komunitas."
          href="/explore"
          label="Hapus pencarian"
        />
      )}
      <DemoNote />
    </>
  );
}
export function HivePage({ slug }: { slug: string }) {
  const h = hiveById(slug),
    { data: v } = useSession(),
    qc = useQueryClient(),
    params = useSearchParams(),
    tab = params.get("tab") ?? "overview";
  const home = useQuery({
    queryKey: ["home"],
    queryFn: () => api<{ following: string[] }>("home"),
    enabled: !!v,
  });
  const [busy, setBusy] = useState(false);
  if (!h) return <Missing />;
  const roster = squads.filter((s) => s.hiveId === h.id),
    following = home.data?.following?.includes(h.id);
  return (
    <>
      <div className="profile-banner world-profile-banner world-hive-banner" />
      <div className="profile-header">
        <Sigil symbol={h.symbol} color={h.color} size={80} />
        <div>
          <p className="eyebrow muted mb-2">
            HIVE · {h.category.toUpperCase()}
          </p>
          <h1>{h.name}</h1>
          <p className="muted">{h.tagline}</p>
          <div className="profile-metrics">
            <span>
              <strong>{h.members}</strong> Human
            </span>
            <span>
              <strong>{h.squads}</strong> Squad
            </span>
            <span>Founding season · demo</span>
          </div>
        </div>
        <div className="profile-actions">
          {v?.hiveId === h.id ? (
            <Button asChild>
              <Link href={`/squads/${v.squadId}`}>
                Buka Squad <ArrowRight size={14} />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link
                href={
                  v
                    ? "/onboarding/squad"
                    : "/sign-in?returnTo=/onboarding/squad"
                }
              >
                Temukan Squad <ArrowRight size={14} />
              </Link>
            </Button>
          )}
          {v && (
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await post(`hives/${h.id}/follow`);
                  await qc.invalidateQueries({ queryKey: ["home"] });
                } catch (e) {
                  toast.error((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {following ? (
                <>
                  <Check size={14} />
                  Mengikuti
                </>
              ) : (
                "Ikuti Hive"
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="profile-tabs">
        {[
          ["overview", "Overview"],
          ["squads", "Squads"],
          ["matches", "Matches"],
          ["about", "Tentang"],
        ].map(([id, label]) => (
          <Link
            key={id}
            href={`/hives/${slug}?tab=${id}`}
            aria-current={tab === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="social-layout">
        <div className="social-main">
          {tab === "squads" ? (
            <>
              <SectionTitle title="Banyak lingkaran. Satu Hive." />
              <div className="roster-grid">
                {roster.map((s) => (
                  <Link
                    key={s.id}
                    href={`/squads/${s.id}`}
                    className="roster-card"
                  >
                    <Crest symbol={s.symbol} />
                    <div>
                      <h3>{s.name}</h3>
                      <p>
                        {s.members.length} Human ·{" "}
                        {s.forming ? "Sedang terbentuk" : "Founding roster"}
                      </p>
                    </div>
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
              {!roster.length && (
                <Empty
                  title="Lingkaran pertama masih terbentuk."
                  description="Jadilah bagian dari cerita awal komunitas ini."
                  href="/onboarding/squad"
                  label="Mulai dengan Squad"
                />
              )}
            </>
          ) : tab === "about" ? (
            <>
              <SectionTitle title="Tentang komunitas ini" />
              <p className="muted text-sm leading-8">{h.description}</p>
              <div className="panel mt-7">
                <h3 className="mb-4">Cara kita bersama</h3>
                <p className="muted text-sm leading-8">
                  Hargai orang di balik perspektif. Tanyakan alasan, bagikan
                  bukti, dan beri ruang untuk berubah pikiran. Hindari serangan
                  personal, spam, dan koordinasi pilihan di luar ruang yang
                  diizinkan.
                </p>
              </div>
            </>
          ) : tab === "matches" ? (
            h.id === "purple" || h.id === "chog" ? (
              <>
                <ArenaCard />
                <SectionTitle title="Cerita sebelumnya" />
                <Link className="roster-card" href="/replays/founding-001">
                  <Clock size={19} />
                  <div>
                    <h3>Purple vs Chog</h3>
                    <p>3 ronde · hasil demo tersedia</p>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <Empty
                title="Arena pertamanya masih di depan."
                description="Kenali anggota dan bentuk Squad. Komunitas yang baik dimulai dari percakapan."
                href={`/hives/${slug}?tab=squads`}
                label="Kenali Squad"
              />
            )
          ) : (
            <>
              {h.id === "purple" || h.id === "chog" ? (
                <ArenaCard />
              ) : (
                <div className="panel mb-8">
                  <h2>Komunitas kecil. Kemungkinan besar.</h2>
                  <p className="muted text-sm mt-4 leading-8">
                    {h.description}
                  </p>
                  <Button asChild className="mt-5" variant="outline">
                    <Link href={`/hives/${slug}?tab=squads`}>
                      Kenali orang-orangnya <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
              )}
              <SectionTitle title="Di dalam Hive" />
              {h.id === "purple" ? (
                <Activity />
              ) : (
                <Empty
                  title="Cerita pertama belum ditulis."
                  description="Belum ada aktivitas yang dibagikan. Jelajahi Squad dan budaya komunitasnya."
                  href={`/hives/${slug}?tab=about`}
                  label="Kenali Hive"
                />
              )}
            </>
          )}
          <DemoNote />
        </div>
        <aside className="social-aside">
          <section>
            <h3>Satu komunitas, banyak perspektif.</h3>
            <p className="aside-copy">{h.description}</p>
            <div className="tag-list">
              {h.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </section>
          <section>
            <h3>Cara masuk ke Arena</h3>
            <p className="aside-copy">
              Human bergabung dalam Squad berisi 3–5 orang. Di Arena, setiap
              Squad punya bobot yang sama untuk mewakili Hivenya.
            </p>
            <Link
              className="text-link aside-action"
              href="/replays/founding-001"
            >
              Lihat contohnya
              <ArrowRight size={14} />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
export function SquadPage({ id }: { id: string }) {
  const { data: v } = useSession(),
    s = squadById(id),
    [copied, setCopied] = useState(false);
  if (!s && id !== "new-squad") return <Missing />;
  const squad = s ?? {
      id,
      name: v?.squadName ?? "Squad baru",
      symbol: 0,
      hiveId: v?.hiveId ?? "purple",
      members: [v?.handle ?? "Kamu"],
      forming: true,
    },
    h = hiveById(squad.hiveId),
    own = v?.squadId === id;
  return (
    <>
      <div className="profile-banner world-profile-banner world-squad-banner" />
      <div className="profile-header">
        <Crest symbol={squad.symbol} size={74} />
        <div>
          <p className="eyebrow muted mb-2">
            SQUAD · <Link href={`/hives/${h?.slug}`}>{h?.name}</Link>
          </p>
          <h1>{squad.name}</h1>
          <p className="muted">
            {squad.forming
              ? "Lingkaran yang sedang terbentuk."
              : "Perspektif berbeda. Satu meja yang sama."}
          </p>
        </div>
        <div className="profile-actions">
          {own && id === "aster" ? (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${location.origin}/invite/aster-founding`,
                  );
                  setCopied(true);
                  toast.success("Tautan undangan demo disalin.");
                } catch {
                  toast.error(
                    "Buka halaman undangan untuk menyalin tautannya.",
                  );
                }
              }}
            >
              <Copy size={14} />
              {copied ? "Tautan disalin" : "Bagikan undangan"}
            </Button>
          ) : (
            <Button asChild>
              <Link href="/onboarding/squad">
                Temukan Squad <ArrowRight size={14} />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="social-layout">
        <div>
          <SectionTitle title="Orang-orang di lingkaran ini" />
          <div className="roster-grid">
            {squad.members.map((name, i) => {
              const handle = own && i === 0 ? v?.handle : name;
              return (
                <Link
                  key={name}
                  className="roster-card"
                  href={`/humans/${encodeURIComponent(handle ?? name)}`}
                >
                  <Avatar index={i} size={43} />
                  <div>
                    <h3>
                      {handle}
                      {own && i === 0 ? " · kamu" : ""}
                    </h3>
                    <p>
                      {i === 1
                        ? "Representative · satu suara"
                        : "Human · satu suara"}
                    </p>
                  </div>
                  <ArrowUpRight size={14} />
                </Link>
              );
            })}
          </div>
          {squad.forming ? (
            <div className="status-message">
              Squad belum masuk roster kompetisi. Minimum 3 Human dan verifikasi
              eligibility diperlukan sebelum Arena live.
            </div>
          ) : (
            <div className="mt-9">
              <ArenaCard />
            </div>
          )}
          <SectionTitle title="Reputasi dibangun, bukan diberikan." />
          <div className="panel">
            {[
              ["Accuracy", "Ketepatan final belief pada ronde sah."],
              ["Wisdom Lift", "Perubahan jarak ke outcome setelah diskusi."],
              [
                "Influence Reach",
                "Revisi yang secara eksplisit mengatribusikan argumen.",
              ],
              [
                "Influence Quality",
                "Dampak atribusi setelah outcome tersedia.",
              ],
            ].map(([name, desc]) => (
              <div className="setting-row" key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </div>
                <span className="muted text-xs">N/A</span>
              </div>
            ))}
            <p className="form-note muted">
              Provisional · 0 ronde ranked live. Replay demo tidak menambah
              reputasi. Jendela maksimal 20 ronde eligible.
            </p>
          </div>
          <DemoNote />
        </div>
        <aside className="social-aside">
          <section>
            <h3>Bagian dari {h?.name}</h3>
            <p className="aside-copy">{h?.tagline}</p>
            <Link className="text-link aside-action" href={`/hives/${h?.slug}`}>
              Buka Hive
              <ArrowRight size={14} />
            </Link>
          </section>
          <section>
            <h3>Setara di dalam Squad</h3>
            <p className="aside-copy">
              Representative merangkum argumen. Peran ini tidak memberi bobot
              suara tambahan. Roster dibekukan saat pertandingan dimulai.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
export function HumanPage({ handle }: { handle: string }) {
  const { data: v } = useSession();
  const own = v?.handle.toLowerCase() === handle.toLowerCase(),
    known = ["Nara", "Raka", "Mika", "Juno", "Luna", "Kio"].findIndex(
      (n) => n.toLowerCase() === handle.toLowerCase(),
    );
  if (!own && known < 0 && !squads.some((s) => s.members.includes(handle)))
    return <Missing />;
  const squad = own
    ? squadById(v?.squadId ?? "")
    : known < 4
      ? squadById("aster")
      : squads.find((s) => s.members.includes(handle));
  return (
    <>
      <div className="profile-header">
        <Avatar index={own ? v!.avatar : Math.max(0, known)} size={80} />
        <div>
          <p className="eyebrow muted mb-2">HUMAN</p>
          <h1>{handle}</h1>
          <p className="muted">
            {squad ? (
              <>
                <Link href={`/squads/${squad.id}`}>{squad.name}</Link> /{" "}
                <Link href={`/hives/${squad.hiveId}`}>
                  {hiveById(squad.hiveId)?.name}
                </Link>
              </>
            ) : (
              "Sedang menemukan lingkarannya."
            )}
          </p>
        </div>
        {own && (
          <div className="profile-actions">
            <Button asChild variant="outline">
              <Link href="/settings/profile">
                Edit profil <ArrowUpRight size={14} />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="social-layout">
        <div>
          <SectionTitle title="Cerita yang dibagikan" />
          <Empty
            title="Setiap cerita punya awal."
            description="Belum ada highlight pribadi yang dipublikasikan. Pilihan individu dan percakapan Squad tetap privat."
            href={own ? "/arena" : "/replays/founding-001"}
            label={own ? "Jelajahi Arena" : "Baca replay komunitas"}
          />
          <DemoNote />
        </div>
        <aside className="social-aside">
          <section>
            <h3>Satu Human. Satu perspektif.</h3>
            <p className="aside-copy">
              Identitas demo · eligibility ranked belum diverifikasi. Masuk
              dengan akun tidak otomatis membuktikan keunikan manusia.
            </p>
          </section>
          {squad && (
            <section>
              <h3>Lingkaran terdekat</h3>
              <Link className="member-row" href={`/squads/${squad.id}`}>
                <Crest symbol={squad.symbol} />
                <div>
                  <strong>{squad.name}</strong>
                  <small>{squad.members.length} Human</small>
                </div>
                <ArrowRight className="ml-auto" size={14} />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
export function RankingsPage() {
  const [entity, setEntity] = useState("Hive"),
    [format, setFormat] = useState("5"),
    [season, setSeason] = useState("demo");
  return (
    <>
      <PageTitle
        scene="wisdom"
        eyebrow="EARNED THROUGH PERSPECTIVE"
        title="Yang tumbuh bersama."
        description="Kompetisi memberi arah. Reputasi dibangun dari keputusan yang dapat dipertanggungjawabkan."
      />
      <div className="filter-bar">
        <div className="filter-tabs">
          {["Hive", "Squad", "Human"].map((t) => (
            <button
              key={t}
              aria-pressed={entity === t}
              onClick={() => setEntity(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <select
            className="native-select"
            aria-label="Season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="demo">Founding · Demo</option>
            <option value="live">Ranked live</option>
          </select>
          <select
            className="native-select"
            aria-label="Format kompetisi"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="5">5 Squad / Hive</option>
            <option value="3">3 Squad / Hive</option>
          </select>
        </div>
      </div>
      {entity === "Hive" && format === "5" && season === "demo" ? (
        <>
          <div className="table-scroll">
            <table className="ranking-table">
              <caption className="a11y-only">
                Hasil contoh Founding match, 3 ronde, format 5 Squad per Hive
              </caption>
              <thead>
                <tr>
                  <th>POSISI</th>
                  <th>HIVE</th>
                  <th>SAMPEL</th>
                  <th>SKOR MATCH</th>
                </tr>
              </thead>
              <tbody>
                {[hives[0], hives[1]].map((h, i) => (
                  <tr key={h.id}>
                    <td className="muted">0{i + 1}</td>
                    <td>
                      <Link
                        className="table-identity"
                        href={`/hives/${h.slug}`}
                      >
                        <Sigil symbol={h.symbol} color={h.color} size={40} />
                        <strong>{h.name}</strong>
                      </Link>
                    </td>
                    <td className="muted">3 ronde demo</td>
                    <td>{i === 0 ? "257,00" : "216,00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="demo-note">
            Urutan berdasarkan jumlah skor canonical pada contoh replay. Bukan
            reputasi ranked live.
          </p>
        </>
      ) : (
        <Empty
          title="Belum ada klasemen untuk pilihan ini."
          description="Peringkat muncul setelah tersedia sampel kompetisi yang memenuhi syarat. Data demo tidak digabungkan dengan reputasi live."
          href="/replays/founding-001"
          label="Lihat contoh pertandingan"
        />
      )}
      <div className="panel mt-9">
        <h3 className="mb-3">Apa yang dihitung?</h3>
        <p className="muted text-sm leading-8">
          Skor match adalah jumlah skor ronde sah. Setiap Squad memiliki bobot
          yang sama dalam belief Hive. Wisdom Lift mengukur perubahan jarak
          terhadap outcome; angka ini berbeda dari skor dan popularitas.
        </p>
      </div>
    </>
  );
}
export function Missing() {
  return (
    <Empty
      title="Ruang ini belum ditemukan."
      description="Tautannya mungkin sudah berubah atau ruang ini belum tersedia untukmu."
      href="/explore"
      label="Kembali menjelajah"
    />
  );
}
