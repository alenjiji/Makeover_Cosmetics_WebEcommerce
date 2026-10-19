import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { products, type Product } from "@/data/products";
import { InquiryBand } from "@/components/products/InquiryBand";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductStage } from "@/components/ui/ProductStage";
import { getPriceMap } from "@/lib/commerce/shopify";
import { priceLabel } from "@/lib/commerce/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeIcon,
  CheckIcon,
  GlobeIcon,
  GraduationIcon,
  HeadsetIcon,
  LayersIcon,
  PhoneIcon,
  ShieldIcon,
  TruckIcon,
  WhatsAppIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import {
  adjacentProducts,
  categoryLabel,
  categorySlug,
  familyOf,
  getProduct,
  productDescription,
  productTitle,
  relatedProducts,
  specLabel,
} from "@/lib/catalog";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { SplitWords } from "@/components/ui/SplitWords";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const url = `/products/${product.slug}`;
  const title = productTitle(product);
  const description = productDescription(product);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [{ url: product.image, alt: product.alt }] },
    twitter: { title, description, images: [product.image] },
  };
}

const trust = [
  { icon: ShieldIcon, title: "ISO Certified", text: "Quality assured" },
  { icon: BadgeIcon, title: "CE Approved", text: "EU standards" },
  { icon: HeadsetIcon, title: "24/7 Support", text: "Always available" },
  { icon: GlobeIcon, title: `${site.claims.countries} Countries`, text: "Shipped worldwide" },
];

// Ordering terms are the same for every device (from the Contact page FAQ).
const ordering = [
  {
    icon: TruckIcon,
    title: "Delivery",
    text: "7–15 business days after order confirmation, with express shipping available.",
  },
  {
    icon: GraduationIcon,
    title: "Training",
    text: "Training materials, video tutorials and ongoing technical support.",
  },
  {
    icon: WrenchIcon,
    title: "Warranty",
    text: "Standard 1–2 year warranty, with extended cover available.",
  },
  {
    icon: LayersIcon,
    title: "OEM / ODM",
    text: "Customisation to your requirements and branding.",
  },
];

