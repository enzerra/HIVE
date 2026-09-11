"use client";

import { useEffect, useRef } from "react";

/** Decorative connections, not a representation of live community activity. */
export function CommunityBackground() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.current?.style.setProperty(
          "--drift-x",
          `${(event.clientX / window.innerWidth - 0.5) * 18}px`,
        );
        root.current?.style.setProperty(
          "--drift-y",
          `${(event.clientY / window.innerHeight - 0.5) * 14}px`,
        );
        root.current?.style.setProperty("--light-x", `${event.clientX}px`);
        root.current?.style.setProperty("--light-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={root} className="community-atmosphere" aria-hidden="true">
      <div className="community-light" />
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <g className="community-links" fill="none">
          <path d="M-40 240L90 160L220 230L180 380L30 440L-40 240M90 160L180 380M220 230L320 100" />
          <path d="M1180 60L1320 180L1260 330L1440 420M1320 180L1480 120M1260 330L1160 470L1360 570L1440 420" />
          <path d="M-40 760L120 650L260 780L180 940L-20 1000M120 650L180 940M260 780L340 1040" />
          <path d="M1110 1050L1150 860L1310 780L1470 880M1150 860L1320 1020M1310 780L1360 570" />
        </g>
        {[
          [90, 160],
          [220, 230],
          [180, 380],
          [30, 440],
          [1320, 180],
          [1260, 330],
          [1160, 470],
          [1360, 570],
          [120, 650],
          [260, 780],
          [180, 940],
          [1150, 860],
          [1310, 780],
        ].map(([x, y], i) => (
          <g key={i} className="community-node">
            <circle cx={x} cy={y} r="10" fill="none" />
            <circle cx={x} cy={y} r="3" stroke="none" />
          </g>
        ))}
      </svg>
    </div>
  );
}
