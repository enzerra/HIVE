"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Viewer } from "@/domain/types";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export function useSession() {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const query = useQuery({
    queryKey: ["session"],
    queryFn: () => api<Viewer | null>("/session"),
    retry: false,
    enabled: hydrated,
  });
  // A streamed sibling may hydrate after this query resolves elsewhere.
  // Keep its first render identical to the server's anonymous projection.
  return {
    ...query,
    data: hydrated ? query.data : undefined,
    isPending: !hydrated || query.isPending,
  };
}
