import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/lib/site";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/our-services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/global-presence", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partner-brands", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({ url: `${site.url}${path}`, priority, changeFrequency })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];
}
