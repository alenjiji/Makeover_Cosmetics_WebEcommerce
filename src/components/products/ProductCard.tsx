import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = {
  product: Product;
  headingLevel?: "h2" | "h3";
};

export function ProductCard({ product, headingLevel: Heading = "h3" }: Props) {
  const href = `/products/${product.slug}`;

  return (
    <article data-glow className="group relative flex w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-card ring-1 ring-navy/[.06] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="relative aspect-[10/9] border-b border-line bg-[radial-gradient(circle_at_50%_45%,#fff_0%,#fff_42%,var(--color-mist)_100%)]">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
          className="object-contain p-8 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex gap-1.5">
          <span className="rounded-full bg-navy px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
            {product.category}
          </span>
          {product.isNew && (
            <span className="rounded-full bg-rose-light px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-deep">
              New
            </span>
          )}
        </span>
        {product.model && (
          <span className="absolute right-4 top-4 rounded-full border border-divider bg-white/80 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-muted backdrop-blur">
            {product.model}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <Heading className="mb-2 font-display text-[22px] font-semibold leading-snug tracking-[-0.01em] text-ink">
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
              className="relative pl-5 text-sm leading-[1.7] text-muted before:absolute before:left-0 before:top-[11px] before:h-px before:w-2.5 before:bg-gradient-to-r before:from-navy before:to-rose"
            >
              {feature}
            </li>
          ))}
        </ul>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden="true"
            className="flex items-center justify-center rounded-full bg-surface px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink ring-1 ring-divider transition-colors hover:bg-mist"
          >
            View Details
          </Link>
          <Link
            href={`/contact?product=${product.slug}#inquiry`}
            aria-label={`Inquire about ${product.name}${product.model ? ` ${product.model}` : ""}`}
            className="group/btn flex items-center justify-center gap-2 rounded-full bg-navy px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-navy-deep"
          >
            Inquire Now
            <ArrowRightIcon className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
