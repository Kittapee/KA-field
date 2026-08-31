import sys
import pymupdf

path = sys.argv[1]
out_prefix = sys.argv[2]
zoom = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5

doc = pymupdf.open(path)
mat = pymupdf.Matrix(zoom, zoom)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=mat)
    pix.save(f"{out_prefix}-{i+1}.png")
    print(f"wrote {out_prefix}-{i+1}.png ({pix.width}x{pix.height})")
