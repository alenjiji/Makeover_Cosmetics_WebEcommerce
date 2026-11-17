import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductStage } from "@/components/ui/ProductStage";
import { priceLabel, type PriceMap } from "@/lib/commerce/types";
import type { CatalogItem } from "@/lib/catalog";
import { sellsOnline } from "@/lib/catalog-filters";

type Props = {
  product: CatalogItem;
  headingLevel?: "h2" | "h3";
  /** Shopify price for this product, when the store is connected. */
  price?: PriceMap[string];
  /** "compact": catalog grid (two across on phones); "full": feature cards with the key features. */
  variant?: "full" | "compact";
};

const actionClass =
  "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-2 py-3 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] transition-colors";
const primaryClass = `${actionClass} bg-navy text-white hover:bg-navy-deep disabled:opacity-70`;
const secondaryClass = `${actionClass} bg-white text-ink ring-1 ring-divider hover:ring-navy`;

/**
 * Catalog card. Professional machines (inquiry only) stand on the logo's disc and lead to an
 * inquiry; products sold online show their photo, price and Add to Cart.
 */
export function ProductCard({ product, headingLevel: Heading = "h3", price, variant = "full" }: Props) {
  const href = `/products/${product.slug}`;
  const online = sellsOnline(product);
  const compact = variant === "compact";
  const inquiryHref = `/contact?product=${product.slug}#inquiry`;

  const priceText = online ? priceLabel(price) : "On request";
  const inquire = (
    <Link
      href={inquiryHref}
      aria-label={`Send an inquiry about ${product.name}${product.model ? ` ${product.model}` : ""}`}
      className={online ? secondaryClass : primaryClass}
    >
      {online ? "Inquire" : "Send Inquiry"}
    </Link>
  );
  const addToCart = (
    <AddToCartButton
      compact
      slug={product.slug}
      name={product.name}
      image={product.image}
      purchasable={price?.purchasable ?? false}
      className={primaryClass}
    />
  );

  return (
    <article
      data-glow
      className={`group relative flex w-full flex-col overflow-hidden bg-white shadow-card ring-1 ring-navy/[.06] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover ${
        compact ? "rounded-[18px] md:rounded-[22px]" : "rounded-[24px]"
      }`}
    >
      <ProductStage
        src={product.image}
        alt={product.alt}
        plain={online}
        sizes={compact ? "(min-width: 1280px) 330px, (min-width: 768px) 30vw, 48vw" : "(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"}
        imageClassName="transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        className={`${compact ? "aspect-square" : "aspect-[10/9]"} ${online ? "" : "bg-[linear-gradient(180deg,#fff_0%,var(--color-surface)_100%)]"}`}
      >
        <span className={`absolute flex flex-wrap gap-1.5 ${compact ? "left-2.5 top-2.5" : "left-4 top-4"}`}>
          {!compact && (
            <span className="rounded-full bg-navy px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              {product.category}
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-rose-light px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-deep">
              New
            </span>
          )}
        </span>
        {product.model && !compact && (
          <span className="absolute right-4 top-4 rounded-full border border-divider bg-white/85 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-muted backdrop-blur">
            {product.model}
          </span>
        )}
      </ProductStage>

      <div className={`flex flex-1 flex-col border-t border-line ${compact ? "p-3.5 md:p-5" : "p-6 md:p-7"}`}>
        {compact && (
          <p className="mb-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted md:text-[11px]">
            {product.category}
          </p>
        )}
        <Heading
          className={`font-display font-bold leading-snug tracking-[-0.01em] text-ink ${
            compact ? "mb-1.5 line-clamp-2 text-[15px] md:text-[18px]" : "mb-2 text-[22px]"
          }`}
        >
          {/* Stretched link: the whole card opens the detail page. */}
          <Link href={href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none group-has-[:focus-visible]:underline">
            {product.name}
          </Link>
        </Heading>
        {/* Not uppercased: specs carry units like "nm" and "mm". */}
        <p
          className={`font-semibold tracking-[0.02em] text-rose-deep ${
            compact ? "mb-3 line-clamp-2 text-[12px] md:text-[13px]" : "mb-5 text-[13px]"
          }`}
        >
          {product.spec}
        </p>
        {!compact && (
          <ul className="mb-6 flex-1 space-y-2">
            {product.features.slice(0, 3).map((feature) => (
              <li
                key={feature}
                className="relative pl-5 text-[15px] leading-[1.65] text-muted before:absolute before:left-0 before:top-[11px] before:h-px before:w-2.5 before:bg-gradient-to-r before:from-navy before:to-rose"
              >
                {feature}
              </li>
            ))}
          </ul>
        )}
        <p
          className={`flex items-baseline justify-between gap-2 border-t border-dashed border-divider ${
            compact ? "mb-3 mt-auto pt-3" : "mb-4 pt-4"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted md:text-[11px]">
            Price
          </span>
          <span className={`font-display font-bold text-navy ${compact ? "text-[16px] md:text-[20px]" : "text-[22px]"}`}>
            {priceText}
          </span>
        </p>
        {compact ? (
          <div className="grid">{online ? addToCart : inquire}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {online ? (
              <>
                {addToCart}
                {inquire}
              </>
            ) : (
              <>
                {inquire}
                <Link href={href} className={`${secondaryClass}`} aria-label={`View ${product.name}`}>
                  View Details
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
