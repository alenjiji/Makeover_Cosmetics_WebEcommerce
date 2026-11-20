"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

export type ShowcaseItem = {
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  /** Formatted price, when the product is priced in Shopify. */
  price?: string;
};

/** How long each product stays on stage. */
const DWELL_MS = 5000;

/**
 * The hero's product stage: one featured product at a time on a white card, cross-fading to the
 * next every few seconds, with thumbnails to jump between them. Motion is deliberately quiet (a
 * fade and a slight settle); it pauses while the visitor hovers or focuses it, and doesn't rotate
 * at all for visitors who prefer reduced motion.
 */
export function HeroShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const rotating = !paused && !reducedMotion && items.length > 1;
  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % items.length), DWELL_MS);
    return () => clearTimeout(timer);
  }, [active, rotating, items.length]);

  const current = items[active];
  if (!current) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex flex-col overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_30px_60px_rgb(0_0_0/0.35)] ring-1 ring-white/20 sm:p-6 lg:shadow-[0_30px_70px_rgb(11_28_49/0.32)] lg:ring-navy/5"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-deep">
          <span className="size-1.5 rounded-full bg-rose-deep" aria-hidden="true" />
          Shop Online
        </span>
        <span className="font-display text-[13px] font-bold tabular-nums text-muted" aria-hidden="true">
          {String(active + 1).padStart(2, "0")}
          <span className="text-divider"> / </span>
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      {/* Stage: every photo stacked, the active one faded in. */}
      <div className="relative my-3 aspect-[16/11] sm:my-4">
        <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_50%_55%,var(--color-mist)_0%,transparent_70%)]" />
        {items.map((item, i) => (
          <div
            key={item.slug}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
              i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              preload={i === 0}
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-contain p-[4%]"
            />
          </div>
        ))}
      </div>

      {/* Caption for the product on stage. */}
      <div key={current.slug} className="animate-fade">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{current.category}</p>
        <div className="flex items-end justify-between gap-4">
          <h2 className="min-w-0 font-display text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
            <Link href={`/products/${current.slug}`} className="hover:text-navy">
              {current.name}
            </Link>
          </h2>
          {current.price && (
            <p className="shrink-0 font-display text-[22px] font-bold text-navy sm:text-[26px]">{current.price}</p>
          )}
        </div>
        <Link
          href={`/products/${current.slug}`}
          className="group mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy"
        >
          Shop now
          <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Thumbnails: jump to a product; the bar under the active one shows time on stage. */}
      <ul className="mt-4 flex gap-2 border-t border-line pt-4 sm:gap-2.5">
        {items.map((item, i) => (
          <li key={item.slug} className="w-12 sm:w-14">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${item.name}`}
              aria-current={i === active}
              className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-white ring-1 transition-all ${
                i === active ? "ring-2 ring-navy" : "opacity-70 ring-line hover:opacity-100 hover:ring-navy/30"
              }`}
            >
              <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
            </button>
            <span aria-hidden="true" className="mt-1.5 block h-0.5 overflow-hidden rounded-full bg-line">
              {i === active && (
                <span
                  key={`${active}-${rotating}`}
                  className="block h-full origin-left rounded-full bg-gradient-to-r from-navy to-rose"
                  style={
                    rotating
                      ? { animation: `hero-progress ${DWELL_MS}ms linear both` }
                      : { transform: "scaleX(1)" }
                  }
                />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
