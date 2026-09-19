"use client";
import { useEffect, useRef, useState } from "react";
import {
  canWalk,
  moveWalker,
  nearbyDoor,
  walkingKey,
  WORLD_SPAWN,
  type Point,
} from "@/domain/world-walking";

export function useWorldWalker(enabled: boolean, storageKey: string) {
  const [walker, setWalker] = useState({
    ...WORLD_SPAWN,
    moving: false,
    left: false,
    step: false,
  });
  const position = useRef<Point>(WORLD_SPAWN);
  const keys = useRef(new Set<string>());
  const stick = useRef<Point>({ x: 0, y: 0 });
  const stop = () => {
    keys.current.clear();
    stick.current = { x: 0, y: 0 };
  };
  const press = (key: string, repeat: boolean) => {
    if (!enabled) return;
    const direction = walkingKey(key);
    if (!direction) return;
    keys.current.add(key.toLowerCase());
    // A short tap must move even if keyup arrives before the next paint.
    if (!repeat)
      position.current = moveWalker(position.current, direction, 0.025);
  };
  useEffect(() => {
    position.current = WORLD_SPAWN;
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (value && canWalk(value))
        position.current = { x: value.x, y: value.y };
    } catch {
      /* Storage is optional. */
    }
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      const direction = { ...stick.current };
      if (enabled && !document.hidden)
        for (const key of keys.current) {
          const d = walkingKey(key);
          if (d) {
            direction.x += d.x;
            direction.y += d.y;
          }
        }
      const next =
        enabled && !document.hidden
          ? moveWalker(
              position.current,
              direction,
              last ? (now - last) / 1000 : 0,
            )
          : position.current;
      const moving =
        next.x !== position.current.x || next.y !== position.current.y;
      position.current = next;
      last = now;
      setWalker((old) =>
        old.x === next.x && old.y === next.y && !old.moving && !moving
          ? old
          : {
              ...next,
              moving,
              left: direction.x ? direction.x < 0 : old.left,
              step: moving && Math.floor(now / 160) % 2 === 1,
            },
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const release = (e: KeyboardEvent) =>
      keys.current.delete(e.key.toLowerCase());
    const clear = () => {
      keys.current.clear();
      stick.current = { x: 0, y: 0 };
    };
    window.addEventListener("keyup", release);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      cancelAnimationFrame(frame);
      clear();
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(position.current));
      } catch {
        /* Optional. */
      }
    };
  }, [enabled, storageKey]);
  return { walker, nearby: nearbyDoor(walker), press, stick, stop };
}
