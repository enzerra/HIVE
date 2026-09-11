import type { Hive, Squad } from "./types";
// Public, explicitly illustrative directory. No hidden match decisions live here.
export const hives: Hive[] = [
  {
    id: "purple",
    name: "Purple",
    slug: "purple",
    tagline: "Beda pendapat. Tetap satu frekuensi.",
    description:
      "Rumah untuk pemain yang penasaran. Kami membahas game, mempertanyakan asumsi, dan menguji sudut pandang bersama.",
    category: "Gaming & culture",
    members: 20,
    squads: 5,
    symbol: 0,
    color: "indigo",
    tags: ["PC gaming", "Diskusi", "Santai"],
  },
  {
    id: "chog",
    name: "Chog",
    slug: "chog",
    tagline: "Pikiran terbuka. Permainan serius.",
    description:
      "Komunitas yang senang membaca sinyal kecil dan membawa alasan besar. Kompetitif di Arena, akrab sesudahnya.",
    category: "Competitive gaming",
    members: 20,
    squads: 5,
    symbol: 1,
    color: "green",
    tags: ["Strategi", "Kompetitif", "PC gaming"],
  },
  {
    id: "afterhours",
    name: "Afterhours",
    slug: "afterhours",
    tagline: "Satu ronde lagi, satu cerita lagi.",
    description:
      "Untuk percakapan setelah permainan selesai. Tempat bertemu teman baru dan menyiapkan Squad pertamamu.",
    category: "Late-night social",
    members: 8,
    squads: 2,
    symbol: 2,
    color: "orange",
    tags: ["Komunitas baru", "Santai"],
  },
  {
    id: "common-ground",
    name: "Common Ground",
    slug: "common-ground",
    tagline: "Temukan teman yang beda pikiran.",
    description:
      "Komunitas kecil untuk pandangan yang beragam. Belum ada Arena aktif—cerita pertama kita masih di depan.",
    category: "Ideas & community",
    members: 6,
    squads: 2,
    symbol: 3,
    color: "blue",
    tags: ["Komunitas baru", "Diskusi"],
  },
];
export const squads: Squad[] = [
  ...["Aster", "Orbit", "Moss", "Echo", "Nova"].map((name, i) => ({
    id: name.toLowerCase(),
    name,
    hiveId: "purple",
    symbol: i,
    members:
      i === 0
        ? ["Nara", "Raka", "Mika", "Juno"]
        : ["Ari", "Kai", "Rei", "Sora"].map((n) => `${n} ${i + 1}`),
  })),
  ...["Kite", "Rune", "Drift", "Vale", "Flux"].map((name, i) => ({
    id: name.toLowerCase(),
    name,
    hiveId: "chog",
    symbol: i + 5,
    members: ["Ren", "Tama", "Rin", "Leo"].map((n) => `${n} ${i + 1}`),
  })),
  {
    id: "night-shift",
    name: "Night Shift",
    hiveId: "afterhours",
    symbol: 7,
    members: ["Luna", "Kio"],
    forming: true,
  },
];
export const hiveById = (id: string) => hives.find((h) => h.id === id);
export const squadById = (id: string) => squads.find((s) => s.id === id);
