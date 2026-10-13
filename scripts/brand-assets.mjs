// Builds the site's logo rasters and app icons from the masters in assets/brand
// (see scripts/extract-brand-vectors.py for where the SVGs come from).
// Usage: node scripts/brand-assets.mjs
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const brand = path.join(root, "assets", "brand");
const pub = path.join(root, "public", "brand");
const app = path.join(root, "src", "app");
const MIST = "#E7E9E8";

await mkdir(pub, { recursive: true });

const badgeSvg = await readFile(path.join(brand, "badge.svg"));
const markSvg = await readFile(path.join(brand, "mark.svg"));

/** Renders an SVG to a square PNG buffer of the given size. */
const renderSquare = (svg, size) =>
  sharp(svg, { density: Math.max(72, (size / 360) * 72 * 4) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

/** A circle mask, slightly inset so no white fringe from the source survives. */
const circleMask = (size, inset = 0) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - inset}"/></svg>`,
  );

// 1. Badge (mark on the mist disc) for the navbar, footer and favicons.
await writeFile(path.join(pub, "badge.png"), await renderSquare(badgeSvg, 512));

// 2. Full final logo with its wordmark, corners made transparent (the export has white corners).
const LOGO = 1024;
const logo = await sharp(path.join(brand, "logo-final.png"))
  .resize(LOGO, LOGO, { fit: "fill" })
  .ensureAlpha()
  .composite([{ input: circleMask(LOGO, 3), blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile(path.join(pub, "logo.png"), logo);

// 3. Landscape lockup (mark beside the wordmark) for the navbar, trimmed to the artwork.
const LANDSCAPE_W = 1400;
const landscape = await sharp(path.join(brand, "logo-landscape-final.png")).trim().toBuffer();
await sharp(landscape)
  .resize({ width: LANDSCAPE_W })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(pub, "logo-landscape.png"));

// 4. World map, used as a CSS mask.
await copyFile(path.join(brand, "world-map.svg"), path.join(pub, "world-map.svg"));

// 5. App icons. favicon.ico holds PNG frames, which every current browser accepts.
const icoSizes = [16, 32, 48];
const frames = await Promise.all(icoSizes.map((size) => renderSquare(badgeSvg, size)));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header.writeUInt8(icoSizes[i], entry);
  header.writeUInt8(icoSizes[i], entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(path.join(app, "favicon.ico"), Buffer.concat([header, ...frames]));
await writeFile(path.join(app, "icon.png"), await renderSquare(badgeSvg, 192));

// Apple touch icons are shown as rounded squares, so fill the whole tile with the disc colour.
const APPLE = 180;
const mark = await sharp(markSvg, { density: 300 }).resize(Math.round(APPLE * 0.74)).png().toBuffer();
await sharp({ create: { width: APPLE, height: APPLE, channels: 4, background: MIST } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toFile(path.join(app, "apple-icon.png"));

console.log("Brand assets written to public/brand and src/app.");
