"""Reproducible local cleanup of approved HIVE concept illustrations.

Requires numpy and opencv-python. Does not modify source illustrations.
"""
from pathlib import Path
import json
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'artifacts/world-assets-v1'
OUTPUT = ROOT / 'public/world-assets/v1'
OUTPUT.mkdir(parents=True, exist_ok=True)
cv2.setRNGSeed(23)
assets = []


def read(name):
    image = cv2.imread(str(SOURCE / name), cv2.IMREAD_UNCHANGED)
    if image is None:
        raise ValueError(f'Cannot read: {name}')
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    return image


def clean_alpha(image):
    image = image.copy()
    # Remove generated exterior atmospheric haze, keep a short antialiased edge.
    alpha = image[:, :, 3].astype(np.float32)
    image[:, :, 3] = np.clip((alpha - 160) * 255 / 80, 0, 255).astype(np.uint8)
    image[image[:, :, 3] == 0, :3] = 0
    return image


def segment_from_reference(image, reference):
    # The reference has real alpha and nearly identical silhouettes. Use its
    # eroded interior as foreground seeds; GrabCut refines changed fur/edges.
    silhouette = (reference[:, :, 3] > 200).astype(np.uint8)
    mask = np.full(silhouette.shape, cv2.GC_BGD, np.uint8)
    expanded = cv2.dilate(silhouette, np.ones((49, 49), np.uint8))
    core = cv2.erode(silhouette, np.ones((31, 31), np.uint8))
    mask[expanded > 0] = cv2.GC_PR_BGD
    mask[silhouette > 0] = cv2.GC_PR_FGD
    mask[core > 0] = cv2.GC_FGD
    cv2.grabCut(image[:, :, :3].copy(), mask, None,
                np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64),
                5, cv2.GC_INIT_WITH_MASK)
    foreground = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(foreground)
    keep = [i for i in range(1, count) if stats[i, cv2.CC_STAT_AREA] > 500]
    alpha = np.isin(labels, keep).astype(np.uint8) * 255
    result = image.copy()
    result[:, :, 3] = alpha
    result[alpha == 0, :3] = 0
    return result


def bounds(image):
    ys, xs = np.where(image[:, :, 3] > 0)
    if len(xs) == 0:
        raise ValueError('Empty asset')
    return int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)


def crop(image, box=None):
    x0, y0, x1, y1 = box or bounds(image)
    return image[y0:y1, x0:x1].copy()


def fit(image, size, max_content, anchor=(.5, .94), scale=None):
    width, height = size
    ih, iw = image.shape[:2]
    ratio = scale or min(max_content[0]/iw, max_content[1]/ih)
    resized = cv2.resize(image, (round(iw*ratio), round(ih*ratio)), interpolation=cv2.INTER_AREA)
    rh, rw = resized.shape[:2]
    left, top = round(width*anchor[0]-rw/2), round(height*anchor[1]-rh)
    if left < 0 or top < 0 or left+rw > width or top+rh > height:
        raise ValueError('Asset exceeds canvas')
    canvas = np.zeros((height, width, 4), np.uint8)
    canvas[top:top+rh, left:left+rw] = resized
    return canvas


