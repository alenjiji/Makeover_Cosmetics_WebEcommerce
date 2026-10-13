# Makeover Overseas: web brand guide

Derived from the final logo (page 3, "02", of `public/logo_makeover.pdf`; exports in
`public/final/`). The earlier "initial" version in the same PDF (orbit ring, serif tagline
under the wordmark) is superseded and not used.

- **Name:** Makeover Overseas
- **Descriptor:** Export & Imports
- **Markets:** India · UAE · China
- **Motto:** Quality Beyond Borders.

All of these live in `src/lib/site.ts`.

## Logo

| Asset | Use |
|---|---|
| `assets/brand/mark.svg` | Vector master: the gradient M with the world map, transparent background |
| `assets/brand/badge.svg` | The mark on the mist disc; source for every small use and icon |
| `assets/brand/world-map.svg` | The logo's map on its own, used as a CSS mask (`world-map` utility) |
| `assets/brand/logo-final.png` | The full lockup export from the designer (wordmark included) |
| `public/brand/badge.png`, `public/brand/logo.png` | Generated rasters (navbar, footer, JSON-LD) |
| `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | Generated app icons |

- Regenerate the SVG masters from the PDF with `python scripts/extract-brand-vectors.py public/logo_makeover.pdf assets/brand`.
- Regenerate the rasters and icons with `node scripts/brand-assets.mjs`.
- On the site the logo appears as a horizontal lockup (`components/layout/Logo.tsx`): the badge, then the wordmark and descriptor set in Montserrat. The full circular lockup's text is unreadable below about 200px, so keep it for large placements only.
- **Clear space:** keep at least X around the logo, where X is about 0.19 × the disc diameter (the squares on the logo sheet).
- Don't recolour the M, stretch the mark, or set it on busy photography. On navy it keeps its mist disc.

## Colour

| Token | Hex | Role |
|---|---|---|
| `navy` | `#122B49` | Primary: the M and the map. Buttons, headings accents, links |
| `navy-deep` | `#0B1C31` | Dark sections, footer, hover state of navy |
| `mauve` | `#645B67` | Midpoint of the M's gradient |
| `rose` | `#CA998E` | End of the M's gradient. **Decorative only on light backgrounds** (2.5:1 on white); fine as text on navy (5.8:1) |
| `rose-light` | `#E3C4BB` | Accent text on navy (8.8:1) |
| `rose-deep` | `#8C5D54` | Warm accent text on light backgrounds (5.5:1 on white): eyebrows, specs |
| `mist` | `#E7E9E8` | The logo's disc: icon chips, image backdrops |
| `blush` | `#F8F0ED` | Soft warm panels |
| `surface` | `#F5F6F5` | Alternate section background |
| `ink` / `muted` | `#101B2B` / `#56616F` | Body text / secondary text (5.2:1 even on mist) |
| `whatsapp` | `#0F7A40` | WhatsApp buttons (white text 5.4:1; the stock `#25D366` fails with white) |

**The M gradient** (`bg-gradient-m`, `--gradient-m`): navy for ~45% of the run, then mauve,
ending on rose, at 135°. Use it sparingly: check marks, the scroll bar, step badges on hover.
Accent words in headings use `text-accent`: italic, with the same gradient ending on
rose-deep so it stays legible (add `text-accent-light` on dark backgrounds).

## Type

- **Display: Bodoni Moda.** A high-contrast Didone in the spirit of the logo's M. Medium (500) for big headings, semibold (600) for card titles. Display text is pinned to optical size 24 so the hairlines in `+`, `/` and `-` stay visible in product names and specs. All-word statement headlines (hero, page titles, footer motto) use `opsz-auto` for finer hairlines.
- **Text and UI: Montserrat.** This is the wordmark's typeface. Buttons, eyebrows and labels use tracked capitals (0.12 to 0.26em), echoing "EXPORT & IMPORTS". Don't uppercase product specs, because units like "nm" change meaning.

## Components

- **Buttons** (`globals.css`, `.btn` + variant): pill-shaped like the disc. `btn-primary` is navy and warms along the M gradient on hover. The other variants are `btn-secondary`, `btn-light` and `btn-outline-light` (on navy), `btn-whatsapp`, plus the sizes `btn-sm` and `btn-lg`.
- **Eyebrow** (`.eyebrow`, `.eyebrow-center`, `.eyebrow-light`): tracked capitals after a short navy-to-rose rule.
- **Dark sections** get `theme-dark` so the focus ring switches from navy to rose-light.
- **Trade routes** (`components/ui/TradeRoutes.tsx`): the logo's map with India, the UAE and China pinned. The routes draw in on scroll and a light travels along them. It is used in the footer under the motto.

## Motion

The existing motion system is kept (word-by-word heading rise, staggered cards, clip wipes,
count-ups, parallax hero cards), recoloured to the palette. Additions: the trade-route
draw and pulse, a soft "ping" on location dots, and the gradient sweep on primary buttons.
Everything respects `prefers-reduced-motion`.
