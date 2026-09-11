import { z } from "zod";
const envelope = z.object({
  data: z.unknown(),
  meta: z.object({ schemaVersion: z.literal("hive-ui-v1") }).passthrough(),
});
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
const messages: Record<string, string> = {
  SESSION_REQUIRED: "Masuk untuk melanjutkan.",
  NOT_READY: "Tandai kesiapanmu di Lobby sebelum mulai.",
  DEMO_DISABLED: "Sesi demo belum diaktifkan pada server ini.",
  INITIAL_REQUIRED: "Initial call belum terkunci. Revisi tidak tersedia.",
  ATTRIBUTION_REQUIRED: "Pilih alasan perubahan keputusanmu.",
  STEP_REQUIRED: "Lengkapi langkah perkenalan sebelumnya terlebih dahulu.",
  HANDLE_TAKEN: "Nama ini sudah digunakan. Coba nama lain.",
  VALIDATION_FAILED: "Periksa kembali isianmu.",
  PHASE_CLOSED: "Fase ini sudah berakhir. Memuat status terbaru.",
  ELIGIBILITY_REQUIRED: "Lengkapi Squad yang eligible sebelum bermain.",
  ALREADY_COMMITTED: "Pilihanmu sudah dikirim. Memuat receipt yang tersimpan.",
  INVALID_ATTRIBUTION: "Pilih argumen dari Squad lain yang tersedia.",
  ARGUMENT_LIMIT: "Maksimal 30 kata dan 240 karakter.",
  ROSTER_LOCKED: "Roster sudah terkunci untuk pertandingan ini.",
  LIVE_NOT_CONFIGURED: "Integrasi live belum tersedia pada demo frontend ini.",
  ACTION_FORBIDDEN: "Aksi ini tidak tersedia untuk peranmu.",
  REPLAY_PENDING:
    "Hasil belum tersedia. Replay akan siap setelah outcome selesai.",
};
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1/${path.replace(/^\//, "")}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    cache: "no-store",
  }).catch(() => {
    throw new ApiError(
      "NETWORK",
      "Koneksi sedang terganggu. Coba lagi setelah tersambung.",
    );
  });
  const json = await res.json().catch(() => {
    throw new ApiError(
      "SCHEMA_UNSUPPORTED",
      "Respons layanan belum dapat dibaca. Coba muat ulang.",
    );
  });
  if (!res.ok)
    throw new ApiError(
      json.error?.code ?? "NETWORK",
      messages[json.error?.code] ??
        json.error?.message ??
        "Koneksi terganggu. Coba lagi.",
    );
  const parsed = envelope.safeParse(json);
  if (!parsed.success)
    throw new ApiError(
      "SCHEMA_UNSUPPORTED",
      "Format data belum dapat dibaca. Muat ulang halaman.",
    );
  return parsed.data.data as T;
}
export const post = <T>(path: string, body: unknown = {}) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });
