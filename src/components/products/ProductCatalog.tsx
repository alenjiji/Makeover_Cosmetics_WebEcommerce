"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products, type Product } from "@/data/products";
import {
  categoryLabel,
  categorySlug,
  families,
  matchesFilter,
  matchesQuery,
  resolveFilter,
  type CatalogFilter,
} from "@/lib/catalog";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { ProductCard } from "./ProductCard";

const countIn = (filter: CatalogFilter) => products.filter((p) => matchesFilter(p, filter)).length;

/** Reads `?category=` and `?q=` from the URL; must render inside <Suspense>. */
export function ProductCatalog() {
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
      categoryParam={params.get("category")}
      query={query}
      onCategory={(value) => {
        updateUrl("category", value, "push");
        // If the sticky toolbar is pinned, bring the top of the results back into view.
        const top = document.getElementById("catalog");
        if (top && top.getBoundingClientRect().top < parseFloat(getComputedStyle(top).scrollMarginTop)) {
          top.scrollIntoView();
        }
      }}
      onQuery={(value) => {
        setQuery(value);
        updateUrl("q", value.trim() || null, "replace");
      }}
    />
  );
}

type ViewProps = {
  categoryParam: string | null;
  query: string;
  onCategory?: (value: string | null) => void;
  onQuery?: (value: string) => void;
};

/** Stateless catalog UI. Rendered without handlers it is the prerendered (SEO) fallback. */
export function CatalogView({ categoryParam, query, onCategory, onQuery }: ViewProps) {
  const filter = resolveFilter(categoryParam);
  const activeFamily = filter.kind === "all" ? undefined : filter.family;
  const results = products.filter((p) => matchesFilter(p, filter) && matchesQuery(p, query));
  const isDefaultView = filter.kind === "all" && !query.trim();

  const rangeRef = useRef<HTMLDivElement>(null);

  // Keep the active range pill visible when the row scrolls horizontally (e.g. on a deep link).
  useEffect(() => {
    const row = rangeRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && active) row.scrollLeft = active.offsetLeft - row.offsetLeft - 16;
  }, [activeFamily?.slug]);

  const select = (value: string | null) => onCategory?.(value);
  const clearAll = () => {
    onQuery?.("");
    select(null);
  };

  return (
    <>
      <div id="catalog" className="scroll-mt-[var(--nav-h)]" />
      <div className="relative z-20 -mx-6 md:sticky md:top-[var(--nav-h)] border-b border-line bg-surface/90 px-6 py-4 backdrop-blur-xl md:-mx-10 md:px-10 xl:-mx-[60px] xl:px-[60px]">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            ref={rangeRef}
            role="group"
            aria-label="Product range"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:pb-0"
          >
            <FilterPill
              label="All Products"
              count={products.length}
              pressed={filter.kind === "all"}
              onClick={() => select(null)}
            />
            {families.map((family) => (
              <FilterPill
                key={family.slug}
                label={family.label}
                count={countIn({ kind: "family", family })}
                pressed={activeFamily?.slug === family.slug}
                onClick={() => select(family.slug)}
              />
            ))}
          </div>

          <label className="relative block lg:w-80">
            <span className="sr-only">Search products</span>
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              readOnly={!onQuery}
              onChange={(e) => onQuery?.(e.target.value)}
              placeholder="Search name, model, wavelength"
              className="h-11 w-full rounded-full border border-divider bg-white pl-11 pr-4 text-sm text-ink placeholder:text-muted/80 focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10"
            />
          </label>
        </div>

        {activeFamily && (
          <div
            role="group"
            aria-label={`${activeFamily.label} categories`}
            className="mx-auto mt-3 flex max-w-[1640px] gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
          >
            <SubPill
              label={`All ${activeFamily.label}`}
              pressed={filter.kind === "family"}
              onClick={() => select(activeFamily.slug)}
            />
            {activeFamily.categories.map((category) => (
              <SubPill
                key={category}
                label={categoryLabel(category)}
                count={countIn({ kind: "category", family: activeFamily, category })}
                pressed={filter.kind === "category" && filter.category === category}
                onClick={() => select(categorySlug(category))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1640px] pt-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted">
            Showing <strong className="font-semibold text-ink">{results.length}</strong> of{" "}
            {products.length} products
            {filter.kind === "family" && <> in {filter.family.label}</>}
            {filter.kind === "category" && <> in {categoryLabel(filter.category)}</>}
            {query.trim() && <> matching “{query.trim()}”</>}
          </p>
          {!isDefaultView && onCategory && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-rose-deep hover:text-navy"
            >
              <CloseIcon size={14} />
              Clear filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState query={query} onClear={onCategory ? clearAll : undefined} />
        ) : isDefaultView ? (
          <div className="space-y-20">
            {families.map((family) => (
              <section key={family.slug} aria-labelledby={`range-${family.slug}`}>
                <div className="mb-8 flex items-end justify-between gap-4 border-b border-divider pb-5">
                  <div>
                    <h2
                      id={`range-${family.slug}`}
                      className="font-display text-[34px] font-bold tracking-[-0.01em] text-ink md:text-[42px]"
                    >
                      {family.label}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {family.categories.map(categoryLabel).join(" · ")}
                    </p>
                  </div>
                  <Link
                    href={`/products?category=${family.slug}`}
                    onClick={(e) => {
                      if (!onCategory) return;
                      e.preventDefault();
                      select(family.slug);
                    }}
                    className="group hidden shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy sm:inline-flex"
                  >
                    {countIn({ kind: "family", family })} models
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <ProductGrid items={products.filter((p) => family.categories.includes(p.category))} />
              </section>
            ))}
          </div>
        ) : (
          <ProductGrid items={results} headingLevel="h2" />
        )}
      </div>
    </>
  );
}

function ProductGrid({ items, headingLevel }: { items: Product[]; headingLevel?: "h2" | "h3" }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
      {items.map((product, i) => (
        // Cards that appear after a filter change animate in; ones already shown stay put.
        <div key={product.slug} className="card-in flex" style={{ "--i": i } as React.CSSProperties}>
          <ProductCard product={product} headingLevel={headingLevel} />
        </div>
      ))}
    </div>
  );
}

type PillProps = { label: string; count?: number; pressed: boolean; onClick: () => void };

function FilterPill({ label, count, pressed, onClick }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-divider bg-white px-5 text-[13px] font-semibold text-ink transition-all hover:border-navy/40 hover:text-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white aria-pressed:shadow-navy"
    >
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-navy/[.07] px-2 py-0.5 text-xs font-bold group-aria-pressed:bg-white/20 group-aria-pressed:text-rose-light">
          {count}
        </span>
      )}
    </button>
  );
}

function SubPill({ label, count, pressed, onClick }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-transparent px-4 text-[13px] font-semibold text-muted transition-colors hover:text-navy aria-pressed:border-rose/40 aria-pressed:bg-blush aria-pressed:text-rose-deep"
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
        {query.trim()
          ? `Nothing in this range matches “${query.trim()}”.`
          : "Nothing in this range yet."}{" "}
        We manufacture 40+ models, so ask us even if it isn’t listed here.
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
