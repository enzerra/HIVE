"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarGroup, Crest, Sigil } from "@/components/identity";
import { AuthGate, Empty, ErrorPanel, Loading } from "@/components/shared";
import { useSession } from "@/lib/client/session";
import { api, post } from "@/lib/client/api";
import { safeReturn } from "@/domain/rules";
import { hives, hiveById, squadById } from "@/domain/community";
import type { Viewer, Squad } from "@/domain/types";
export function SignInPage() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    router = useRouter(),
    params = useSearchParams(),
    qc = useQueryClient(),
    { data: v } = useSession();
  const target = safeReturn(params.get("returnTo"));
  async function enter() {
    setBusy(true);
    setError("");
    try {
      const viewer = await post<Viewer>("demo/session");
      qc.setQueryData(["session"], viewer);
      router.push(
        viewer.onboarded
          ? target
          : `/onboarding/identity?returnTo=${encodeURIComponent(target)}`,
      );
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <div className="auth-story">
        <Sigil size={64} />
        <h1>
          Good people.
          <br />
          Different perspectives.
        </h1>
        <p>
          Tempat untuk menemukan teman, membentuk Squad, dan melihat seberapa
          jauh pikiran terbuka bisa membawa kalian.
        </p>
        <AvatarGroup count={4} size={40} />
      </div>
      <section className="auth-form">
        <h2>{v ? `Hai lagi, ${v.handle}.` : "Temukan orang-orangmu."}</h2>
        <p>
          {v
            ? "Ruang demo-mu masih di sini."
            : "Satu identitas. Banyak percakapan baru."}
        </p>
        {v ? (
          <Button asChild>
            <Link href={v.onboarded ? target : "/onboarding/identity"}>
              Lanjutkan ke HIVE <ArrowRight size={16} />
            </Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" disabled>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  d="M21 12.2c0-.7-.1-1.4-.2-2.2H12v4h5a4.8 4.8 0 0 1-5 4 6 6 0 1 1 4-10.5L19 4a10 10 0 1 0 3 8Z"
                  fill="currentColor"
                />
              </svg>
              Lanjutkan dengan Google
            </Button>
            <p className="form-note">
              Google Auth tersedia setelah integrasi live dikonfigurasi.
            </p>
            <div className="auth-divider">JELAJAHI PENGALAMANNYA</div>
            <Button disabled={busy} onClick={enter}>
              {busy ? "Menyiapkan ruangmu…" : "Coba alur masuk (demo)"}
              <ArrowRight size={15} />
            </Button>
          </>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <p className="form-note">
          Demo menggunakan identitas ilustratif dan sesi sementara. Tidak ada
          login Google, taruhan, atau transaksi uang.
        </p>
        <Link href="/explore" className="text-link mt-6 subtle">
          Jelajahi tanpa akun <ArrowUpRightSmall />
        </Link>
      </section>
    </div>
  );
}
function ArrowUpRightSmall() {
  return <ChevronRight size={14} />;
}
export function OnboardingPage({ step }: { step: string }) {
  const { data: v } = useSession();
  return (
    <AuthGate>
      {v && <OnboardingForm key={`${step}-${v.id}`} step={step} viewer={v} />}
    </AuthGate>
  );
}
function OnboardingForm({ step, viewer: v }: { step: string; viewer: Viewer }) {
  const index = Math.max(
      0,
      ["identity", "squad", "hive", "ready"].indexOf(step),
    ),
    [handle, setHandle] = useState(v.handle),
    [avatar, setAvatar] = useState(v.avatar),
    [selection, setSelection] = useState(
      v.deferred
        ? "defer"
        : v.squadId === "new-squad"
          ? "create"
          : (v.squadId ?? "aster"),
    ),
    [hive, setHive] = useState(v.hiveId ?? "purple"),
    [name, setName] = useState(v.squadName ?? ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    router = useRouter(),
    qc = useQueryClient(),
    params = useSearchParams();
  const target = safeReturn(params.get("returnTo")),
    next = (s: string) =>
      `/onboarding/${s}?returnTo=${encodeURIComponent(target)}`;
  async function save() {
    setBusy(true);
    setError("");
    try {
      let updated: Viewer;
      if (index === 0) {
        if (!/^[A-Za-z0-9_]{3,24}$/.test(handle)) {
          setError("Gunakan 3–24 huruf, angka, atau underscore.");
          return;
        }
        updated = await post("onboarding/identity", { handle, avatar });
      } else if (index === 1) {
        if (selection === "create" && name.trim().length < 3) {
          setError("Beri nama Squad minimal 3 karakter.");
          return;
        }
        updated = await post("onboarding/squad", {
          action:
            selection === "defer"
              ? "defer"
              : selection === "create"
                ? "create"
                : "join",
          squadId: selection,
          name,
        });
      } else if (index === 2) {
        updated = await post("onboarding/hive", { hiveId: hive });
      } else {
        updated = await post("onboarding/complete");
      }
      qc.setQueryData(["session"], updated);
      await qc.invalidateQueries({ queryKey: ["home"] });
      router.push(
        index < 3
          ? next(["identity", "squad", "hive", "ready"][index + 1])
          : target,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const squad = squadById(v.squadId ?? ""),
    affiliation = hiveById(v.hiveId ?? "");
  return (
    <div className="onboarding">
      <div
        className="onboarding-progress"
        aria-label={`Langkah ${index + 1} dari 4`}
      >
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className={n <= index ? "done" : ""} />
        ))}
      </div>
      <p className="eyebrow muted">YOUR NEXT CHAPTER · {index + 1} / 4</p>
      <h1>
        {
          [
            "Mulai dari dirimu.",
            "Temukan lingkaranmu.",
            "Satu Squad. Satu Hive.",
            "Ini tempatmu sekarang.",
          ][index]
        }
      </h1>
      <p className="muted">
        {
          [
            "Nama yang akan dikenal teman-temanmu. Wajah yang mewakili dirimu.",
            "Bergabung bersama teman, atau temukan orang baru. Squad berisi 3–5 Human.",
            "Di Arena, kamu membawa perspektif Squad sebagai bagian dari komunitas yang lebih besar.",
            "Kenali hierarkinya. Setiap suara berawal dari seorang Human.",
          ][index]
        }
      </p>
      {index === 0 ? (
        <>
          <label className="text-xs block mb-3">Pilih PFP</label>
          <div className="avatar-picker">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                aria-label={`Pilih avatar ${i + 1}`}
                aria-pressed={avatar === i}
                onClick={() => setAvatar(i)}
              >
                <Avatar index={i} size={46} />
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="handle">Nama di HIVE</label>
            <Input
              id="handle"
              autoComplete="nickname"
              maxLength={24}
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              aria-describedby="handle-hint"
            />
            <small id="handle-hint">
              3–24 huruf, angka, atau underscore. Tidak perlu nama asli.
            </small>
          </div>
        </>
      ) : index === 1 ? (
        <>
          <div className="selection-list">
            {[
              {
                id: "aster",
                name: "Bergabung dengan Aster",
                desc: "Purple · 4 Human dalam roster demo",
                icon: <Crest />,
              },
              {
                id: "night-shift",
                name: "Kenali Night Shift",
                desc: "Afterhours · Squad sedang terbentuk",
                icon: <Crest symbol={7} />,
              },
              {
                id: "create",
                name: "Buat Squad sendiri",
                desc: "Mulai lingkaran baru. Undang teman nanti.",
                icon: <Plus size={25} />,
              },
              {
                id: "defer",
                name: "Jelajahi dulu",
                desc: "Kenali komunitas sebelum memilih Squad.",
                icon: <Users size={25} />,
              },
            ].map((o) => (
              <button
                key={o.id}
                className="selection-option"
                aria-pressed={selection === o.id}
                onClick={() => setSelection(o.id)}
              >
                {o.icon}
                <div>
                  <strong>{o.name}</strong>
                  <p>{o.desc}</p>
                </div>
                {selection === o.id && <Check size={17} />}
              </button>
            ))}
          </div>
          {selection === "create" && (
            <div className="field">
              <label htmlFor="squad-name">Nama Squad</label>
              <Input
                id="squad-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
              />
            </div>
          )}
        </>
      ) : index === 2 ? (
        v.deferred ? (
          <div className="panel">
            <h3>Tidak perlu terburu-buru.</h3>
            <p className="muted text-sm mt-3">
              Kamu bisa menjelajahi Hive dan replay sebelum memilih afiliasi.
            </p>
          </div>
        ) : v.squadId === "new-squad" ? (
          <div className="selection-list">
            {hives.map((h) => (
              <button
                key={h.id}
                className="selection-option"
                aria-pressed={hive === h.id}
                onClick={() => setHive(h.id)}
              >
                <Sigil symbol={h.symbol} color={h.color} />
                <div>
                  <strong>{h.name}</strong>
                  <p>{h.tagline}</p>
                </div>
                {hive === h.id && <Check size={16} />}
              </button>
            ))}
          </div>
        ) : (
          <div className="panel">
            <div className="member-row">
              <Crest symbol={squad?.symbol} />
              <div>
                <strong>{squad?.name}</strong>
                <small>Squad-mu</small>
              </div>
              <ArrowRight className="ml-auto" size={17} />
              <Sigil symbol={affiliation?.symbol} color={affiliation?.color} />
              <strong className="text-sm">{affiliation?.name}</strong>
            </div>
            <p className="form-note muted">
              Afiliasi mengikuti Squad. Bergabung dengan Hive lain tidak
              mengubah roster kompetisi yang sudah terkunci.
            </p>
          </div>
        )
      ) : (
        <>
          <div className="selection-list">
            <div className="selection-option">
              <Avatar index={v.avatar} size={45} />
              <div>
                <strong>{v.handle}</strong>
                <p>Human · perspektifmu</p>
              </div>
              <Check size={16} />
            </div>
            <div className="selection-option">
              <Crest symbol={squad?.symbol} />
              <div>
                <strong>
                  {v.deferred
                    ? "Belum memilih Squad"
                    : (squad?.name ?? v.squadName ?? "Squad barumu")}
                </strong>
                <p>
                  {v.deferred
                    ? "Bisa dipilih setelah menjelajah"
                    : "Lingkaran terdekatmu"}
                </p>
              </div>
            </div>
            <div className="selection-option">
              <Sigil symbol={affiliation?.symbol} color={affiliation?.color} />
              <div>
                <strong>{affiliation?.name ?? "Hive menunggumu"}</strong>
                <p>{affiliation?.tagline ?? "Temukan komunitas yang sesuai"}</p>
              </div>
            </div>
          </div>
          <p className="status-message">
            {v.squadId === "aster"
              ? "Siap mencoba Arena demo. Eligibility ranked live belum diverifikasi."
              : v.deferred
                ? "Jelajahi dulu. Arena dapat diikuti setelah Squad dan roster memenuhi syarat."
                : "Squad masih terbentuk. Kenali komunitas sambil menyiapkan anggota berikutnya."}
          </p>
        </>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        {index > 0 ? (
          <Button variant="ghost" asChild>
            <Link
              href={next(["identity", "squad", "hive", "ready"][index - 1])}
            >
              <ArrowLeft size={15} />
              Kembali
            </Link>
          </Button>
        ) : (
          <span />
        )}
        <Button disabled={busy} onClick={save}>
          {busy ? "Menyimpan…" : index === 3 ? "Masuk ke Home" : "Lanjutkan"}
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}
export function InvitePage({ token }: { token: string }) {
  const q = useQuery({
      queryKey: ["invite", token],
      queryFn: () => api<{ squad: Squad; status: string }>(`invites/${token}`),
    }),
    { data: v } = useSession(),
    router = useRouter(),
    qc = useQueryClient(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  if (q.data.status !== "valid")
    return (
      <Empty
        title={
          q.data.status === "full"
            ? "Squad ini sudah penuh."
            : "Undangan ini sudah berakhir."
        }
        description="Masih ada lingkaran lain yang bisa kamu temukan. Pilih Squad lain atau mulai Squad sendiri."
        href="/explore"
        label="Jelajahi komunitas"
      />
    );
  return (
    <div className="onboarding text-center">
      <div className="flex justify-center mb-6">
        <Crest size={75} />
      </div>
      <p className="eyebrow justify-center muted">YOU HAVE A PLACE HERE</p>
      <h1>Aster mengundangmu.</h1>
      <p className="muted">
        Satu tempat di lingkaran Purple. Bergabung ke roster ilustratif untuk
        mencoba HIVE bersama.
      </p>
      <div className="flex justify-center my-8">
        <AvatarGroup size={43} />
      </div>
      <p className="form-note muted mb-6">
        Undangan demo menggantikan kursi Human ilustratif. Tidak menambah
        anggota kelima secara diam-diam.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {v ? (
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const updated = await post<Viewer>("onboarding/squad", {
                action: "join",
                squadId: "aster",
              });
              qc.setQueryData(["session"], updated);
              router.push("/onboarding/hive");
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Terima undangan demo <ArrowRight size={15} />
        </Button>
      ) : (
        <Button asChild>
          <Link href={`/sign-in?returnTo=/invite/${token}`}>
            Masuk untuk bergabung <ArrowRight size={15} />
          </Link>
        </Button>
      )}
    </div>
  );
}
