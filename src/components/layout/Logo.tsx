import Image from "next/image";
import { site } from "@/lib/site";

type Props = {
  /** "light" for dark backgrounds. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * The M-and-map badge on its mist disc with the wordmark set beside it in live text. The
 * navbar uses the landscape artwork instead; this version works on dark backgrounds, where
 * the artwork's navy mark and black wordmark would disappear.
 */
export function Logo({ tone = "dark", className = "" }: Props) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/badge.png"
        alt=""
        width={512}
        height={512}
        sizes="64px"
        className={`size-12 shrink-0 rounded-full md:size-14 ${
          light ? "ring-1 ring-white/15" : "shadow-[0_2px_10px_rgb(18_43_73/0.12)]"
        }`}
      />
      <span className="flex flex-col">
        <span
          className={`text-[15px] font-bold uppercase leading-none tracking-[0.06em] md:text-[17px] ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {site.name}
        </span>
        <span
          className={`mt-2 text-[11px] font-semibold uppercase leading-none tracking-[0.16em] md:text-[11px] ${
            light ? "text-rose-light" : "text-muted"
          }`}
        >
          {site.descriptor}
        </span>
      </span>
    </span>
  );
}
