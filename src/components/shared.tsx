"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Flag,
  Link2,
  LoaderCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { AvatarGroup, Sigil } from "./identity";
import { api } from "@/lib/client/api";
import { useSession } from "@/lib/client/session";
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function SectionTitle({
  title,
  href,
  label = "Lihat semua",
}: {
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {href && (
        <Link href={href} className="text-link">
          {label}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function Empty({
  title,
  description,
  href,
  label,
  icon,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon ?? <Users size={26} />}
      <h2>{title}</h2>
      <p>{description}</p>
      {href && (
        <Button asChild>
          <Link href={href}>
            {label ?? "Jelajahi Hive"}
            <ArrowRight size={16} />
          </Link>
        </Button>
      )}
    </div>
  );
}
export function Loading() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="animate-spin" size={22} />
      <span>Menyiapkan ruangmu…</span>
    </div>
  );
}
export function ErrorPanel({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div className="empty-state" role="alert">
      <h2>Belum berhasil dimuat</h2>
      <p>{error.message}</p>
      <Button onClick={retry} variant="outline">
        Coba lagi
      </Button>
    </div>
  );
}
export function AuthGate({ children }: { children: React.ReactNode }) {
  const q = useSession();
  if (q.isPending) return <Loading />;
  if (q.error) return <ErrorPanel error={q.error} retry={() => q.refetch()} />;
  if (!q.data)
    return (
      <Empty
        title="Ruangmu menunggu."
        description="Bentuk identitasmu untuk terhubung dengan Squad dan komunitas."
        href="/sign-in"
        label="Mulai bergabung"
      />
    );
  return <>{children}</>;
}
export function MatchPair({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`match-pair ${compact ? "compact" : ""}`}>
      <div>
        <Sigil size={compact ? 44 : 64} />
        <strong>Purple</strong>
      </div>
      <span className="versus">vs</span>
      <div>
        <Sigil symbol={1} color="green" size={compact ? 44 : 64} />
        <strong>Chog</strong>
      </div>
    </div>
  );
}
export function ArenaCard() {
  return (
    <div className="arena-feature">
      <div>
        <p className="eyebrow">
          <span className="status-dot" />
          THE FOUNDING MATCH <span className="demo-tag">DEMO</span>
        </p>
        <h2>
          Dua Hive.
          <br />
          Banyak sudut pandang.
        </h2>
        <p className="muted">
          Game mana yang akan tumbuh lebih cepat?
          <br className="desktop-only" /> Bawa keyakinanmu. Dengarkan yang lain.
        </p>
        <Button asChild>
          <Link href="/arena/founding-001">
            Masuk Lobby <ArrowRight size={16} />
          </Link>
        </Button>
        <div className="small-social">
          <AvatarGroup />
          <span>10 Squad · 3 ronde · tanpa taruhan</span>
        </div>
      </div>
      <MatchPair />
    </div>
  );
}
export function ShareDialog({
  id = "founding-001",
  title = "Satu pertandingan. Banyak perspektif.",
}: {
  id?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpRight size={16} />
          Bagikan replay
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bagikan ceritanya.</DialogTitle>
          <DialogDescription>
            Replay publik bisa dibaca tanpa akun.
          </DialogDescription>
        </DialogHeader>
        <div className="share-preview">
          <p className="eyebrow">HIVE REPLAY · DEMO</p>
          <MatchPair compact />
          <h3>{title}</h3>
          <p>Good people. Different perspectives.</p>
        </div>
        <Button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${window.location.origin}/replays/${id}`,
              );
              toast.success("Tautan replay disalin.");
            } catch {
              toast.error("Salin URL replay dari bilah alamat browser.");
            }
          }}
        >
          <Copy size={16} />
          Salin tautan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export function ReportDialog({ target }: { target: string }) {
  const [reason, setReason] = useState(""),
    [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Laporkan konten">
          <Flag size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Laporkan konten</DialogTitle>
          <DialogDescription>
            Laporan diteruskan ke antrean moderasi demo.
          </DialogDescription>
        </DialogHeader>
        <label htmlFor="report-reason">Apa yang perlu kami tinjau?</label>
        <Textarea
          id="report-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
        />
        <Button
          disabled={reason.trim().length < 5 || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api("reports", {
                method: "POST",
                body: JSON.stringify({ target, reason }),
              });
              toast.success("Laporan diterima.");
              setOpen(false);
            } catch (e) {
              toast.error((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          Kirim laporan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export function ProofLink({ id = "founding-001" }: { id?: string }) {
  return (
    <Link href={`/proof/${id}`} className="text-link subtle">
      <Link2 size={14} />
      View proof
      <ArrowUpRight size={13} />
    </Link>
  );
}
export function DemoNote() {
  return (
    <p className="demo-note">
      <Sparkles size={14} />
      Ruang demo dengan anggota dan aktivitas ilustratif.
    </p>
  );
}
