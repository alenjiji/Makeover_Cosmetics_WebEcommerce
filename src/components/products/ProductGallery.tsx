"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Product photos for the online range: one large photo and a row of thumbnails to switch between
 * them. Only the first photo is preloaded; the rest load when a thumbnail is picked (thumbnails
 * themselves are lazy).
 */
export function ProductGallery({ images, alt, label }: { images: string[]; alt: string; label?: React.ReactNode }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[32px] bg-white ring-1 ring-navy/[.06]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={active === 0 ? alt : `${alt}, photo ${active + 1} of ${images.length}`}
          fill
          preload={active === 0}
          sizes="(min-width: 1400px) 680px, (min-width: 1024px) 50vw, 100vw"
          className="animate-settle object-contain p-[6%]"
        />
        {label}
      </div>
      {images.length > 1 && (
        <ul aria-label="Product photos" className="mt-3 grid grid-cols-6 gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className="relative block aspect-square w-full overflow-hidden rounded-xl bg-white ring-1 ring-line transition-all hover:ring-navy/40 aria-pressed:ring-2 aria-pressed:ring-navy"
              >
                <Image src={src} alt="" fill sizes="96px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
