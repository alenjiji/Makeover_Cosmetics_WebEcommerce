import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView, ProductCatalog } from "@/components/products/ProductCatalog";
import { InquiryBand } from "@/components/products/InquiryBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our medical aesthetic and dental devices: diode, Nd:YAG, picosecond and CO2 lasers, HIFU, RF microneedling, cold plasma, EMS sculpting, hydra facial and dental units. ISO certified, CE approved.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

const trust = ["ISO Certified", "CE Approved", `${site.claims.countries} Countries`, "<24h Response"];

export default function ProductsPage() {
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
        <ul className="mt-9 flex animate-rise-in flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.15em] [--rise-delay:.6s] text-muted">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="size-1.5 rotate-45 bg-rose" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </PageHeader>

      <section aria-label="Product catalog" className="bg-surface px-6 pb-20 md:px-10 md:pb-24 xl:px-[60px]">
        <Suspense fallback={<CatalogView categoryParam={null} query="" />}>
          <ProductCatalog />
        </Suspense>
        <div className="mx-auto mt-20 max-w-[1640px] md:mt-24">
          <InquiryBand />
        </div>
      </section>
    </>
  );
}
