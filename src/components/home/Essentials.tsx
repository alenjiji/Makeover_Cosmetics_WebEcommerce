import Link from "next/link";
import { essentials } from "@/data/essentials";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { site } from "@/lib/site";

export function Essentials() {
  return (
    <section aria-labelledby="essentials" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <div className="mx-auto max-w-[1640px]">
        <SectionHeader
          id="essentials"
          label="Clinic Essentials"
          title={
            <>
              Everything Your <span className="italic text-accent">Treatment Room</span> Needs
            </>
          }
          subtitle="Beyond the machines, we supply the consumables, skincare and small devices that keep your clinic running."
          className="mb-14 md:mb-16"
        />

        <Reveal variant="none">
          <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {essentials.map((group, i) => (
              <div key={group.title} className="flex" style={{ "--i": i } as React.CSSProperties}>
                <article
                  data-glow
                  className="group relative flex w-full flex-col overflow-hidden rounded-[24px] bg-white p-7 shadow-card ring-1 ring-line transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:shadow-card-hover md:p-8"
                >
                  {/* Navy top edge that warms to rose like the M, drawn in on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-m transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                  />
                  <div className="relative mb-5 flex items-center gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-mist font-display text-[22px] font-bold italic text-rose-deep transition-colors duration-500 group-hover:bg-navy group-hover:text-rose-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-rose/50 to-transparent" />
                  </div>
                  <h3 className="relative mb-2 font-display text-[24px] font-bold leading-snug text-ink">{group.title}</h3>
                  <p className="relative mb-6 text-[15px] leading-relaxed text-muted">{group.description}</p>
                  <ul className="relative mt-auto flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink ring-1 ring-divider transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:ring-navy"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="scale">
          <div className="theme-dark relative mt-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[28px] bg-navy p-7 md:flex-row md:p-10">
            <div aria-hidden="true" className="world-map absolute inset-y-0 -right-[10%] aspect-[262/124] bg-white/[.06]" />
            <div className="relative text-center md:text-left">
              <p className="font-display text-[26px] font-bold text-white md:text-[32px]">
                Stocking up for <span className="italic text-accent">your clinic?</span>
              </p>
              <p className="mt-2 text-[15px] text-white/75">
                Ask for our latest price list. Volume pricing is available on most consumables.
              </p>
            </div>
            <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ContactChooser
                channel="whatsapp"
                message={`Hi ${site.name}, could you send me your latest consumables price list?`}
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon size={18} />
                Request Price List
              </ContactChooser>
              <Link href="/contact#inquiry" className="btn btn-outline-light group">
                Send an Inquiry
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
