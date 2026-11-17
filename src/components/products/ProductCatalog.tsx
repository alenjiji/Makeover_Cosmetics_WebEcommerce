"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CatalogItem } from "@/lib/catalog";
import {
  categoryLabel,
  categorySlug,
  families,
  matchesFilter,
  matchesQuery,
  resolveFilter,
  type Family,
} from "@/lib/catalog-filters";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { isListed, type PriceMap } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

/** Cards rendered per step; more are added as the visitor nears the end of the list. */
const PAGE = 24;

type CatalogProps = { items: CatalogItem[]; prices?: PriceMap };

/** Reads `?category=` and `?q=` from the URL; must render inside <Suspense>. */
export function ProductCatalog({ items, prices = {} }: CatalogProps) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  // The native History API keeps useSearchParams in sync without a server round trip.
  const updateUrl = (key: "category" | "q", value: string | null, mode: "push" | "replace") => {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const search = next.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };

  return (
    <CatalogView
      items={items}
      prices={prices}
      categoryParam={params.get("category")}
      query={query}
      onCategory={(value) => {
        updateUrl("category", value, "push");
        // Bring the start of the results into view once a category is picked.
        const top = document.getElementById("catalog");
        if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView();
      }}
      onQuery={(value) => {
        setQuery(value);
        updateUrl("q", value.trim() || null, "replace");
      }}
    />
  );
}

type ViewProps = CatalogProps & {
  categoryParam: string | null;
  query: string;
  onCategory?: (value: string | null) => void;
  onQuery?: (value: string) => void;
};

