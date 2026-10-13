import Link from "next/link";
import { series } from "@/data/series";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/lib/site";

export function SeriesGrid() {
  return (
    <section aria-labelledby="series" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          id="series"
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
          <ul className="stagger mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line md:grid-cols-3 xl:grid-cols-4">
            {series.map((item, i) => (
              <li key={item.title} className="flex" style={{ "--i": i % 8 } as React.CSSProperties}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[112px] w-full flex-col items-center justify-center gap-2 overflow-hidden bg-white px-4 py-8 text-center md:min-h-[140px] md:px-8 md:py-12"
                >
                  {/* Navy fill, warming toward rose like the M, that sweeps up on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-[linear-gradient(20deg,#0b1c31_0%,#122b49_55%,#645b67_100%)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <span className="relative font-display text-[17px] font-medium leading-snug text-ink transition-colors duration-300 group-hover:text-white group-focus-visible:text-white md:text-[21px]">
                    {item.title}
                  </span>
                  <ArrowRightIcon
                    size={16}
                    className="relative -translate-x-2 text-rose-light opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="text-center">
          <Link href="/products" className="btn btn-primary btn-lg group w-full sm:w-auto">
            View All Products
            <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
