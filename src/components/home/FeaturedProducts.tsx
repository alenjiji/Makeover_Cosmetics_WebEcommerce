import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProduct } from "@/lib/catalog";
import { getPriceMap } from "@/lib/commerce/shopify";
import type { Product } from "@/data/products";

// One pick from each kind of treatment room.
const picks = [
  "4-wavelength-diode-laser-hair-removal",
  "picosecond-laser-machine-gl030",
  "7d-hifu-machine",
  "co2-fractional-laser-gl066",
  "10-in-1-hydra-skin-facial-spa",
  "dental-treatment-chair-system",
];

export async function FeaturedProducts() {
  const products = picks.map(getProduct).filter((p): p is Product => Boolean(p));
  const prices = await getPriceMap();

  return (
    <section aria-labelledby="featured" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <div className="mx-auto max-w-[1640px]">
        <Reveal variant="fade">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:mb-16 lg:flex-row lg:items-end">
            <SectionHeader
              id="featured"
              align="left"
              label="From Our Catalog"
              title={
                <>
                  Find Your Next <span className="italic text-accent">Signature Treatment</span>
                </>
              }
              subtitle="Hand-picked from our range of 40+ models, with something for every treatment room. Ask us about any of them."
            />
            <Link
              href="/products"
              className="group inline-flex shrink-0 items-center gap-2 border-b border-navy/20 pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-navy transition-colors hover:border-navy"
            >
              Browse the full catalog
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <Reveal variant="none">
          <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {products.map((product, i) => (
              <div key={product.slug} className="flex" style={{ "--i": i } as React.CSSProperties}>
                <ProductCard product={product} price={prices[product.slug]} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
