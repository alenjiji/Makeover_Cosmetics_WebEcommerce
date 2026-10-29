import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import { ArrowRightIcon, CheckIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { RouteSteps } from "@/components/ui/RouteSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SplitWords } from "@/components/ui/SplitWords";
import { TradeRoutes } from "@/components/ui/TradeRoutes";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Global Presence",
  description:
    "Makeover Overseas sources, manufactures and supplies medical cosmetic equipment across India, the UAE and China, handling export and import end to end for clinics and distributors.",
  alternates: { canonical: "/global-presence" },
  openGraph: { url: "/global-presence" },
};

const [uaeLine, indiaLine] = site.lines;

const markets = [
  {
    name: "UAE",
    role: "Regional Office · Dubai",
    text: "Our Dubai office handles consultations, quotations and export coordination for clinics across the region.",
    points: ["Product consultations and quotations", "Export documentation and shipping", "Warranty and after-sales coordination"],
    contact: { icon: MapPinIcon, lines: [site.addressLines[1], site.addressLines[2], site.addressLines[3]] },
    phone: uaeLine.display,
  },
  {
    name: "India",
    role: "Clinics & Distributors",
    text: "We supply clinics, dermatologists, salons and distributors across India, with setup guidance and operator training.",
    points: ["Supply to clinics and distributors", "Installation guidance and operator training", "Spare parts and service support"],
    phone: indiaLine.display,
  },
  {
    name: "China",
    role: "Sourcing & Manufacturing",
    text: "Our equipment is manufactured and sourced through our production network in China, then tested before it ships.",
    points: ["Manufacturing and OEM production", "Component and accessory sourcing", "Pre-dispatch testing and quality checks"],
  },
] as const;

const steps = [
  {
    title: "Source & manufacture",
    text: "Machines are built and sourced through our production network, to the configuration your clinic needs.",
  },
  {
    title: "Test & quality check",
    text: "Every machine is tested and quality-checked before it is packed for dispatch.",
  },
  {
    title: "Export & delivery",
    text: "We handle export documentation and freight, with standard delivery in 7-15 business days.",
  },
  {
    title: "Install, train & support",
    text: "Installation guidance, operator training and after-sales support, wherever your clinic is.",
  },
];

export default function GlobalPresencePage() {
  return (
    <>
      <PageHeader
        badge="Global Presence"
        title={
          <>
            Quality Beyond <span className="italic text-accent">Borders</span>
          </>
        }
        subtitle="Sourcing, manufacturing and supply across India, the UAE and China: one team and one standard, wherever your clinic is."
      />

      {/* Overview */}
      <section aria-labelledby="overview" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto grid max-w-[1640px] items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal variant="none">
            <p className="pop eyebrow mb-6">Export &amp; Imports</p>
            <h2
              id="overview"
              className="mb-8 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] text-ink md:text-[48px]"
            >
              <SplitWords>
                One Partner From Factory <span className="italic text-accent">to Treatment Room</span>
              </SplitWords>
            </h2>
            <p className="rise-late mb-5 text-base leading-[1.8] text-muted md:text-[17px]">
              Makeover Overseas sources and manufactures medical cosmetic equipment and moves it across
              borders. Lasers, HIFU, body sculpting, facial and dental systems are built and tested
              through our production network, then exported to clinics and distributors.
            </p>
            <p className="rise-late mb-9 text-base leading-[1.8] text-muted md:text-[17px]">
              We handle export and import end to end, from documentation and freight to setup guidance,
              training and after-sales support. You deal with one team from the first quote to the first
              treatment.
            </p>
            <Link
              href="/products"
              className="rise-late group inline-flex items-center gap-2 border-b border-navy/20 pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:border-navy"
            >
              Explore the range
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal variant="clip">
            <figure className="group relative overflow-hidden rounded-[28px] shadow-[0_20px_40px_rgb(11_28_49/0.14)]">
              <Image
                src="/images/site/about-testing.webp"
                alt="Technician testing a machine before it ships"
                width={800}
                height={1200}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="settle aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/0 to-navy-deep/0" />
              <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
                <span className="size-1.5 rotate-45 bg-rose" aria-hidden="true" />
                Tested before dispatch
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Markets */}
      <section
        aria-labelledby="markets"
        className="theme-dark relative overflow-hidden bg-[linear-gradient(170deg,#0b1c31_0%,#122b49_60%,#1d3352_100%)] px-6 py-20 text-white md:px-10 md:py-28 xl:px-[60px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-40 size-[560px] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.25),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-[1640px]">
          <SectionHeader
            id="markets"
            tone="light"
            label="Where We Operate"
            title={
              <>
                Three Markets, <span className="italic text-accent text-accent-light">One Standard</span>
              </>
            }
            subtitle={`${site.markets.join(" · ")}. Every machine follows the same testing, documentation and support, whichever border it crosses.`}
            className="mb-10 md:mb-12"
          />
          <TradeRoutes landClassName="bg-white/[.1]" className="mx-auto mb-10 max-w-[720px] md:mb-14" />

          <Reveal as="ul" variant="none" className="stagger grid gap-5 lg:grid-cols-3">
            {markets.map((market, i) => (
              <li key={market.name} style={{ "--i": i } as React.CSSProperties}>
                <article className="flex h-full flex-col rounded-[24px] bg-white/[.06] p-7 ring-1 ring-white/15 backdrop-blur transition-colors duration-500 hover:bg-white/[.1] md:p-9">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-light">{market.role}</p>
                  <h3 className="mb-4 font-display text-[36px] font-bold leading-none text-white">{market.name}</h3>
                  <p className="mb-6 text-[15px] leading-relaxed text-white/75">{market.text}</p>
                  <ul className="mb-7 flex flex-col gap-3">
                    {market.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] text-white/90">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose/25 text-rose-light">
                          <CheckIcon size={11} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6 text-[14px] text-white/75">
                    {"contact" in market && (
                      <p className="flex items-start gap-3">
                        <MapPinIcon size={16} className="mt-0.5 shrink-0 text-rose-light" />
                        <span>{market.contact.lines.join(", ")}</span>
                      </p>
                    )}
                    {"phone" in market ? (
                      <p className="flex items-center gap-3">
                        <PhoneIcon size={16} className="shrink-0 text-rose-light" />
                        <span className="font-semibold text-white">{market.phone}</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-3">
                        <span className="size-1.5 shrink-0 rotate-45 bg-rose" aria-hidden="true" />
                        Production and sourcing hub
                      </p>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Supply chain */}
      <section aria-labelledby="supply" className="relative overflow-hidden bg-white px-6 py-24 md:px-10 md:py-32 xl:px-[60px]">
        <div aria-hidden="true" className="world-map absolute inset-x-0 top-1/2 mx-auto aspect-[262/124] w-[110%] max-w-[1500px] -translate-y-1/2 bg-navy/[.035]" />
        <div className="relative mx-auto max-w-[1640px]">
          <SectionHeader
            id="supply"
            label="How We Deliver"
            title={
              <>
                From Our Floor to <span className="italic text-accent">Your Clinic</span>
              </>
            }
            subtitle="The same four steps for every order, whether it ships across town or across borders."
            className="mb-16 md:mb-24"
          />
          <RouteSteps id="supply" steps={steps} />
        </div>
      </section>

      <ClosingInvite />
    </>
  );
}
