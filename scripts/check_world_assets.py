"""Validate the static pack and render light/dark/checker inspection sheets."""
from pathlib import Path
import json
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT/'public/world-assets/v1'
QA = ROOT/'artifacts/world-assets-v1'
manifest = json.loads((PACK/'manifest.json').read_text())
assets = manifest['assets']
assert len(assets) == 19
assert len({a['id'] for a in assets}) == 19
images = {}
for asset in assets:
    image = cv2.imread(str(PACK/asset['src']), cv2.IMREAD_UNCHANGED)
    assert image.shape == (asset['height'], asset['width'], 4), asset['id']
    alpha = image[:, :, 3]
    assert np.all(alpha[[0,-1], :] == 0) and np.all(alpha[:,[0,-1]] == 0), asset['id']
    assert np.mean(alpha == 0) > .15 and np.mean(alpha == 255) > .01, asset['id']
    webp = cv2.imread(str(PACK/asset['webp']), cv2.IMREAD_UNCHANGED)
    assert webp.shape == image.shape, asset['id']
    assert np.array_equal(alpha, webp[:, :, 3]), f'WebP alpha differs: {asset["id"]}'
    images[asset['id']] = image
assert np.array_equal(images['arena-idle'][:,:,3], images['arena-active'][:,:,3])
assert np.mean(np.abs(images['arena-idle'].astype(float)-images['arena-active'].astype(float))) > .1
for species in ['wolf','fox','frog']:
    assert images[f'{species}-idle'].shape == images[f'{species}-step'].shape == (384,384,4)
    assert np.array_equal(images[f'{species}-idle'], images[f'{species}-step']) is False

for theme, color in [('light',235),('dark',24),('checker',40)]:
    canvas = np.full((340*5,320*4,3),color,np.uint8)
    if theme == 'checker':
        yy,xx = np.indices(canvas.shape[:2])
        canvas[(xx//16+yy//16)%2==0] = 80
    for index,asset in enumerate(assets):
        image = images[asset['id']]
        ratio = min(290/image.shape[1],290/image.shape[0])
        image = cv2.resize(image,(round(image.shape[1]*ratio),round(image.shape[0]*ratio)),interpolation=cv2.INTER_AREA)
        x = index%4*320+(320-image.shape[1])//2
        y = index//4*340+16
        alpha = image[:,:,3:4].astype(float)/255
        region = canvas[y:y+image.shape[0],x:x+image.shape[1]]
        region[:] = (image[:,:,:3]*alpha+region*(1-alpha)).astype(np.uint8)
        ink=(30,30,30) if theme=='light' else (225,225,225)
        cv2.putText(canvas,asset['id'],(index%4*320+15,index//4*340+325),cv2.FONT_HERSHEY_SIMPLEX,.6,ink,1,cv2.LINE_AA)
    cv2.imwrite(str(QA/f'qa-contact-{theme}.png'),canvas)

report = dict(passed=True,assetCount=len(assets),pngBytes=sum(a['bytes'] for a in assets),
              webpBytes=sum(a['webpBytes'] for a in assets),
              checks=['Unique manifest IDs and expected asset count','RGBA format and declared dimensions',
                      'Fully transparent canvas borders','Visible opaque foreground',
                      'PNG/WebP alpha equivalence','Identical Arena masks with distinct rendered states',
                      'Paired character canvas dimensions and distinct poses'],
              visualSheets=['qa-contact-light.png','qa-contact-dark.png','qa-contact-checker.png'])
(QA/'qa-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