function inquiryMessage(product: Product) {
  return `Hi ${site.name}, I'm interested in the ${productTitle(product)}. Could you share pricing and availability?`;
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  // Only the params-dependent body sits behind Suspense, so the shared App Shell stays URL-independent.
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <section aria-busy="true" className="bg-white px-6 pb-16 pt-[112px] md:px-10 md:pt-[150px] xl:px-[60px]">
      <div className="mx-auto max-w-[1640px] animate-pulse">
        <div className="mb-8 h-4 w-72 rounded bg-line md:mb-10" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <div className="aspect-square rounded-[28px] bg-surface ring-1 ring-line" />
          <div className="space-y-5">
            <div className="h-4 w-40 rounded bg-line" />
            <div className="h-14 w-4/5 rounded bg-line" />
            <div className="h-20 rounded-2xl bg-blush" />
            <div className="h-24 rounded bg-surface" />
            <div className="h-14 rounded-lg bg-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const family = familyOf(product.category);
  const related = relatedProducts(product, 3);
  const { previous, next } = adjacentProducts(product);
  const inquiryHref = `/contact?product=${product.slug}#inquiry`;
  const waMessage = inquiryMessage(product);
  const prices = await getPriceMap();
  const price = prices[product.slug];
  const specs: [string, string][] = [
    [specLabel(product.spec), product.spec],
    ["Category", product.category],
    ["Range", family.label],
    ...(product.model ? [["Model", product.model] as [string, string]] : []),
    ["Certification", "ISO certified · CE approved"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        ...(product.model && { model: product.model, sku: product.model }),
        description: productDescription(product),
        image: new URL(product.image, site.url).toString(),
        category: product.category,
        url: new URL(`/products/${product.slug}`, site.url).toString(),
        brand: { "@type": "Brand", name: site.name },
        // Offer data (price, currency, stock) for search results, once priced in Shopify.
        ...(price?.purchasable && {
          offers: {
            "@type": "Offer",
            price: price.price.amount,
            priceCurrency: price.price.currencyCode,
            availability: "https://schema.org/InStock",
            url: new URL(`/products/${product.slug}`, site.url).toString(),
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: family.label, path: `/products?category=${family.slug}` },
          { name: product.name, path: `/products/${product.slug}` },
        ].map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: new URL(item.path, site.url).toString(),
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-6 pb-16 pt-[112px] md:px-10 md:pt-[150px] xl:px-[60px]">
        <div
          aria-hidden="true"
          className="world-map pointer-events-none absolute -right-[20%] -top-10 aspect-[262/124] w-[90%] bg-navy/[.04]"
        />
        <div className="relative mx-auto max-w-[1640px]">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              <li><Link href="/" className="hover:text-navy">Home</Link></li>
              <li aria-hidden="true" className="text-rose">/</li>
              <li><Link href="/products" className="hover:text-navy">Products</Link></li>
              <li aria-hidden="true" className="text-rose">/</li>
              <li>
                <Link href={`/products?category=${family.slug}`} className="hover:text-navy">
                  {family.label}
                </Link>
              </li>
              <li aria-hidden="true" className="text-rose">/</li>
              <li aria-current="page" className="font-medium text-ink">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            {/* Media */}
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
              <div className="group relative aspect-square animate-wipe-up overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#fff_0%,var(--color-surface)_100%)] ring-1 ring-navy/[.06]">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-1/4 -right-1/4 size-3/4 rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.22)_0%,transparent_70%)]"
                />
                <ProductStage
                  src={product.image}
                  alt={product.alt}
                  preload
                  disc="lg"
                  sizes="(min-width: 1400px) 680px, (min-width: 1024px) 50vw, 100vw"
                  imageClassName="animate-settle transition-transform duration-700 group-hover:scale-[1.03]"
                  className="size-full"
                />
                <span className="absolute left-5 top-5 rounded-full bg-navy px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  {product.category}
                </span>
              </div>
              <TrustTiles className="mt-4 max-lg:hidden" />
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <p className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <Link
                  href={`/products?category=${categorySlug(product.category)}`}
                  className="text-rose-deep hover:text-navy"
                >
                  {categoryLabel(product.category)}
                </Link>
                {product.model && (
                  <span className="rounded-full border border-divider px-2.5 py-1 font-mono tracking-wide text-muted">
                    Model {product.model}
                  </span>
                )}
              </p>
              <h1
                style={{ "--split-delay": "0.2s" } as React.CSSProperties}
                className="split-load mb-7 font-display text-[40px] font-bold leading-[1.08] tracking-[-0.01em] text-ink md:text-[52px] xl:text-[62px]"
              >
                <SplitWords>{product.name}</SplitWords>
              </h1>

              <p className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[34px] font-bold text-navy">{priceLabel(price)}</span>
                <span className="text-[13px] text-muted">
                  {price?.purchasable ? "excl. shipping & taxes" : "Price on request: ask us for a quote"}
                </span>
              </p>
              <div className="mb-9 rounded-[20px] border border-rose/30 bg-blush px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {specLabel(product.spec)}
                </p>
                <p className="mt-1.5 font-display text-[24px] font-bold text-navy md:text-[28px]">{product.spec}</p>
              </div>

              <h2 className="eyebrow mb-5">Key features</h2>
              <ul className="mb-10 space-y-3">
                {product.features.map((feature, i) => (
                  <li
                    key={feature}
                    style={{ "--i": i, "--rise-delay": "0.55s" } as React.CSSProperties}
                    className="flex animate-rise-in items-start gap-3 text-base leading-relaxed text-muted md:text-[17px]">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-m text-white">
                      <CheckIcon size={13} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <AddToCartButton
                  slug={product.slug}
                  name={product.name}
                  purchasable={price?.purchasable ?? false}
                  className="btn btn-primary w-full disabled:opacity-70"
                />
                <Link href={inquiryHref} className="btn btn-secondary group flex-1">
                  Send Inquiry
                  <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                <ContactChooser channel="whatsapp" message={waMessage} className="inline-flex items-center gap-1.5 font-semibold text-whatsapp underline-offset-4 hover:underline">
                  <WhatsAppIcon size={16} />
                  Ask on WhatsApp
                </ContactChooser>
                <span aria-hidden="true">·</span>
                <PhoneIcon size={15} className="text-rose-deep" />
                <ContactChooser channel="call" className="font-semibold text-ink underline-offset-4 hover:text-navy hover:underline">
                  Call us in the UAE or India
                </ContactChooser>
                <span aria-hidden="true">·</span> Replies within 24 hours
              </p>
              <TrustTiles className="mt-8 sm:grid-cols-4 lg:hidden" />

              <div className="mt-10 border-t border-divider pt-8">
                <h2 className="eyebrow mb-5">At a glance</h2>
                <dl className="divide-y divide-line overflow-hidden rounded-[20px] ring-1 ring-divider">
                  {specs.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 bg-white px-5 py-3.5 text-sm odd:bg-surface">
                      <dt className="font-medium text-muted">{label}</dt>
                      <dd className="font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ordering & support */}
      <section aria-labelledby="ordering" className="bg-surface px-6 py-16 md:px-10 md:py-20 xl:px-[60px]">
        <div className="mx-auto max-w-[1640px]">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-5">Buying from {site.name}</p>
            <h2 id="ordering" className="font-display text-[34px] font-bold tracking-[-0.01em] text-ink md:text-[46px] md:leading-tight">
              Ordering &amp; <span className="italic text-accent">Support</span>
            </h2>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line sm:grid-cols-2 xl:grid-cols-4">
            {ordering.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-white p-7">
                <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon size={20} />
                </span>
                <h3 className="mb-2 font-display text-[22px] font-bold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="related" className="bg-white px-6 py-16 md:px-10 md:py-20 xl:px-[60px]">
        <div className="mx-auto max-w-[1640px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="related" className="font-display text-[34px] font-bold tracking-[-0.01em] text-ink md:text-[46px]">
              More in <span className="italic text-accent">{family.label}</span>
            </h2>
            <Link
              href={`/products?category=${family.slug}`}
              className="group inline-flex items-center gap-1.5 border-b border-navy/20 pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:border-navy"
            >
              View all {family.label}
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} price={prices[p.slug]} />
            ))}
          </div>

          <nav aria-label="More products" className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 border-t border-divider pt-8 sm:grid-cols-2">
            {previous ? (
              <AdjacentLink product={previous} direction="previous" />
            ) : (
              <span />
            )}
            {next && <AdjacentLink product={next} direction="next" />}
          </nav>

          <div className="mt-16">
            <InquiryBand
              title={`Interested in the ${product.name}?`}
              text="Tell us about your clinic and we'll recommend the right configuration, with pricing and delivery to your country."
              whatsappMessage={inquiryMessage(product)}
            />
          </div>
        </div>
      </section>

      {/* Mobile CTA: sticks to the viewport bottom until the footer scrolls in. */}
      <div className="sticky bottom-0 z-30 flex gap-3 border-t border-divider bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgb(0_0_0/0.06)] backdrop-blur lg:hidden">
        <AddToCartButton
          compact
          slug={product.slug}
          name={product.name}
          purchasable={price?.purchasable ?? false}
          className="btn btn-primary min-w-0 flex-1 px-4 disabled:opacity-70"
        />
        <Link href={inquiryHref} aria-label="Send an inquiry about this product" className="btn btn-secondary px-5">
          Inquire
        </Link>
        <ContactChooser
          channel="whatsapp"
          message={waMessage}
          aria-label="Ask about this product on WhatsApp"
          className="flex w-14 items-center justify-center rounded-full border border-divider text-whatsapp"
        >
          <WhatsAppIcon size={22} />
        </ContactChooser>
      </div>
    </>
  );
}

function TrustTiles({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 ${className}`}>
      {trust.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 ring-1 ring-line">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-card">
            <Icon size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold leading-tight text-ink">{title}</span>
            <span className="block text-xs text-muted">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function AdjacentLink({ product, direction }: { product: Product; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group flex items-center gap-4 rounded-2xl p-4 ring-1 ring-divider transition-colors hover:bg-surface hover:ring-navy/25 ${
        isNext ? "flex-row-reverse text-right sm:col-start-2" : ""
      }`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-colors group-hover:bg-navy group-hover:text-white">
        {isNext ? <ArrowRightIcon /> : <ArrowLeftIcon />}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {isNext ? "Next" : "Previous"}
        </span>
        <span className="block font-display text-[20px] font-bold leading-snug text-ink">
          {productTitle(product)}
        </span>
      </span>
    </Link>
  );
}
