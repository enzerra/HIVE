"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
function listenMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function useWorldMotion(preference?: string) {
  const systemReduced = useSyncExternalStore(
    listenMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  return preference === "reduce" || systemReduced;
}
export type WorldTravel = {
  stage: "idle" | "entering" | "navigating";
  id: string | null;
};
export function useWorldTravel(reduced: boolean) {
  const router = useRouter();
  const [state, setState] = useState<WorldTravel>({ stage: "idle", id: null });
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function enter(id: string, href: string, animated = true) {
    if (busy.current) return;
    busy.current = true;
    if (reduced || !animated) {
      setState({ stage: "navigating", id });
      router.push(href);
      return;
    }
    setState({ stage: "entering", id });
    timer.current = setTimeout(() => {
      setState({ stage: "navigating", id });
      router.push(href);
    }, 650);
  }
  return { state, enter };
}