/** Stateless catalog UI. Rendered without handlers it is the prerendered (SEO) fallback. */
export function CatalogView({ items, prices = {}, categoryParam, query, onCategory, onQuery }: ViewProps) {
  const filter = resolveFilter(categoryParam);
  const activeFamily = filter.kind === "all" ? undefined : filter.family;
  // Products set to Draft or Archived in Shopify drop out of the catalog, and so do empty ranges.
  const listed = items.filter((p) => isListed(p.slug, prices));
  const ranges = families
    .map((family) => ({ family, items: listed.filter((p) => family.categories.includes(p.category)) }))
    .filter((r) => r.items.length > 0);
  const results = listed.filter((p) => matchesFilter(p, filter) && matchesQuery(p, query));

  // Show the list a page at a time; a new filter or search starts again from the first page.
  const view = `${categoryParam ?? ""}|${query.trim()}`;
  const [page, setPage] = useState({ view, limit: PAGE });
  const limit = page.view === view ? page.limit : PAGE;
  if (page.view !== view) setPage({ view, limit: PAGE });
  const visible = results.slice(0, limit);
  const remaining = results.length - visible.length;
  const showMore = () => setPage({ view, limit: limit + PAGE });

  // Load the next page shortly before the visitor reaches the end of the list.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || remaining <= 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((p) => ({ view: p.view, limit: p.limit + PAGE }));
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [remaining, view]);

  const select = (value: string | null) => onCategory?.(value);
  const clearAll = () => {
    onQuery?.("");
    select(null);
  };
  const isDefaultView = filter.kind === "all" && !query.trim();

  return (
    <>
      {/* Shop by category */}
      <section aria-labelledby="shop-categories" className="mx-auto max-w-[1640px] pt-10 md:pt-14">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="shop-categories" className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink md:text-[28px]">
            Shop by Category
          </h2>
          <p className="text-[13px] text-muted">{ranges.length} categories</p>
        </div>
        <div
          role="group"
          aria-label="Product categories"
          className="-mx-6 grid grid-cols-none auto-cols-[188px] grid-flow-col grid-rows-2 gap-2.5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid-flow-row md:grid-cols-4 md:grid-rows-none md:px-0 xl:grid-cols-6"
        >
          <CategoryTile
            label="All Products"
            note={`${listed.length} products`}
            image={listed[0]?.image}
            href="/products"
            pressed={filter.kind === "all"}
            onSelect={onCategory ? () => select(null) : undefined}
          />
          {ranges.map(({ family, items: inRange }) => (
            <CategoryTile
              key={family.slug}
              label={family.label}
              note={`${inRange.length} · ${family.ordering === "online" ? "Shop online" : "On inquiry"}`}
              image={inRange[0].image}
              href={`/products?category=${family.slug}`}
              pressed={activeFamily?.slug === family.slug}
              onSelect={onCategory ? () => select(family.slug) : undefined}
            />
          ))}
        </div>
      </section>

      {/* Toolbar: sub-categories, search and result count */}
      <div id="catalog" className="scroll-mt-[var(--nav-h)]" />
      <div className="relative z-20 -mx-6 mt-8 border-y border-line bg-surface/90 px-6 py-3 backdrop-blur-xl md:sticky md:top-[var(--nav-h)] md:-mx-10 md:px-10 xl:-mx-[60px] xl:px-[60px]">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p aria-live="polite" className="shrink-0 text-sm text-muted">
              <strong className="font-semibold text-ink">{results.length}</strong>{" "}
              {results.length === 1 ? "product" : "products"}
              {filter.kind === "family" && <> in {filter.family.label}</>}
              {filter.kind === "category" && <> in {categoryLabel(filter.category)}</>}
              {query.trim() && <> matching “{query.trim()}”</>}
            </p>
            {activeFamily && activeFamily.categories.length > 1 && (
              <SubCategories family={activeFamily} filter={filter} listed={listed} onSelect={onCategory ? select : undefined} />
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isDefaultView && onCategory && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-rose-deep hover:text-navy"
              >
                <CloseIcon size={14} />
                Clear
              </button>
            )}
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Search products</span>
              <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                readOnly={!onQuery}
                onChange={(e) => onQuery?.(e.target.value)}
                placeholder="Search products, models, specs"
                className="h-11 w-full rounded-full border border-divider bg-white pl-11 pr-4 text-sm text-ink placeholder:text-muted/80 focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className="mx-auto max-w-[1640px] pt-8">
        {results.length === 0 ? (
          <EmptyState query={query} onClear={onCategory ? clearAll : undefined} />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
              {visible.map((product, i) => (
                // Cards that appear after a filter change or a new page animate in.
                <li key={product.slug} className="card-in flex" style={{ "--i": i % PAGE } as React.CSSProperties}>
                  <ProductCard variant="compact" product={product} headingLevel="h3" price={prices[product.slug]} />
                </li>
              ))}
            </ul>
            {remaining > 0 && (
              <div ref={sentinel} className="mt-10 flex flex-col items-center gap-2">
                <button type="button" onClick={showMore} className="btn btn-secondary btn-sm" disabled={!onCategory}>
                  Show more products
                </button>
                <p className="text-[13px] text-muted">
                  Showing {visible.length} of {results.length}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function CategoryTile({
  label,
  note,
  image,
  href,
  pressed,
  onSelect,
}: {
  label: string;
  note: string;
  image?: string;
  href: string;
  pressed: boolean;
  onSelect?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={pressed ? "true" : undefined}
      onClick={(e) => {
        if (!onSelect) return;
        e.preventDefault();
        onSelect();
      }}
      className={`group flex min-w-0 items-center gap-3 rounded-2xl border p-2.5 pr-3 transition-all ${
        pressed
          ? "border-navy bg-navy text-white shadow-navy"
          : "border-divider bg-white text-ink hover:border-navy/40 hover:shadow-card"
      }`}
    >
      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line">
        {image && <Image src={image} alt="" fill sizes="48px" className="object-contain p-1" />}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{label}</span>
        <span className={`mt-0.5 block truncate text-[11px] ${pressed ? "text-rose-light" : "text-muted"}`}>{note}</span>
      </span>
    </Link>
  );
}

function SubCategories({
  family,
  filter,
  listed,
  onSelect,
}: {
  family: Family;
  filter: ReturnType<typeof resolveFilter>;
  listed: CatalogItem[];
  onSelect?: (value: string | null) => void;
}) {
  const counts = family.categories
    .map((category) => ({ category, count: listed.filter((p) => p.category === category).length }))
    .filter((c) => c.count > 0);
  return (
    <div role="group" aria-label={`${family.label} categories`} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none]">
      <SubPill label="All" pressed={filter.kind === "family"} onClick={() => onSelect?.(family.slug)} />
      {counts.map(({ category, count }) => (
        <SubPill
          key={category}
          label={categoryLabel(category)}
          count={count}
          pressed={filter.kind === "category" && filter.category === category}
          onClick={() => onSelect?.(categorySlug(category))}
        />
      ))}
    </div>
  );
}

function SubPill({ label, count, pressed, onClick }: { label: string; count?: number; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3.5 text-[13px] font-semibold text-muted transition-colors hover:text-navy aria-pressed:border-rose/40 aria-pressed:bg-blush aria-pressed:text-rose-deep"
    >
      {label}
      {count !== undefined && <span className="text-xs font-medium opacity-70">{count}</span>}
    </button>
  );
}

function EmptyState({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <div className="rounded-[24px] border border-dashed border-divider bg-white px-6 py-16 text-center">
      <p className="font-display text-[30px] font-bold text-ink">No products found</p>
      <p className="mx-auto mt-2 max-w-md text-muted">
        {query.trim() ? `Nothing in this range matches “${query.trim()}”.` : "Nothing in this range yet."} Ask us
        even if it isn’t listed here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onClear && (
          <button type="button" onClick={onClear} className="btn btn-secondary btn-sm">
            Clear filters
          </button>
        )}
        <Link href="/contact" className="btn btn-primary btn-sm">
          Tell us what you need
        </Link>
      </div>
    </div>
  );
}
