// Converts legacy PNGs in ../public_html, and crops from the brochure pages in assets/source,
// into resized WebP files under public/images. Brochure sources stay out of public/ on purpose.
// Usage: node scripts/optimize-images.mjs
import { readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const legacy = path.resolve(root, "..", "public_html");
const brochures = path.join(root, "assets", "source");
const products = JSON.parse(
  await readFile(path.join(root, "docs", "products.source.json"), "utf8"),
);

const toKebab = (file) =>
  path
    .parse(file)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const jobs = [
  ...products.map((p) => ({
    src: p.image,
    out: `products/${toKebab(p.image)}.webp`,
    maxWidth: 1000,
    trim: true,
  })),
  // About page: factory, production floor and testing bench.
  { src: "fac.png", out: "site/about-factory.webp", maxWidth: 900, trim: false },
  { src: "prod.png", out: "site/about-production.webp", maxWidth: 900, trim: false },
  { src: "emp.png", out: "site/about-testing.webp", maxWidth: 900, trim: false },
];

// Regions are fractions of the page: [left, top, width, height].
const crops = [
  {
    src: "diode-yag/1-01.jpg",
    region: [0.13, 0.115, 0.43, 0.885],
    // Fade the top edge into the background to hide the brochure's own logo.
    fadeTop: 0.075,
    out: "home/hero-2in1.webp",
    maxWidth: 1200,
  },
  { src: "diode-yag/1-02.jpg", region: [0.536, 0.496, 0.423, 0.183], out: "home/diode-heads.webp", maxWidth: 1200 },
  {
    src: "diode-yag/1-08.jpg",
    region: [0.691, 0.196, 0.273, 0.751],
    // The brochure page has a faint pink pattern behind the machine; push it to pure white.
    whiten: 200,
    out: "products/diode-yag-2in1.webp",
    maxWidth: 1000,
    trim: true,
  },
  { src: "emrf-m8/1-01.jpg", region: [0.257, 0.232, 0.553, 0.482], out: "products/emrf-m8.webp", maxWidth: 1000, trim: true },
  { src: "fusion-cold-plasma/1-08.jpg", region: [0.257, 0.38, 0.463, 0.311], out: "products/fusion-cold-plasma.webp", maxWidth: 1000, trim: true },
  { src: "fusion-cold-plasma/1-08.jpg", region: [0.0746, 0.7155, 0.404, 0.242], out: "home/plasma-probes.webp", maxWidth: 1000 },
  { src: "diode-laser-manual/1-01.jpg", region: [0.167, 0.359, 0.721, 0.491], out: "products/diode-portable.webp", maxWidth: 1000, trim: true },
];

let before = 0;
let after = 0;
const rows = [];

const all = [
  ...jobs.map((job) => ({ ...job, input: path.join(legacy, job.src) })),
  ...crops.map((job) => ({ ...job, input: path.join(brochures, job.src) })),
];

for (const job of all) {
  const input = job.input;
  const output = path.join(root, "public", "images", job.out);
  await mkdir(path.dirname(output), { recursive: true });

  let pipeline = sharp(input);
  if (job.region) {
    const { width, height } = await sharp(input).metadata();
    const [l, t, w, h] = job.region;
    const region = {
      left: Math.round(l * width),
      top: Math.round(t * height),
      width: Math.round(w * width),
      height: Math.round(h * height),
    };
    pipeline = sharp(await pipeline.extract(region).toBuffer());
    if (job.whiten) {
      const { data, info } = await pipeline.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 3) {
        const min = Math.min(data[i], data[i + 1], data[i + 2]);
        if (min < job.whiten) continue;
        // Ramp from the threshold to pure white so edges stay soft.
        const t = Math.min(1, (min - job.whiten) / 16);
        for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] + (255 - data[i + c]) * t);
      }
      pipeline = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
    }
    if (job.fadeTop) {
      const band = Math.round(job.fadeTop * region.height);
      // Background colour sampled just below the band, near the left edge.
      const { data } = await pipeline
        .clone()
        .extract({ left: 4, top: band + 4, width: 1, height: 1 })
        .raw()
        .toBuffer({ resolveWithObject: true });
      const rgb = `rgb(${data[0]},${data[1]},${data[2]})`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${region.width}" height="${band}">
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stop-color="${rgb}" stop-opacity="1"/>
          <stop offset="1" stop-color="${rgb}" stop-opacity="0"/>
        </linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#g)"/></svg>`;
      pipeline = sharp(await pipeline.composite([{ input: Buffer.from(svg), left: 0, top: 0 }]).toBuffer());
  }
  }
  // Trim the white/transparent padding so every product sits in its frame the same way.
  if (job.trim) pipeline = pipeline.trim({ background: "#ffffff", threshold: 12 });
  const info = await pipeline
    .resize({ width: job.maxWidth, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(output);

  const inSize = (await stat(input)).size;
  before += inSize;
  after += info.size;
  rows.push(
    `${job.src.padEnd(30)} ${(inSize / 1024).toFixed(0).padStart(6)} KB -> ${(info.size / 1024)
      .toFixed(0)
      .padStart(4)} KB  ${info.width}x${info.height}  ${job.out}`,
  );
}

console.log(rows.join("\n"));
console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB`,
);
