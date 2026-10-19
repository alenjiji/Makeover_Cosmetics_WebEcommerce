import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Product images in Shopify carts are served from Shopify's CDN.
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }] },
  partialPrefetching: true,
  // Self-hosted behind nginx (Hostinger VPS / Node.js hosting): turn off proxy buffering so
  // streamed and partially prerendered pages arrive progressively. Harmless on Netlify.
  async headers() {
    return [{ source: "/:path*{/}?", headers: [{ key: "X-Accel-Buffering", value: "no" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
