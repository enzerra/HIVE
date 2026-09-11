import { cn } from "@/lib/utils";
const palettes = [
  ["#73B6EE", "#AD7746", "#F4E4C6", "#1B3865"],
  ["#9671CA", "#37BD83", "#B7F2AC", "#E4E6ED"],
  ["#919748", "#D5D8DB", "#FFFFFF", "#272B34"],
  ["#A86468", "#777F91", "#BEC5D0", "#60347E"],
  ["#DDD58C", "#946648", "#DAC7A0", "#293640"],
  ["#649EB9", "#385DCF", "#ED984C", "#30333E"],
  ["#A6BCA7", "#D5C3A7", "#FFF1D7", "#8B5949"],
  ["#A78AAB", "#C1906F", "#ECD4B5", "#514570"],
];
/** Original pixel portraits: animal busts, apparel and headwear on solid fields. */
export function PixelPortrait({ index }: { index: number }) {
  const n = Math.abs(index) % 8;
  const [bg, fur, muzzle, hat] = palettes[n];
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("pixel-portrait")}
    >
      <path fill={bg} d="M0 0h32v32H0z" />
      <path fill="#20232B" d="M10 24h13v2h3v6H6v-5h4z" />
      <path
        fill={n === 1 ? "#E6E8EE" : hat}
        d="M10 26h12v6H9v-4H7v4h-1v-5h4z"
      />
      <path fill={fur} d="M14 24h6v6h-6z" />
      <path fill="#20232B" d="M10 8h13v2h3v13h-3v3H12v-2H8V12h2z" />
      <path fill={fur} d="M11 10h12v2h2v10h-3v3h-9v-3H9V12h2z" />
      {n === 0 || n === 4 ? (
        <path fill="#69462E" d="M7 12h4v12H8v-3H6v-7h1z" />
      ) : null}
      {n === 6 ? <path fill={muzzle} d="M11 1h4v11h-4zm8 0h4v12h-4z" /> : null}
      <path
        fill={muzzle}
        d={n === 5 ? "M18 19h9v2h3v3H18z" : "M15 19h8v3h-2v2h-7v-2h-2v-2h2z"}
      />
      <path fill="#20232B" d="M12 14h4v4h-4zm8 0h4v4h-4z" />
      <path fill="#FFFFFF" d="M14 14h2v2h-2zm8 0h2v2h-2z" />
      {n !== 5 && <path fill="#20232B" d="M18 19h3v2h-3zm-3 4h5v1h-5z" />}
      {n === 1 ? (
        <>
          <path fill="#22252D" d="M4 8h24v2H4zm4-2h16v2H8zm4-2h8v2h-8z" />
          <path fill={hat} d="M5 8h22v1H5zm4-2h14v2H9zm4-2h6v2h-6z" />
          <path fill="#E6E63E" d="M11 13h6v5h-6zm8 0h6v5h-6z" />
          <path fill="#20232B" d="M13 14h2v3h-2zm8 0h2v3h-2z" />
        </>
      ) : n === 3 ? (
        <>
          <path fill="#20232B" d="M9 5h14v3h4v4H5V8h4z" />
          <path fill={hat} d="M10 6h12v3H7v2h18v-1H10z" />
          <path fill="#EF6862" d="M13 15h2v2h-2zm8 0h2v2h-2z" />
        </>
      ) : (
        <>
          <path fill="#20232B" d="M11 3h10v2h3v6h3v2H6v-2h3V5h2z" />
          <path fill={hat} d="M12 4h8v2h3v4H10V6h2z" />
          <path fill={n === 5 ? "#D9DFE8" : "#627492"} d="M10 9h13v2H10z" />
          {n === 2 || n === 4 ? (
            <path fill="#E68472" d="M17 5h2v1h1v2h-1v1h-2V8h-1V6h1z" />
          ) : null}
        </>
      )}
      <path fill="#FFFFFF" opacity=".6" d="M10 28h1v1h-1zm0 3h1v1h-1z" />
    </svg>
  );
}
