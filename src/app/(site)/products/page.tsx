import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView, ProductCatalog } from "@/components/products/ProductCatalog";
import { InquiryBand } from "@/components/products/InquiryBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPriceMap } from "@/lib/commerce/shopify";
import { products } from "@/data/products";
import { toCatalogItem } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Professional aesthetic machines on inquiry (diode, Nd:YAG, picosecond and CO2 lasers, HIFU, RF microneedling, EMS sculpting) plus facial devices, derma pens, cartridges, PMU supplies, skin-care consumables, massagers and salon furniture to order online.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

// Only the fields the cards, filters and search use reach the browser.
const items = products.map(toCatalogItem);

const trust = ["Machines on Inquiry", "Supplies to Order Online", `${site.claims.countries} Countries`, "<24h Response"];

export default async function ProductsPage() {
  const prices = await getPriceMap();
  return (
    <>
      <PageHeader
        badge="Our Solutions"
        title={
          <>
            Comprehensive Product <span className="italic text-accent">Range</span>
          </>
        }
        subtitle="After 16 years of development, our products have won a good reputation both in domestic and overseas markets"
      >
        <ul className="mt-9 flex animate-rise-in flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.15em] [--rise-delay:.6s] text-white/75">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="size-1.5 rotate-45 bg-rose" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </PageHeader>

      <section aria-label="Product catalog" className="bg-surface px-6 pb-20 md:px-10 md:pb-24 xl:px-[60px]">
        <Suspense fallback={<CatalogView items={items} prices={prices} categoryParam={null} query="" />}>
          <ProductCatalog items={items} prices={prices} />
        </Suspense>
        <div className="mx-auto mt-20 max-w-[1640px] md:mt-24">
          <InquiryBand />
        </div>
      </section>
    </>
  );
}
