import sys, pymupdf
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
doc = pymupdf.open('public/template.pdf')
pno = int(sys.argv[1]) - 1
page = doc[pno]
H = page.rect.height
found = []
for p in page.get_drawings():
    r = p['rect']
    w, h = r.width, r.height
    if 6 <= w <= 16 and 6 <= h <= 16 and abs(w - h) < 4:
        found.append((round(H - r.y1, 1), round(r.x0, 1), round(w, 1), round(h, 1)))
found.sort(key=lambda t: (-t[0], t[1]))
print(f'-- page {pno+1}: {len(found)} checkbox-like squares --')
for by, x, w, h in found:
    print(f'   x {x:6.1f}  bottomY {by:6.1f}  {w}x{h}')
# large rects (map frame etc.)
big = [p['rect'] for p in page.get_drawings() if p['rect'].width > 100 and p['rect'].height > 60]
for r in big:
    print(f'-- BIG rect x {r.x0:.1f}->{r.x1:.1f}  bottomY {H-r.y1:.1f}->{H-r.y0:.1f}  ({r.width:.1f}x{r.height:.1f})')