def export(key, image, category, source, anchor=(.5, .94), **extra):
    path = OUTPUT / f'{key}.png'
    cv2.imwrite(str(path), image, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    webp = OUTPUT / f'{key}.webp'
    cv2.imwrite(str(webp), image, [cv2.IMWRITE_WEBP_QUALITY, 92])
    alpha = image[:, :, 3]
    if not np.all(alpha[[0, -1], :] == 0) or not np.all(alpha[:, [0, -1]] == 0):
        raise ValueError(f'Nontransparent canvas edge: {key}')
    if not np.any(alpha == 255):
        raise ValueError(f'No opaque foreground: {key}')
    h, w = image.shape[:2]
    assets.append(dict(id=key, category=category, src=f'{key}.png', width=w, height=h,
                       anchor=list(anchor), bounds=list(bounds(image)), source=source,
                       transparentPercent=round(float(np.mean(alpha == 0))*100, 2),
                       bytes=path.stat().st_size, webp=f'{key}.webp',
                       webpBytes=webp.stat().st_size, **extra))


# Shared mask/crop/canvas makes Arena state geometry stable. The generated
# active illustration is aligned with the approved idle illustration first.
idle_raw = read('arena-idle-concept.png')
active_raw = read('arena-active-v2.png')
idle = clean_alpha(idle_raw)
mask = (idle[:, :, 3] > 240).astype(np.uint8)*255
warp = np.eye(2, 3, dtype=np.float32)
try:
    _, warp = cv2.findTransformECC(cv2.cvtColor(idle_raw[:, :, :3], cv2.COLOR_BGR2GRAY),
                                  cv2.cvtColor(active_raw[:, :, :3], cv2.COLOR_BGR2GRAY),
                                  warp, cv2.MOTION_TRANSLATION,
                                  (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 100, .0001),
                                  mask, 5)
except cv2.error as error:
    raise RuntimeError('Arena registration failed; inspect source images') from error
active = cv2.warpAffine(active_raw, warp, (idle.shape[1], idle.shape[0]),
                        flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP)
active[:, :, 3] = idle[:, :, 3]
active[active[:, :, 3] == 0, :3] = 0
arena_box = bounds(idle)
for name, image in [('arena-idle', idle), ('arena-active', active)]:
    export(name, fit(crop(image, arena_box), (768, 768), (700, 630)), 'building',
           'arena-idle-concept.png' if name.endswith('idle') else 'arena-active-v2.png',
           stateGroup='arena', animation='state-crossfade')

for key, source in [('hive-tower', 'hive-tower-concept.png'), ('squad-lounge', 'squad-lounge-concept.png')]:
    export(key, fit(crop(clean_alpha(read(source))), (768, 768), (700, 670)), 'building', source)

# Preserve paired poses at common scale and baseline. They are pose references,
# not a fabricated multi-direction walk cycle.
for species in ['wolf', 'fox', 'frog']:
    source = f'{species}-poses-v2.png' if species == 'wolf' else f'{species}-poses-concept.png'
    image = segment_from_reference(read(source), read('fox-poses-concept.png')) if species == 'wolf' else clean_alpha(read(source))
    half = image.shape[1]//2
    poses = [crop(image[:, :half]), crop(image[:, half:])]
    scale = min(270/max(x.shape[1] for x in poses), 328/max(x.shape[0] for x in poses))
    for pose, part in zip(['idle', 'step'], poses):
        export(f'{species}-{pose}', fit(part, (384, 384), (270, 328), scale=scale),
               'character', source, species=species, pose=pose,
               direction='front-right', animation='two-pose-preview-only')

props = clean_alpha(read('props-concept.png'))
n, labels, stats, centroids = cv2.connectedComponentsWithStats((props[:, :, 3] > 80).astype(np.uint8))
components = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 2000]
if len(components) != 8:
    raise ValueError(f'Expected eight props, found {len(components)}')
components.sort(key=lambda i: (int(centroids[i][1] > 520), centroids[i][0]))
for key, component in zip(['lamp','banner','crystal','bench','tree','pulse-terminal','replay-terminal','bridge'], components):
    part = props.copy()
    # A two-pixel mask allowance preserves the generated antialiased outline.
    selected = cv2.dilate((labels == component).astype(np.uint8), np.ones((3,3), np.uint8))
    part[:, :, 3] *= selected
    part[part[:, :, 3] == 0, :3] = 0
    export(key, fit(crop(part), (512,512), (440,440)), 'prop', 'props-concept.png')

export('plaza', fit(crop(clean_alpha(read('plaza-terrain-concept.png'))), (1536,1024), (1460,930)),
       'terrain', 'plaza-terrain-concept.png')

manifest = dict(version=1, stage='static-asset-pack', generatedFrom='approved-hive-concepts',
                coordinateSystem='normalized top-left; anchor is placement reference',
                limitations=['Character assets contain two front-right poses, not a full walk cycle.',
                             'Doors, flags and lights remain baked into building illustrations.',
                             'Scene navigation and game collision geometry are not part of this pack.'],
                arenaRegistration=warp.tolist(), assets=assets)
(OUTPUT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
print(f'Prepared and validated {len(assets)} PNGs in {OUTPUT}')
print(f'Total PNG bytes: {sum(x["bytes"] for x in assets):,}')
