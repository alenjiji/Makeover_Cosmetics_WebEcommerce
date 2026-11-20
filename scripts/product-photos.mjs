// Prepares a product's photos for the website: resizes to 1000 px max, converts to WebP and saves them
// as public/images/products/supplies/<slug>/1.webp, 2.webp … in the order given (1 = main photo).
// Prints the `image` and `gallery` lines to paste into src/data/supplies.ts.
//
// Usage: npm run product:photos -- <slug> <photo> [more photos…]
// e.g.   npm run product:photos -- led-face-mask ~/Downloads/mask-front.jpg ~/Downloads/mask-side.png
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const [slug, ...files] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || files.length === 0) {
  console.error("Usage: npm run product:photos -- <slug> <photo> [more photos…]");
  console.error("The slug is lowercase words joined by hyphens, e.g. led-face-mask. It becomes the page address");
  console.error("(/products/led-face-mask) and must be the product's URL handle in Shopify.");
  process.exit(1);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, "public", "images", "products", "supplies", slug);
await mkdir(dir, { recursive: true });
// Replace any earlier photos for this product.
for (const old of await readdir(dir)) await rm(path.join(dir, old));

const urls = [];
for (const [i, file] of files.entries()) {
  const out = path.join(dir, `${i + 1}.webp`);
  const info = await sharp(file)
    .rotate() // honour the camera's orientation
    .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" }) // transparent PNGs on white
    .webp({ quality: 80 })
    .toFile(out);
  urls.push(`/images/products/supplies/${slug}/${i + 1}.webp`);
  console.log(`✓ ${path.basename(file)} → ${path.relative(root, out)} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

const [main, ...gallery] = urls;
console.log("\nPaste into the product's entry in src/data/supplies.ts:\n");
console.log(`    image: "${main}",`);
if (gallery.length) console.log(`    gallery: [${gallery.map((u) => `"${u}"`).join(", ")}],`);
