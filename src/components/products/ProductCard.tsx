import Link from "next/link";
import type { Product } from "@/data/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductStage } from "@/components/ui/ProductStage";
import { priceLabel, type PriceMap } from "@/lib/commerce/types";

type Props = {
  product: Product;
  headingLevel?: "h2" | "h3";
  /** Shopify price for this product, when the store is connected. */
  price?: PriceMap[string];
};

const actionClass =
  "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-3 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] transition-colors";

/** Catalog card: the product on the logo's disc, its spec and features, then cart and inquiry actions. */
export function ProductCard({ product, headingLevel: Heading = "h3", price }: Props) {
  const href = `/products/${product.slug}`;

  return (
    <article
      data-glow
      className="group relative flex w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-card ring-1 ring-navy/[.06] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <ProductStage
        src={product.image}
        alt={product.alt}
        sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
        imageClassName="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        className="aspect-[10/9] bg-[linear-gradient(180deg,#fff_0%,var(--color-surface)_100%)]"
      >
        <span className="absolute left-4 top-4 flex gap-1.5">
          <span className="rounded-full bg-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            {product.category}
          </span>
          {product.isNew && (
            <span className="rounded-full bg-rose-light px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-deep">
              New
            </span>
          )}
        </span>
        {product.model && (
          <span className="absolute right-4 top-4 rounded-full border border-divider bg-white/85 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-muted backdrop-blur">
            {product.model}
          </span>
        )}
      </ProductStage>

      <div className="flex flex-1 flex-col border-t border-line p-6 md:p-7">
        <Heading className="mb-2 font-display text-[22px] font-bold leading-snug tracking-[-0.01em] text-ink">
          {/* Stretched link: the whole card opens the detail page. */}
          <Link href={href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none group-has-[:focus-visible]:underline">
            {product.name}
          </Link>
        </Heading>
        {/* Not uppercased: specs carry units like "nm" and "mm". */}
        <p className="mb-5 text-[13px] font-semibold tracking-[0.02em] text-rose-deep">{product.spec}</p>
        <ul className="mb-6 flex-1 space-y-2">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="relative pl-5 text-[15px] leading-[1.65] text-muted before:absolute before:left-0 before:top-[11px] before:h-px before:w-2.5 before:bg-gradient-to-r before:from-navy before:to-rose"
            >
              {feature}
            </li>
          ))}
        </ul>
        <p className="mb-4 flex items-baseline justify-between border-t border-dashed border-divider pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
            {price?.purchasable ? "From" : "Price"}
          </span>
          <span className="font-display text-[22px] font-bold text-navy">{priceLabel(price)}</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <AddToCartButton
            compact
            slug={product.slug}
            name={product.name}
            purchasable={price?.purchasable ?? false}
            className={`${actionClass} bg-navy text-white hover:bg-navy-deep disabled:opacity-70`}
          />
          <Link
            href={`/contact?product=${product.slug}#inquiry`}
            aria-label={`Inquire about ${product.name}${product.model ? ` ${product.model}` : ""}`}
            className={`${actionClass} bg-white text-ink ring-1 ring-divider hover:ring-navy`}
          >
            Inquire
          </Link>
        </div>
      </div>
    </article>
  );
}
