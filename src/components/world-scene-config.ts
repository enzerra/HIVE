import type { WorldLocation } from "@/domain/types";
export type WorldId = WorldLocation["id"];
export type WorldSceneLocation = {
  id: WorldId;
  asset: string;
  assetSize: number;
  width: number;
  position: { x: number; y: number };
  anchor: readonly [number, number];
  camera: { x: number; y: number };
  layer: number;
  hitPolygon: string;
  mirrored?: boolean;
};
export const worldAsset = (name: string) => `/world-assets/v1/${name}.webp`;
// Positions use the terrain's 1536 × 1024 canvas. Hit polygons follow asset alpha hulls.
export const WORLD_SCENE: WorldSceneLocation[] = [
  {
    id: "arena",
    asset: "arena-idle",
    assetSize: 768,
    width: 350,
    position: { x: 380, y: 285 },
    anchor: [0.5, 0.94],
    camera: { x: 380, y: 245 },
    layer: 1,
    hitPolygon:
      "594,215 697,371 732,514 726,576 689,639 596,697 531,720 243,720 169,692 72,621 40,575 34,518 78,371 180,215 386,157",
  },
  {
    id: "hive",
    asset: "hive-tower",
    assetSize: 768,
    width: 280,
    position: { x: 1280, y: 280 },
    anchor: [0.5, 0.94],
    camera: { x: 1280, y: 245 },
    layer: 2,
    hitPolygon:
      "385,52 458,204 568,540 568,565 546,636 356,721 247,654 200,578 200,551 319,134",
  },
  {
    id: "pulse",
    asset: "pulse-terminal",
    assetSize: 512,
    width: 110,
    position: { x: 545, y: 365 },
    anchor: [0.5, 0.94],
    camera: { x: 545, y: 330 },
    layer: 3,
    hitPolygon: "237,41 339,83 358,166 364,417 256,480 147,420 157,240",
  },
  {
    id: "replay",
    asset: "replay-terminal",
    assetSize: 512,
    width: 110,
    position: { x: 950, y: 365 },
    anchor: [0.5, 0.94],
    camera: { x: 950, y: 330 },
    layer: 4,
    hitPolygon: "244,41 339,81 359,167 364,419 254,480 148,423 158,243",
  },
  {
    id: "wisdom",
    asset: "crystal",
    assetSize: 512,
    width: 100,
    position: { x: 760, y: 450 },
    anchor: [0.5, 0.94],
    camera: { x: 760, y: 420 },
    layer: 5,
    hitPolygon: "263,41 321,152 356,426 252,480 160,432 156,387 191,157",
  },
  {
    id: "squad",
    asset: "squad-lounge",
    assetSize: 768,
    width: 330,
    position: { x: 1230, y: 610 },
    mirrored: true,
    anchor: [0.5, 0.94],
    camera: { x: 1170, y: 510 },
    layer: 6,
    hitPolygon:
      "700,181 732,477 717,554 628,706 541,721 314,712 128,621 81,585 55,552 34,508 34,465 90,326 126,288 474,140",
  },
];
export function worldEntrance(
  location: Pick<WorldLocation, "id" | "destination">,
) {
  return location.id === "arena" &&
    !location.destination.startsWith("/onboarding/")
    ? "/arena"
    : location.destination;
}
export function modifiedNavigation(event: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}
