"use client";
import { useEffect } from "react";
import { useSession } from "@/lib/client/session";
export function PreferenceSync() {
  const { data: v } = useSession();
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(
      v?.preferences.motion === "reduce",
    );
  }, [v?.preferences.motion]);
  return null;
}
