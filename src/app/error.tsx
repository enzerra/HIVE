"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main id="main-content" className="empty-state">
      <h1>Ruang ini belum bisa dimuat.</h1>
      <p>Koneksi atau layanan mungkin sedang terganggu. Coba buka kembali.</p>
      <Button onClick={reset}>Coba lagi</Button>
    </main>
  );
}
