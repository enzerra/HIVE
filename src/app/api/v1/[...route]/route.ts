import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createWorld,
  needWorld,
  getWorld,
  worlds,
  snapshot,
  start,
  advance,
  decide,
  saveArgument,
  sendChat,
  resetMatch,
  exampleReplay,
  AppError,
} from "@/lib/server/engine";
import { hives, squadById } from "@/domain/community";
import type { Scenario } from "@/domain/types";
import { publishReplay, publicReplay } from "@/lib/server/replays";
import {
  advanceQuickCall,
  discussQuickCall,
  listQuickCalls,
  lockQuickCall,
  publicQuickCall,
  quickCall,
  reviseQuickCall,
  voidQuickCall,
} from "@/lib/server/quick-calls";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieName = "hive_demo_session";
const object = z.record(z.string(), z.unknown());
const str = (v: unknown, max = 1000) =>
  z.string().trim().min(1).max(max).parse(v);
function success(data: unknown, status = 200) {
  return NextResponse.json(
    { data, meta: { schemaVersion: "hive-ui-v1", serverNow: Date.now() } },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
}
type Context = { params: Promise<{ route: string[] }> };
async function handle(req: NextRequest, context: Context) {
  try {
    const path = (await context.params).route.join("/"),
      method = req.method;
    let id = req.cookies.get(cookieName)?.value;

    let supabaseUser: { id: string; email?: string } | null = null;
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        supabaseUser = user;
        id = user.id;
        let w = getWorld(user.id);
        if (!w) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          const handle = profile?.handle ?? user.email?.split("@")[0] ?? "Player";
          w = createWorld(user.id, {
            handle,
            avatar: 0,
            hiveId: profile?.hive_id ?? null,
            squadId: profile?.squad_id ?? null,
            onboarded: profile?.onboarded ?? false,
          });
        }
      }
    } catch {
      // Supabase not authenticated or error, continue with demo session
    }
    if (process.env.HIVE_DATA_MODE === "live")
      throw new AppError(
        "LIVE_NOT_CONFIGURED",
        503,
        "Integrasi live belum dikonfigurasi.",
      );
    if (method !== "GET") {
      const origin = req.headers.get("origin");
      const expected =
        process.env.HIVE_APP_ORIGIN ??
        `${req.nextUrl.protocol}//${req.headers.get("host") ?? req.nextUrl.host}`;
      if (origin && origin !== expected)
        throw new AppError(
          "ORIGIN_FORBIDDEN",
          403,
          "Permintaan berasal dari alamat yang tidak sesuai. Muat ulang halaman.",
        );
    }
    if (method === "GET") {
      if (path === "session") return success(getWorld(id)?.viewer ?? null);
      if (path === "hives") return success(hives);
      if (path.startsWith("hives/"))
        return success(
          hives.find((h) => h.slug === path.split("/")[1]) ?? null,
        );
      if (path.startsWith("squads/"))
        return success(squadById(path.split("/")[1]) ?? null);
      if (path === "replays/founding-001") return success(exampleReplay());
      if (path === "replays/current")
        return success(publishReplay(needWorld(id)));
      if (path.startsWith("replays/"))
        return success(publicReplay(path.split("/")[1]));
      if (path === "calls/steam-rivals-001/public")
        return success(publicQuickCall());
      if (path.startsWith("proof/"))
        return success({
          mode: "demo",
          ruleVersion: "hive-demo-v1",
          source: "Snapshot ilustrasi · bukan data Steam live",
          network: "Tidak ada transaksi onchain dalam demo",
          metric: "Perubahan relatif concurrent players",
          formula: "100 × (1 − (p − y)²)",
          roster: "5 Squad per Hive · 4 Human per Squad",
          precision: "Integer 1.000.000; floor pada setiap division",
          snapshots: [
            {
              game: "Counter-Strike 2",
              start: 100000,
              end: 110000,
              growth: "+10%",
            },
            { game: "Dota 2", start: 80000, end: 84000, growth: "+5%" },
          ],
        });
      if (path === "invites/aster-founding")
        return success({ squad: squadById("aster"), status: "valid" });
      if (path.startsWith("invites/"))
        return success({
          squad: squadById("aster"),
          status: path.includes("full") ? "full" : "expired",
        });
      if (path === "matches/founding-001/watch")
        return success(exampleReplay());
      const w = needWorld(id);
      if (path === "home")
        return success({
          viewer: w.viewer,
          following: w.following,
          started: w.startedAt !== null,
          settled: snapshot(w).settled,
          finishedPlaying: snapshot(w).finishedPlaying,
        });
      if (path === "matches/current/snapshot") return success(snapshot(w));
      if (path === "matches/current/watch")
        return success(snapshot(w, Date.now(), true));
      if (path.startsWith("receipts/by-key/")) {
        const key = path.split("/").at(-1),
          s = snapshot(w);
        return success(
          [s.own.initialReceipt, s.own.finalReceipt].find(
            (r) => r?.key === key,
          ) ?? null,
        );
      }
      if (path === "notifications") return success(w.notifications);
      if (path === "preferences") return success(w.viewer.preferences);
      if (path === "calls") return success(listQuickCalls(w.viewer.id));
      if (path === "calls/steam-rivals-001")
        return success(quickCall(w.viewer.id));
      if (path.startsWith("operator/")) {
        if (w.viewer.role !== "operator")
          throw new AppError("ACTION_FORBIDDEN", 403);
        return success(
          path.includes("reports")
            ? w.reports
            : { events: w.events, match: snapshot(w) },
        );
      }
      throw new AppError("RESOURCE_NOT_FOUND", 404);
    }
    const body = object.parse(await req.json().catch(() => ({})));
    if (path === "demo/session") {
      if (
        process.env.HIVE_DEMO_ENABLED === "false" ||
        (process.env.NODE_ENV === "production" &&
          process.env.HIVE_DEMO_ENABLED !== "true")
      )
        throw new AppError("DEMO_DISABLED", 403);
      const w = getWorld(id) ?? createWorld();
      const response = success(w.viewer);
      response.cookies.set(cookieName, w.viewer.id, {
        httpOnly: true,
        secure: req.nextUrl.protocol === "https:",
        sameSite: "lax",
        path: "/",
        maxAge: 86400,
      });
      return response;
    }
    if (path === "auth/logout") {
      if (id) worlds.delete(id);
      try {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
      } catch {}
      const response = success(null);
      response.cookies.delete(cookieName);
      return response;
    }
    const w = needWorld(id);
    if (path === "onboarding/identity" || path === "me/profile") {
      const handle = z
        .string()
        .regex(/^[A-Za-z0-9_]{3,24}$/)
        .parse(body.handle);
      if (
        [...worlds.values()].some(
          (other) =>
            other !== w &&
            other.viewer.handle.toLowerCase() === handle.toLowerCase(),
        )
      )
        throw new AppError("HANDLE_TAKEN", 409);
      w.viewer.handle = handle;
      if (path === "onboarding/identity")
        w.onboardingStep = Math.max(1, w.onboardingStep ?? 0);
      if (body.avatar !== undefined)
        w.viewer.avatar = z.number().int().min(0).max(7).parse(body.avatar);
      return success(w.viewer);
    }
    if (path === "onboarding/squad") {
      if (w.startedAt) throw new AppError("ROSTER_LOCKED", 409);
      if (!w.viewer.onboarded && (w.onboardingStep ?? 0) < 1)
        throw new AppError("STEP_REQUIRED", 409);
      const action = z.enum(["join", "create", "defer"]).parse(body.action);
      if (action === "defer") {
        w.viewer.deferred = true;
        w.viewer.squadId = null;
        w.viewer.hiveId = null;
      } else if (action === "create") {
        w.viewer.squadName = z.string().trim().min(3).max(30).parse(body.name);
        w.viewer.squadId = "new-squad";
        w.viewer.hiveId = "purple";
        w.viewer.deferred = false;
      } else {
        const target = z
          .enum(["aster", "night-shift"])
          .parse(body.squadId ?? "aster");
        if (body.invite === "full") throw new AppError("SQUAD_FULL", 409);
        if (body.invite === "expired")
          throw new AppError("INVITE_EXPIRED", 409);
        w.viewer.squadId = target;
        w.viewer.hiveId = squadById(target)!.hiveId;
        w.viewer.deferred = false;
      }
      w.onboardingStep = 2;
      return success(w.viewer);
    }
    if (path === "onboarding/hive") {
      if (!w.viewer.onboarded && (w.onboardingStep ?? 0) < 2)
        throw new AppError("STEP_REQUIRED", 409);
      if (w.startedAt !== null) throw new AppError("ROSTER_LOCKED", 409);
      if (w.viewer.squadId === "new-squad")
        w.viewer.hiveId = z
          .enum(["purple", "chog", "afterhours", "common-ground"])
          .parse(body.hiveId);
      w.onboardingStep = 3;
      return success(w.viewer);
    }
    if (path === "onboarding/complete") {
      if (!w.viewer.onboarded && (w.onboardingStep ?? 0) < 3)
        throw new AppError("STEP_REQUIRED", 409);
      w.viewer.onboarded = true;
      if (supabaseUser) {
        try {
          const supabase = await createSupabaseServerClient();
          await supabase
            .from("profiles")
            .update({
              handle: w.viewer.handle,
              avatar_url: `/avatars/a-${w.viewer.avatar + 1}.svg`,
              hive_id: w.viewer.hiveId,
              squad_id: w.viewer.squadId,
              onboarded: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", supabaseUser.id);
        } catch {}
      }
      return success(w.viewer);
    }
    if (path === "matches/current/readiness") {
      if (
        !w.viewer.squadId ||
        w.viewer.squadId !== "aster" ||
        w.viewer.deferred
      )
        throw new AppError("ELIGIBILITY_REQUIRED", 403);
      if (w.startedAt) throw new AppError("ROSTER_LOCKED", 409);
      w.ready = z.boolean().parse(body.ready);
      return success(snapshot(w));
    }
    if (path === "calls/steam-rivals-001/lock")
      return success(
        lockQuickCall(
          w.viewer.id,
          z.enum(["A", "B"]).parse(body.choice),
          str(body.reason, 240),
        ),
      );
    if (path === "calls/steam-rivals-001/revise")
      return success(
        reviseQuickCall(w.viewer.id, z.enum(["A", "B"]).parse(body.choice)),
      );
    if (path === "calls/steam-rivals-001/discussion")
      return success(
        discussQuickCall(
          w.viewer.id,
          w.viewer.handle,
          w.viewer.avatar,
          str(body.text, 240),
        ),
      );
    if (path === "calls/steam-rivals-001/advance")
      return success(advanceQuickCall(w.viewer.id));
    if (path === "calls/steam-rivals-001/void")
      return success(voidQuickCall(w.viewer.id));
    if (path === "matches/current/start") return success(start(w));
    if (path === "matches/current/advance") return success(advance(w));
    if (path === "matches/current/reset")
      return success(
        resetMatch(
          w,
          z
            .enum([
              "normal",
              "negative",
              "draw",
              "void",
              "no_contest",
              "forfeit",
            ])
            .parse(body.scenario ?? "normal") as Scenario,
        ),
      );
    if (path === "matches/current/commitments")
      return success(
        decide(
          w,
          z
            .object({
              stage: z.enum(["initial", "final"]),
              choice: z.enum(["A", "B"]),
              key: z.string().uuid(),
              round: z.number().int().min(1).max(3),
              attribution: z.string().optional(),
            })
            .parse(body),
        ),
        202,
      );
    if (path === "matches/current/argument") {
      saveArgument(w, str(body.text, 1000));
      return success({ saved: true });
    }
    if (path === "matches/current/chat") {
      sendChat(w, str(body.text));
      return success({ sent: true });
    }
    if (path === "preferences") {
      const changed = z
        .object({
          theme: z.enum(["system", "light", "dark"]).optional(),
          motion: z.enum(["system", "reduce"]).optional(),
          sound: z.literal(false).optional(),
          presence: z.boolean().optional(),
          reminders: z.boolean().optional(),
        })
        .parse(body);
      Object.assign(w.viewer.preferences, changed);
      return success(w.viewer.preferences);
    }
    if (path === "demo/role") {
      if (
        process.env.HIVE_DEMO_ENABLED === "false" ||
        (process.env.NODE_ENV === "production" &&
          process.env.HIVE_DEMO_ENABLED !== "true")
      )
        throw new AppError("DEMO_DISABLED", 403);
      w.viewer.role = z
        .enum(["member", "representative", "operator"])
        .parse(body.role);
      return success(w.viewer);
    }
    if (path.startsWith("notifications/")) {
      const n = w.notifications.find((n) => n.id === path.split("/")[1]);
      if (n) n.read = z.boolean().parse(body.read);
      return success(w.notifications);
    }
    if (path.endsWith("/follow")) {
      const target = path.split("/")[1];
      if (!hives.some((h) => h.id === target))
        throw new AppError("RESOURCE_NOT_FOUND", 404);
      w.following = w.following.includes(target)
        ? w.following.filter((h) => h !== target)
        : [...w.following, target];
      return success(w.following);
    }
    if (path === "reports") {
      w.reports.push({
        id: crypto.randomUUID(),
        target: str(body.target),
        reason: str(body.reason, 500),
        hidden: false,
      });
      return success({ reported: true });
    }
    if (path.startsWith("operator/")) {
      if (w.viewer.role !== "operator")
        throw new AppError("ACTION_FORBIDDEN", 403);
      if (path === "operator/events") {
        if (w.startedAt) throw new AppError("ROSTER_LOCKED", 409);
        w.events.push({
          id: crypto.randomUUID(),
          title: str(body.title, 80),
          date: str(body.date, 80),
        });
        return success(w.events);
      }
      if (path.startsWith("operator/reports/")) {
        const report = w.reports.find((r) => r.id === path.split("/")[2]);
        if (report) report.hidden = z.boolean().parse(body.hidden);
        return success(w.reports);
      }
      throw new AppError("ACTION_FORBIDDEN", 403);
    }
    if (path === "account/provision/retry" || path === "eligibility/start")
      throw new AppError(
        "LIVE_NOT_CONFIGURED",
        503,
        "Fitur ini belum tersedia dalam demo.",
      );
    throw new AppError("RESOURCE_NOT_FOUND", 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "Periksa kembali isianmu.",
          },
        },
        { status: 422 },
      );
    if (error instanceof AppError)
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    return NextResponse.json(
      {
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Data belum bisa diproses. Coba lagi.",
        },
      },
      { status: 500 },
    );
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
