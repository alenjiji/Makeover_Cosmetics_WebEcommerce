"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatalogItem } from "@/lib/catalog";
import { categoryLabel, categorySlug, families, matchesFilter, type CatalogFilter } from "@/lib/catalog-filters";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";
import { ProductStage } from "@/components/ui/ProductStage";

/** Most machines one inquiry carries (matches the inquiry form's limit). */
const MAX_SELECTED = 12;
/** Machines shown before "Show all" when no range is picked. */
const PREVIEW = 10;

type Props = {
  machines: CatalogItem[];
  filter: CatalogFilter;
  /** Picks a range (family slug), a category slug, or all machines (null). */
  onFilter?: (value: string | null) => void;
};

/**
 * Professional machines, sold on inquiry: visitors tick the machines they're interested in and send
 * one inquiry for all of them (the contact form receives the slugs as ?product=a,b,c).
 */
export function MachinePicker({ machines, filter, onFilter }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const ranges = families
    .filter((f) => f.ordering === "inquiry")
    .map((family) => ({ family, count: machines.filter((m) => family.categories.includes(m.category)).length }))
    .filter((r) => r.count > 0);
  const shown = machines.filter((m) => matchesFilter(m, filter));
  const preview = filter.kind === "all" && !expanded ? shown.slice(0, PREVIEW) : shown;

  const toggle = (slug: string) =>
    setSelected((list) =>
      list.includes(slug) ? list.filter((s) => s !== slug) : list.length < MAX_SELECTED ? [...list, slug] : list,
    );
  const inquiryHref = `/contact?product=${selected.join(",")}#inquiry`;

  return (
    <>
      <div role="group" aria-label="Machine ranges" className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        <RangePill label="All Machines" count={machines.length} pressed={filter.kind === "all"} onClick={() => onFilter?.(null)} />
        {ranges.map(({ family, count }) => (
          <RangePill
            key={family.slug}
            label={family.label}
            count={count}
            pressed={filter.kind !== "all" && filter.family.slug === family.slug}
            onClick={() => onFilter?.(family.slug)}
          />
        ))}
        {filter.kind === "category" && (
          <RangePill label={categoryLabel(filter.category)} pressed onClick={() => onFilter?.(categorySlug(filter.category))} />
        )}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {preview.map((machine, i) => {
          const isSelected = selected.includes(machine.slug);
          return (
            <li key={machine.slug} className="card-in flex" style={{ "--i": i } as React.CSSProperties}>
              <article
                className={`group relative flex w-full flex-col overflow-hidden rounded-[18px] bg-white transition-all duration-300 ${
                  isSelected ? "shadow-navy ring-2 ring-navy" : "shadow-card ring-1 ring-navy/[.08] hover:shadow-card-hover"
                }`}
              >
                {/* The whole card toggles the selection; "Details" opens the product page. */}
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(machine.slug)}
                  aria-label={`${isSelected ? "Remove" : "Select"} ${machine.name}${machine.model ? ` ${machine.model}` : ""}`}
                  className="absolute inset-0 z-10 rounded-[18px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy/30"
                />
                <ProductStage
                  src={machine.image}
                  alt={machine.alt}
                  sizes="(min-width: 1280px) 260px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
                  className="aspect-[5/4] bg-[linear-gradient(180deg,#fff_0%,var(--color-surface)_100%)]"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "border-navy bg-navy text-white" : "border-divider bg-white/90 text-transparent group-hover:border-navy/50"
                    }`}
                  >
                    <CheckIcon size={14} />
                  </span>
                  {machine.isNew && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-rose-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-deep">
                      New
                    </span>
                  )}
                </ProductStage>
                <div className="flex flex-1 flex-col border-t border-line p-3.5 md:p-4">
                  <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted md:text-[11px]">
                    {categoryLabel(machine.category)}
                  </p>
                  <h3 className="mb-1 line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink md:text-[17px]">
                    {machine.name}
                  </h3>
                  <p className="mb-3 line-clamp-1 text-[12px] font-semibold text-rose-deep">{machine.spec}</p>
                  <Link
                    href={`/products/${machine.slug}`}
                    className="relative z-20 mt-auto inline-flex items-center gap-1 self-start text-[11px] font-semibold uppercase tracking-[0.14em] text-navy underline-offset-4 hover:underline"
                  >
                    Details
                    <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {preview.length < shown.length && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setExpanded(true)} className="btn btn-secondary btn-sm">
            Show all {shown.length} machines
          </button>
        </div>
      )}

      {/* Inquiry bar: appears once a machine is ticked. */}
      {selected.length > 0 && (
        <div
          role="region"
          aria-label="Selected machines"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl animate-rise-in items-center gap-3 rounded-full bg-navy-deep py-2.5 pl-5 pr-2.5 text-white shadow-[0_18px_40px_rgb(11_28_49/0.35)] md:bottom-6"
        >
          <p className="min-w-0 flex-1 truncate text-sm">
            <strong className="font-semibold">{selected.length}</strong>{" "}
            {selected.length === 1 ? "machine" : "machines"} selected
            {selected.length >= MAX_SELECTED && <span className="text-rose-light"> (maximum)</span>}
          </p>
          <button
            type="button"
            onClick={() => setSelected([])}
            aria-label="Clear selection"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <CloseIcon size={16} />
          </button>
          <Link href={inquiryHref} className="btn btn-light btn-sm shrink-0">
            Send Inquiry
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      )}
    </>
  );
}

function RangePill({ label, count, pressed, onClick }: { label: string; count?: number; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-divider bg-white px-4 text-[13px] font-semibold text-ink transition-all hover:border-navy/40 hover:text-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white"
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
