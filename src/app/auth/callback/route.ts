import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  // Always prefer the configured app origin to avoid 0.0.0.0 or 127.0.0.1 redirect issues
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedOrigin =
    forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}` : null;
  const appOrigin = process.env.HIVE_APP_ORIGIN ?? forwardedOrigin ?? origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${appOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${appOrigin}/sign-in?error=auth-code-error`);
}
