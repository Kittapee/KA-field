import sys, pymupdf
import io
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
doc = pymupdf.open('public/template.pdf')
pno = int(sys.argv[1]) - 1
page = doc[pno]
H = page.rect.height
d = page.get_text('rawdict')
rows = []
for b in d['blocks']:
    for l in b.get('lines', []):
        for s in l['spans']:
            txt = ''.join(c['c'] for c in s['chars'])
            x0, y0, x1, y1 = s['bbox']
            rows.append((round(y0, 1), round(x0, 1), round(x1, 1), round(H - y1, 1), round(H - y0, 1), round(s['size'], 1), txt))
rows.sort()
prev_y = None
for y0, x0, x1, by, ty, sz, txt in rows:
    if prev_y is not None and abs(y0 - prev_y) > 0.5:
        print('-' * 100)
    prev_y = y0
    dots = txt.count('.')
    tag = f'DOTS={dots}' if dots >= 3 else ''
    print(f'x {x0:6.1f}->{x1:6.1f}  baseY {by:6.1f}  topY {ty:6.1f}  sz {sz:4.1f} {tag:9s} {txt!r}')
