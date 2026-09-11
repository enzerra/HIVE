import Link from "next/link";
import { PageShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <PageShell>
      <div className="empty-state">
        <p className="eyebrow muted">404 · A DIFFERENT FREQUENCY</p>
        <h1>Belum menemukan ruang ini.</h1>
        <p>
          Tautannya mungkin berubah. Masih ada komunitas yang bisa kamu temukan.
        </p>
        <Button asChild>
          <Link href="/explore">Jelajahi Hives</Link>
        </Button>
      </div>
    </PageShell>
  );
}
