# HIVE world static asset pack v1

19 transparent assets, each supplied as PNG and WebP. Prepared from the approved HIVE concepts using local image processing explicitly authorized by the user.

## Contents

- Four building images: Arena idle/active, Hive Tower, Squad Lounge (768 × 768).
- Six character images: wolf, fox, frog; idle and step pose per character (384 × 384).
- Eight individual props: lamp, banner, crystal, bench, tree, Pulse terminal, Replay terminal, bridge (512 × 512).
- One empty plaza terrain (1536 × 1024).
- `manifest.json`: file paths, dimensions, content bounds, normalized anchors, provenance, byte sizes, state/pose metadata.
- `preview.html`: composed scene, manual Arena state switch, character/pose selection, and dark/light/checker inspection backgrounds.

## Preview

With the HIVE development server running, open `/world-assets/v1/preview.html`.
For an extracted standalone pack, run `python -m http.server 8080` inside this directory and open `http://localhost:8080/preview.html`. The gallery reads the adjacent manifest over HTTP.

## Integration

Use WebP for the UI; PNG originals are included for lossless editing. Every file has explicit dimensions and real alpha transparency. Place an asset at its manifest anchor: offset its top-left by `(renderedWidth * anchor[0], renderedHeight * anchor[1])` from the desired placement point. Anchors are stable placement references, not collision outlines.

Arena states share one mask, crop, canvas and anchor. Crossfade or swap them; do not animate each as an independent moving building. Character pairs share a canvas, scale and baseline within each species. Object sizes are normalized for inspection; choose scene scale per category instead of rendering every file at the same width.

## What is ready

Static composition, accessible building hotspots supplied by application code, and manual Arena state changes. Character pose previews can be switched without a canvas-size jump. Preview activity is illustrative and is not connected to real user presence.

## What this pack does not claim

These are not complete four-direction walking animations. There are two front-right poses per animal. Doors, flags, lamps and foliage are baked into building images, not separate animation layers. Game navigation, collision polygons, character occlusion, live presence and application integration remain separate implementation work. The preview's layout is a composition study, not a playable map.

## Rebuild and verify in the repository

Prerequisites: Python 3, numpy, opencv-python. Source concepts remain untouched in `artifacts/world-assets-v1`.

```text
python scripts/prepare_world_assets.py
python scripts/check_world_assets.py
```

Preparation removes low-alpha generated haze, registers Arena geometry and reuses the approved silhouette, segments wolf characters with GrabCut guided by the matching fox alpha, isolates poses and props, and exports standardized canvases. Image generation created the original concepts; no new generative edits were used during this local cleanup.
