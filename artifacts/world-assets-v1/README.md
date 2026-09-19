# HIVE world assets — concept set v1

Original visual concepts for the HIVE isometric world. These files are not integrated into the application.

## Prepared pack available

The concept sources below are preserved unchanged. Cleaned, separated PNG/WebP assets are now in `public/world-assets/v1`, with a manifest and interactive preview. See that directory's README for exact readiness boundaries. `qa-report.json` and the three `qa-contact-*.png` sheets document the processed pack's checks. The original transparency issues described below apply to these source concepts, not the processed output.

| File | Content |
| --- | --- |
| arena-idle-concept.png | Circular Arena, closed entrance |
| arena-active-concept.png | Arena, open entrance and active central light |
| hive-tower-concept.png | Community tower |
| squad-lounge-concept.png | Squad clubhouse and terrace |
| wolf-poses-concept.png | Wolf idle and walking pose references |
| fox-poses-concept.png | Fox idle and walking pose references |
| frog-poses-concept.png | Frog idle and walking pose references |
| plaza-terrain-concept.png | Unoccupied plaza with three building pads |
| props-concept.png | Lamp, banner, crystal, bench, tree, Pulse terminal, Replay terminal, bridge |

## Production status

- These are generated concept illustrations, not animation-ready sprite sheets or a collision-ready map.
- Character poses and props remain combined on their respective sheets.
- Doors, flags, lighting, trees, and terrain are not separated into animation layers.
- Arena active and wolf pose images contain a visible checkerboard background; their sampled corner alpha is opaque. Background cleanup is required before compositing these two assets.
- Other files have transparent sampled corners, but halos and edge alpha still require full compositing review.
- Arena variants are visual references, not guaranteed pixel-aligned frames. Align geometry and anchors before implementing a state transition.
- Pixel density, building scale, foot anchors, walkable areas, and occlusion masks must be standardized before game integration.
- No character, match, activity count, or product state is represented as live data by these concept images.

## Revision 2 review

- `arena-active-v2.png` removes the visible checkerboard and preserves the circular entrance concept. Its sampled corner remains opaque, so it is not a transparent replacement for compositing.
- `wolf-poses-v2.png` provides a matching slate-grey wolf concept derived from the fox outfit and pose reference. It visually removes the checkerboard, but transparency must not be assumed.
- Automated image edits did not reliably preserve or create transparent backgrounds. Original concepts remain available; neither revision is wired into the app or labeled production-ready.
