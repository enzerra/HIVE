import { cn } from "@/lib/utils";
import { PixelPortrait } from "./pixel-portrait";
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M16 2 29 9.5v13L16 30 3 22.5v-13Z" fill="currentColor" />
      <path
        d="M10 10v12m12-12v12M10 16h12"
        stroke="var(--background)"
        strokeWidth="3"
      />
    </svg>
  );
}
// Original 16 × 16 animal sprites. Integer cells stay crisp at every size.
const animals = [
  {
    name: "Fox",
    fur: "#C48657",
    light: "#F4DDAD",
    rows: [
      "..OO......OO..",
      "..OFOO..OOFO..",
      "..OFFFOOFFFO..",
      "..OFFFFFFFFO..",
      ".OFFFFFFFFFFO.",
      ".OFFKFFFFKFFO.",
      ".OFLKFFFFKLFO.",
      "..OLLLFFLLLO..",
      "...OLLLLLLO...",
      "....OLLLOO....",
      ".....OKKO.....",
      "......OO......",
    ],
  },
  {
    name: "Frog",
    fur: "#79946D",
    light: "#C8D5A0",
    rows: [
      "...OO....OO...",
      "..OLLO..OLLO..",
      "..OKLOOOOLKO..",
      ".OFFFFFFFFFFO.",
      "OFFFFFFFFFFFFO",
      "OFFLLLLLLLLFFO",
      "OFLLLLLLLLLLFO",
      ".OLKKLLLLKKLO.",
      "..OLLKKKKLLO..",
      "...OLLLLLLO...",
      "....OOOOOO....",
      "..............",
    ],
  },
  {
    name: "Cat",
    fur: "#A89BBB",
    light: "#E4DAEE",
    rows: [
      "..OO......OO..",
      "..OFO....OFO..",
      "..OFFOOOOFFO..",
      "..OFFFFFFFFO..",
      ".OFFFFFFFFFFO.",
      ".OFKKFFFFKKFO.",
      ".OFFFFFFFFFFO.",
      "OOLLFFKKFFLLOO",
      "..OLLLLLLLLO..",
      "...OLKLLKLO...",
      "....OLKKLO....",
      ".....OOOO.....",
    ],
  },
  {
    name: "Bear",
    fur: "#AD8267",
    light: "#E5C5A0",
    rows: [
      "..OOO....OOO..",
      ".OFFFO..OFFFO.",
      ".OFFFOOOOFFFO.",
      "..OFFFFFFFFO..",
      ".OFFFFFFFFFFO.",
      ".OFFKFFFFKFFO.",
      ".OFFFFFFFFFFO.",
      ".OFFLLLLLLFFO.",
      "..OFLLKKLLFO..",
      "..OFLLKKLLFO..",
      "...OLLLLLLO...",
      "....OOOOOO....",
    ],
  },
  {
    name: "Penguin",
    fur: "#667F95",
    light: "#E4EAF0",
    rows: [
      ".....OOOO.....",
      "...OOFFFFOO...",
      "..OFFFFFFFFO..",
      "..OFFLLLLFFO..",
      ".OFFLLLLLLFFO.",
      ".OFLKLLLLKLFO.",
      ".OFLLLLLLLLFO.",
      ".OFLLLFFLLLFO.",
      ".OFLLLFFLLLFO.",
      "..OFLLLLLLFO..",
      "...OLLLLLLO...",
      "....OOOOOO....",
    ],
  },
  {
    name: "Owl",
    fur: "#9B936C",
    light: "#E7DEB6",
    rows: [
      "..OO......OO..",
      "..OFOOOOOOFO..",
      "..OFFFFFFFFO..",
      ".OFLLLFFLLLFO.",
      ".OLLLLLLLLLLO.",
      ".OLLKLLLLKLLO.",
      ".OLLLLLLLLLLO.",
      "..OLLFFFFLLO..",
      "..OFLFFFFLFO..",
      "...OFLLLLFO...",
      "....OFFFFO....",
      ".....OOOO.....",
    ],
  },
  {
    name: "Rabbit",
    fur: "#A8B8B3",
    light: "#E3ECE5",
    rows: [
      "...OO..OO.....",
      "..OLLOOLLO....",
      "..OLLOOLLO....",
      "..OLLOOLLO....",
      "..OFFFFFFO....",
      ".OFFFFFFFFO...",
      "OFFKFFFFKFFO..",
      "OFFFFFFFFFFO..",
      "OFLLLLLLLLFO..",
      ".OLLLKKLLLO...",
      "..OLLLLLLO....",
      "...OOOOOO.....",
    ],
  },
  {
    name: "Panda",
    fur: "#E6DDE0",
    light: "#A18D9B",
    rows: [
      "..OOO....OOO..",
      ".OKKKO..OKKKO.",
      ".OKKKOOOOКKKO.".replace("К", "K"),
      "..OFFFFFFFFO..",
      ".OFFFFFFFFFFO.",
      ".OFKKFFFFKKFO.",
      ".OFKLFFFFLKFO.",
      ".OFFFFFFFFFFO.",
      "..OFFFKKFFFO..",
      "..OFFFFFFFFO..",
      "...OFFFFFFO...",
      "....OOOOOO....",
    ],
  },
];
function Animal({ index = 0 }: { index?: number }) {
  const animal = animals[Math.abs(index) % animals.length];
  const palette: Record<string, string> = {
    O: "#35343B",
    K: "#35343B",
    F: animal.fur,
    L: animal.light,
  };
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {animal.rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : (
            <rect
              key={x + ":" + y}
              x={x + 1}
              y={y + 2}
              width="1"
              height="1"
              fill={palette[cell]}
            />
          ),
        ),
      )}
    </svg>
  );
}
export function Avatar({
  index = 0,
  size = 40,
  name,
  className,
}: {
  index?: number;
  size?: number;
  name?: string;
  className?: string;
}) {
  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : true}
      className={cn("avatar pixel-avatar", className)}
      style={{ width: size, height: size }}
    >
      <PixelPortrait index={index} />
    </span>
  );
}
export function AvatarGroup({
  count = 4,
  size = 28,
}: {
  count?: number;
  size?: number;
}) {
  return (
    <span className="avatar-group">
      {Array.from({ length: count }, (_, i) => (
        <Avatar key={i} index={i} size={size} />
      ))}
    </span>
  );
}
export function Crest({
  symbol = 0,
  size = 36,
}: {
  symbol?: number;
  size?: number;
}) {
  return (
    <span
      className="crest pixel-crest"
      role="img"
      aria-label="Squad crest"
      style={{ width: size, height: size * 1.1 }}
    >
      <Animal index={symbol} />
    </span>
  );
}
export function Sigil({
  symbol = 0,
  color = "indigo",
  size = 48,
}: {
  symbol?: number;
  color?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("sigil pixel-sigil", "sigil-" + color)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Hive sigil"
    >
      <Animal index={symbol + 4} />
    </span>
  );
}
