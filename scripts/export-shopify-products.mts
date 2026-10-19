// Writes docs/shopify-products.csv: the site catalog in Shopify's product CSV format, for
// Shopify admin > Products > Import. Handles equal the site's product slugs, which is how
// the cart and prices find each product, so don't change handles in Shopify.
//
// Products are imported as drafts with no price: set prices (and inventory) in Shopify,
// then publish them to the Online Store / Headless channel.
//
// Usage: node scripts/export-shopify-products.mts [https://makeoveroverseas.com]
// (Node 23.6+ runs TypeScript directly.) Images are fetched by Shopify from the live site,
// so pass the URL the site is deployed at.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/data/products.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteUrl = (process.argv[2] ?? "https://makeoveroverseas.com").replace(/\/$/, "");

const columns = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Status",
];

const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const html = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const rows = products.map((p) => {
  const body = `<p><strong>${html(p.spec)}</strong></p><ul>${p.features.map((f) => `<li>${html(f)}</li>`).join("")}</ul>`;
  const record: Record<string, string> = {
    Handle: p.slug,
    Title: p.model ? `${p.name} (${p.model})` : p.name,
    "Body (HTML)": body,
    Vendor: "Makeover Overseas",
    Type: p.category,
    Tags: [p.category, p.isNew ? "New" : ""].filter(Boolean).join(", "),
    Published: "FALSE",
    "Option1 Name": "Title",
    "Option1 Value": "Default Title",
    "Variant SKU": p.model ?? "",
    // Equipment is made to order: allow orders without stock on hand.
    "Variant Inventory Policy": "continue",
    "Variant Fulfillment Service": "manual",
    "Variant Price": "",
    "Variant Requires Shipping": "TRUE",
    "Variant Taxable": "TRUE",
    "Image Src": `${siteUrl}${p.image}`,
    "Image Position": "1",
    "Image Alt Text": p.alt,
    Status: "draft",
  };
  return columns.map((c) => escape(record[c] ?? "")).join(",");
});

const out = path.join(root, "docs", "shopify-products.csv");
await writeFile(out, [columns.join(","), ...rows].join("\n") + "\n");
console.log(`Wrote ${rows.length} products to ${path.relative(root, out)}`);
