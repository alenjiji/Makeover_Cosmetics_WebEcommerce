import Link from "next/link";
import { series } from "@/data/series";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/lib/site";

/** The product series as a navy index: numbered glass tiles over the logo's map. */
export function SeriesGrid() {
  return (
    <section
      aria-labelledby="series"
      className="theme-dark relative overflow-hidden bg-[linear-gradient(165deg,#0b1c31_0%,#122b49_60%,#1d3352_100%)] px-6 py-24 md:px-10 md:py-32 xl:px-[60px]"
    >
      <div aria-hidden="true" className="world-map absolute -left-[10%] top-24 aspect-[262/124] w-[120%] bg-white/[.05]" />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -right-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.25),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-[1640px]">
        <SectionHeader
          id="series"
          tone="light"
          label="Our Product Series"
          title={
            <>
              {site.claims.series} Revolutionary <span className="italic text-accent">Product Series</span>
            </>
          }
          subtitle="Cutting-edge solutions designed to transform aesthetic medicine"
          className="mb-14 md:mb-20"
        />
        <Reveal variant="none">
          <ul className="stagger mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/10 ring-1 ring-white/10 md:grid-cols-3 xl:grid-cols-4">
            {series.map((item, i) => (
              // 16 tiles leave one over in the 3-column layout; let it fill the row.
              <li key={item.title} className="flex md:max-xl:last:col-span-3" style={{ "--i": i % 8 } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[124px] w-full flex-col justify-between gap-6 overflow-hidden bg-navy-deep/60 p-5 backdrop-blur-sm md:min-h-[168px] md:p-7"
                >
                  {/* The M's mauve-to-rose, sweeping up on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-[linear-gradient(20deg,#645b67_0%,#8c5d54_100%)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <span className="relative flex items-center justify-between">
                    <span className="font-display text-[15px] font-bold italic text-rose-light/80 transition-colors group-hover:text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowRightIcon
                      size={18}
                      className="-translate-x-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    />
                  </span>
                  <span className="relative font-display text-[18px] font-bold leading-snug text-white md:text-[22px]">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="text-center">
          <Link href="/products" className="btn btn-light btn-lg group w-full sm:w-auto">
            View All Products
            <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
