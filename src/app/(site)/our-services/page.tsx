import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/contact/Faq";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import {
  ArrowRightIcon,
  BadgeIcon,
  CheckIcon,
  GlobeIcon,
  GraduationIcon,
  LayersIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SplitWords } from "@/components/ui/SplitWords";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Sourcing, manufacturing, export and import, OEM and private label, distribution, installation, training and after-sales support for medical cosmetic equipment.",
  alternates: { canonical: "/our-services" },
  openGraph: { url: "/our-services" },
};

const services = [
  {
    icon: GlobeIcon,
    title: "Sourcing & Manufacturing",
    text: "Lasers, HIFU, body sculpting, facial and dental systems built and sourced through our production network.",
    href: "/global-presence",
    cta: "Our production network",
  },
  {
    icon: TruckIcon,
    title: "Export & Import",
    text: "Export documentation, freight and delivery handled end to end, across India, the UAE and beyond.",
    href: "/global-presence",
    cta: "Where we operate",
  },
  {
    icon: BadgeIcon,
    title: "OEM & Private Label",
    text: "Equipment under your own brand, with your logo on the device, screen and packaging.",
    href: "/partner-brands",
    cta: "Private-label partnerships",
  },
  {
    icon: LayersIcon,
    title: "Distribution & Clinic Supply",
    text: "Partner pricing for distributors and dealers, and matching equipment for clinic groups.",
    href: "/partner-brands",
    cta: "Become a partner",
  },
  {
    icon: GraduationIcon,
    title: "Installation & Training",
    text: "Setup guidance, training materials and video tutorials so your team can treat with confidence.",
    href: "/contact",
    cta: "Ask about training",
  },
  {
    icon: WrenchIcon,
    title: "After-Sales & Warranty",
    text: "Technical support, spare parts and warranty handling for every machine we supply.",
    href: "/contact",
    cta: "Get support",
  },
];

// Terms from the Contact page FAQ.
const included = [
  "Testing and quality check before dispatch",
  "Standard delivery in 7-15 business days, express on request",
  "Training materials, video tutorials and technical support",
  "Standard 1-2 year warranty covering manufacturing defects",
  "Customisation and branding on request",
];

export default function OurServicesPage() {
  return (
    <>
      <PageHeader
        badge="Our Services"
        title={
          <>
            From the Factory to <span className="italic text-accent">Your Clinic</span>
          </>
        }
        subtitle="We source and manufacture medical cosmetic equipment, ship it across borders and support it long after it arrives."
      />

      {/* Services */}
      <section aria-labelledby="services" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto max-w-[1640px]">
          <SectionHeader
            id="services"
            label="What We Do"
            title={
              <>
                One Team, <span className="italic text-accent">Every Step</span>
              </>
            }
            subtitle="Whether you run one clinic, distribute equipment or want your own brand, we cover the whole journey."
            className="mb-14 md:mb-16"
          />
          <Reveal as="ul" variant="none" className="stagger grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map(({ icon: Icon, title, text, href, cta }, i) => (
              <li key={title} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={href}
                  data-glow
                  className="group flex h-full flex-col rounded-[24px] border border-line bg-white p-7 shadow-card transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-navy/15 hover:shadow-card-hover md:p-9"
                >
                  <span className="mb-7 flex size-14 items-center justify-center rounded-full bg-mist text-navy transition-all duration-500 group-hover:bg-navy group-hover:text-white">
                    <Icon size={24} />
                  </span>
                  <h3 className="mb-3 font-display text-[26px] font-bold leading-tight text-ink">{title}</h3>
                  <p className="mb-8 text-[15px] leading-relaxed text-muted">{text}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy">
                    {cta}
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Included with every order */}
      <section aria-labelledby="included" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto grid max-w-[1640px] items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal variant="clip" className="order-last lg:order-first">
            <figure className="group relative overflow-hidden rounded-[28px] shadow-[0_20px_40px_rgb(11_28_49/0.14)]">
              <Image
                src="/images/site/about-production.webp"
                alt="Equipment on the production floor"
                width={800}
                height={1200}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="settle aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/0 to-navy-deep/0" />
              <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
                <span className="size-1.5 rotate-45 bg-rose" aria-hidden="true" />
                Built, tested, shipped
              </figcaption>
            </figure>
          </Reveal>

          <Reveal variant="none">
            <p className="pop eyebrow mb-6">With Every Order</p>
            <h2
              id="included"
              className="mb-8 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] text-ink md:text-[48px]"
            >
              <SplitWords>
                Support That Ships <span className="italic text-accent">With the Machine</span>
              </SplitWords>
            </h2>
            <ul className="rise-late mb-9 flex flex-col gap-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-ink md:text-base">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-m text-white">
                    <CheckIcon size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="rise-late group inline-flex items-center gap-2 border-b border-navy/20 pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:border-navy"
            >
              Explore the range
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="services-faq" className="bg-white px-4 py-16 sm:px-6 md:px-10 md:py-24 xl:px-[60px] xl:py-[120px]">
        <div className="mx-auto max-w-[960px]">
          <SectionHeader
            id="services-faq"
            label="FAQ"
            title={
              <>
                Common <span className="italic text-accent">Questions</span>
              </>
            }
            className="mb-12"
          />
          <Faq items={faqs} />
        </div>
      </section>

      <ClosingInvite />
    </>
  );
}
