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
                  className="group relative flex w-full flex-col overflow-hidden rounded-[20px] border border-line bg-white p-7 shadow-card transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-navy/15 hover:shadow-card-hover md:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-6 font-display text-[120px] font-bold italic leading-none text-mist transition-colors duration-500 group-hover:text-blush"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative mb-2 mt-6 font-display text-[24px] font-bold leading-snug text-ink">{group.title}</h3>
                  <p className="relative mb-6 text-[15px] leading-relaxed text-muted">{group.description}</p>
                  <ul className="relative mt-auto flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink ring-1 ring-line transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:ring-navy"
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
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[24px] bg-white p-6 ring-1 ring-line md:flex-row md:p-8">
            <div className="text-center md:text-left">
              <p className="font-display text-[24px] font-bold text-ink md:text-[28px]">Stocking up for your clinic?</p>
              <p className="mt-1 text-[15px] text-muted">
                Ask for our latest price list. Volume pricing is available on most consumables.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ContactChooser
                channel="whatsapp"
                message={`Hi ${site.name}, could you send me your latest consumables price list?`}
                className="btn btn-whatsapp"
              >
                <WhatsAppIcon size={18} />
                Request Price List
              </ContactChooser>
              <Link href="/contact#inquiry" className="btn btn-secondary group">
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
