import Image from "next/image";
import { site } from "@/lib/site";

type Props = {
  /** "light" for dark backgrounds. */
  tone?: "dark" | "light";
  /** Smaller badge and wordmark, e.g. once the navbar condenses on scroll. */
  compact?: boolean;
  preload?: boolean;
  className?: string;
};

/**
 * Horizontal lockup of the final logo: the M-and-map badge on its mist disc, with the
 * wordmark and descriptor beside it rather than below, so it stays legible at nav size.
 */
export function Logo({ tone = "dark", compact = false, preload = false, className = "" }: Props) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/badge.png"
        alt=""
        width={512}
        height={512}
        sizes="64px"
        preload={preload}
        className={`shrink-0 rounded-full transition-all duration-300 ${
          light ? "ring-1 ring-white/15" : "shadow-[0_2px_10px_rgb(18_43_73/0.12)]"
        } ${compact ? "size-10 md:size-11" : "size-11 md:size-14"}`}
      />
      <span className="flex flex-col">
        <span
          className={`font-bold uppercase leading-none tracking-[0.06em] transition-all duration-300 ${
            light ? "text-white" : "text-ink"
          } ${compact ? "text-[13px] md:text-[14px]" : "text-[13px] md:text-[16px]"}`}
        >
          {site.name}
        </span>
        <span
          className={`mt-1.5 text-[8.5px] font-medium uppercase leading-none tracking-[0.3em] md:text-[9.5px] ${
            light ? "text-rose-light" : "text-muted"
          }`}
        >
          {site.descriptor}
        </span>
      </span>
    </span>
  );
}
