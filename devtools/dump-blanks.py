import sys, pymupdf
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DOTS = set('.…')
doc = pymupdf.open('public/template.pdf')
pno = int(sys.argv[1]) - 1
page = doc[pno]
H = page.rect.height
d = page.get_text('rawdict')

lines = []
for b in d['blocks']:
    for l in b.get('lines', []):
        chars = []
        for s in l['spans']:
            for c in s['chars']:
                chars.append((c['c'], c['bbox'], c['origin'], s['size']))
        if chars:
            lines.append((min(c[2][1] for c in chars), chars))
lines.sort(key=lambda t: t[0])

for _, chars in lines:
    runs = []
    i = 0
    n = len(chars)
    while i < n:
        if chars[i][0] in DOTS:
            j = i
            while j < n and (chars[j][0] in DOTS or (chars[j][0] == ' ' and j + 1 < n and chars[j + 1][0] in DOTS)):
                j += 1
            runs.append((i, j))
            i = j
        else:
            i += 1
    if not runs:
        continue
    print('=' * 96)
    print('LINE:', ''.join(c[0] for c in chars).strip()[:150])
    for (i, j) in runs:
        label = ''.join(c[0] for c in chars[max(0, i - 26):i]).strip()
        x0 = chars[i][1][0]
        x1 = chars[j - 1][1][2]
        base = H - chars[i][2][1]
        sz = chars[i][3]
        print(f'   x {x0:6.1f} -> {x1:6.1f}  (w {x1-x0:5.1f})  baseY {base:6.1f}  sz {sz:4.1f}   after: {label!r}')
