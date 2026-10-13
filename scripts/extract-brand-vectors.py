"""Extracts the vector brand masters from the logo sheet's final mark (page 3, "02").

The PDF draws the mark as: grey disc, world map, gradient "M" (a raster clipped to the
letter outline), wordmark, then the map again clipped to the region where it overlaps the
M. We keep the vectors, swap the raster for an SVG gradient sampled from it, and drop the
disc and wordmark.

Usage: python scripts/extract-brand-vectors.py <logo_makeover.pdf> assets/brand
Writes mark.svg, badge.svg and world-map.svg. Requires PyMuPDF (pip install pymupdf).
Rasters are built from these by scripts/brand-assets.mjs.
"""
import re
import sys

import fitz

pdf_path, out_dir = sys.argv[1], sys.argv[2]
page = fitz.open(pdf_path)[2]
svg = page.get_svg_image(text_as_path=True)

clips = dict(re.findall(r'<clipPath id="(clip_\d+)">\s*(<path[^>]*/>)\s*</clipPath>', svg))
groups = dict(re.findall(r'<g clip-path="url\(#(clip_\d+)\)">\n?(.*?)</g>', svg, re.S))


def paths(body):
    return re.findall(r"<path [^>]*?/>", body)


# Drawing order on the page: disc (1), map (250), wordmark (47), map again (250), so
# get_drawings() gives each path's bounds by index.
drawn = page.get_drawings()
under_rects = [d["rect"] for d in drawn[1:251]]
over_rects = [d["rect"] for d in drawn[298:548]]
over_box = fitz.Rect(555, 334, 785.5, 537.5)  # bounds of the overlap clip, top-down


def visible(r):
    return r.width > 0.6 or r.height > 0.6  # specks smaller than this never render


def _num(m):
    s = f"{float(m.group()):.1f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def trim(p):
    # 0.1 unit precision in path data (the mark is ~270 units wide); transforms keep 2.
    p = re.sub(r'd="([^"]*)"', lambda m: 'd="' + re.sub(r"-?\d+\.\d+", _num, m.group(1)) + '"', p)
    return re.sub(r"(\d+\.\d{2})\d+", r"\1", p)


under = list(zip(paths(groups["clip_1"])[1:], under_rects))  # [1:] drops the grey disc
map_under = [p for p, r in under if visible(r)]
map_over = [p for p, r in zip(paths(groups["clip_4"]), over_rects) if visible(r) and r.intersects(over_box)]
m_shape = clips["clip_2"].replace("<path ", '<path fill="url(#mo-grad)" ')

# Mark bounds: the M outline spans y 307.4-515.3 and starts at x 589.05.
band = [r for _, r in under if visible(r) and r.y0 >= 305.4 and r.y1 <= 517.3]
x0 = min(min(r.x0 for r in band), 589.05) - 1
x1 = max(r.x1 for r in band) + 1
y0, y1 = 306.4, 516.3
w, h = x1 - x0, y1 - y0

# Sampled along the diagonal of the PDF's gradient raster. The M path carries a y-flip
# transform, so the gradient runs bottom-up in its own space.
stops = [(0.45, "#122B49"), (0.60, "#394257"), (0.70, "#645B67"), (0.80, "#9D7D7D"), (0.88, "#CA998E")]
grad = '<linearGradient id="mo-grad" x1="0" y1="1" x2="1" y2="0">' + "".join(
    f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops
) + "</linearGradient>"

inner = (
    f'<defs>{grad}<clipPath id="mo-over">{trim(clips["clip_4"])}</clipPath></defs>'
    + "".join(trim(p) for p in map_under)
    + trim(m_shape)
    + '<g clip-path="url(#mo-over)">'
    + "".join(trim(p) for p in map_over)
    + "</g>"
)
mark = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}">{inner}</svg>'
open(f"{out_dir}/mark.svg", "w", encoding="utf8").write(mark)

# Badge: the mark centred on the logo's mist-grey disc, sized for small icons.
cx, cy, r = x0 + w / 2, y0 + h / 2, w / 0.76 / 2
badge = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{cx - r:.2f} {cy - r:.2f} {2 * r:.2f} {2 * r:.2f}">'
    f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="#E7E9E8"/>{inner}</svg>'
)
open(f"{out_dir}/badge.svg", "w", encoding="utf8").write(badge)

# World map cropped to the land, unfilled (black) so CSS can use it as a mask.
land = [(p, r) for p, r in under if 'fill="#122b49"' in p and visible(r)]
lx0 = min(r.x0 for _, r in land) - 0.5
ly0 = min(r.y0 for _, r in land) - 0.5
lx1 = max(r.x1 for _, r in land) + 0.5
ly1 = max(r.y1 for _, r in land) + 0.5
world = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{lx0:.1f} {ly0:.1f} {lx1 - lx0:.1f} {ly1 - ly0:.1f}">'
    + "".join(trim(p).replace('fill="#122b49"', "") for p, _ in land)
    + "</svg>"
)
open(f"{out_dir}/world-map.svg", "w", encoding="utf8").write(world)

print(f"mark {len(mark):,} B, badge {len(badge):,} B, world-map {len(world):,} B")
print(f"world-map viewBox {lx0:.1f} {ly0:.1f} {lx1 - lx0:.1f} {ly1 - ly0:.1f}")
