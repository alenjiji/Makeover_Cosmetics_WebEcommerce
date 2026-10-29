import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  ArrowRightIcon,
  BadgeIcon,
  CheckIcon,
  GlobeIcon,
  GraduationIcon,
  LayersIcon,
  ShieldIcon,
  TruckIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { RouteSteps } from "@/components/ui/RouteSteps";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Partner Brands",
  description:
    "Partner with Makeover Overseas for aesthetic and medical equipment distribution, OEM and private-label manufacturing across India and the UAE.",
  alternates: { canonical: "/partner-brands" },
  openGraph: { url: "/partner-brands" },
};

const models = [
  {
    icon: GlobeIcon,
    label: "Distribution",
    title: "Distributors & Dealers",
    text: "Carry our equipment in your city or region, backed by our team.",
    points: ["Partner pricing across the full range", "Product and sales training for your team", "Photos, brochures and specifications to sell with"],
  },
  {
    icon: LayersIcon,
    label: "OEM & Private Label",
    title: "Your Brand, Our Build",
    text: "Launch aesthetic equipment under your own name, without building a factory.",
    points: ["Your logo on the device, screen and packaging", "Custom colours, handpieces and configurations", "Production and testing handled by us"],
  },
  {
    icon: ShieldIcon,
    label: "Clinic Groups",
    title: "Multi-Location Supply",
    text: "Equip every branch with the same machines and the same standard.",
    points: ["Matching equipment across locations", "Pricing for multi-unit orders", "One contact for training and service"],
  },
];

const benefits = [
  { icon: TruckIcon, title: "Direct from production", text: "Equipment comes straight from our production network, without extra layers in between." },
  { icon: BadgeIcon, title: "Your brand up front", text: "Private-label partners get their own branding on the machine, its software and its box." },
  { icon: ShieldIcon, title: "Tested before dispatch", text: "Every unit is tested and quality-checked before it leaves for you or your customer." },
  { icon: GraduationIcon, title: "Training for your team", text: "Product and operator training so your team can sell, demonstrate and support with confidence." },
  { icon: WrenchIcon, title: "After-sales & spare parts", text: "Technical support, warranty handling and spare parts for the equipment you sell." },
  { icon: GlobeIcon, title: "Export handled", text: "We take care of export documentation and freight across India, the UAE and beyond." },
];

const steps = [
  {
    title: "Tell us about your business",
    text: "Your market, your customers and how you'd like to partner: distribution, private label or clinic supply.",
  },
  {
    title: "Pick the range",
    text: "We recommend models for your market and share specifications, configurations and partner pricing.",
  },
  {
    title: "Agree terms & branding",
    text: "We confirm quantities, timelines and, for private label, your logo, colours and packaging.",
  },
  {
    title: "Produce, ship & launch",
    text: "Units are built, tested and shipped, with training and after-sales support from day one.",
  },
];

const cardClass =
  "group relative flex h-full flex-col rounded-[24px] p-7 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 md:p-9";

export default function PartnerBrandsPage() {
  return (
    <>
      <PageHeader
        badge="Partner Brands"
        title={
          <>
            Grow With <span className="italic text-accent">Makeover Overseas</span>
          </>
        }
        subtitle="Distribution, OEM and private-label partnerships for aesthetic and medical equipment across India and the UAE."
      >
        <a href="#partner-inquiry" className="btn btn-light group mt-9 animate-rise-in [--rise-delay:.6s]">
          Become a Partner
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </a>
      </PageHeader>

      {/* Partnership models */}
      <section aria-labelledby="models" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto max-w-[1640px]">
          <SectionHeader
            id="models"
            label="Ways to Partner"
            title={
              <>
                One Range, <span className="italic text-accent">Three Ways</span> to Partner
              </>
            }
            subtitle="Whether you sell equipment, want your own brand or run several clinics, there's a partnership built for it."
            className="mb-14 md:mb-16"
          />
          <Reveal as="ul" variant="none" className="stagger grid gap-5 lg:grid-cols-3">
            {models.map(({ icon: Icon, label, title, text, points }, i) => {
              const featured = i === 1;
              return (
                <li key={title} style={{ "--i": i } as React.CSSProperties}>
                  <article
                    data-glow
                    className={`${cardClass} ${
                      featured
                        ? "theme-dark bg-gradient-m text-white shadow-navy"
                        : "border border-line bg-white shadow-card hover:border-navy/15 hover:shadow-card-hover"
                    }`}
                  >
                    <span
                      className={`mb-7 flex size-14 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 ${
                        featured ? "bg-white text-navy" : "bg-mist text-navy"
                      }`}
                    >
                      <Icon size={24} />
                    </span>
                    <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${featured ? "text-rose-light" : "text-rose-deep"}`}>
                      {label}
                    </p>
                    <h3 className={`mb-3 font-display text-[28px] font-bold leading-tight ${featured ? "text-white" : "text-ink"}`}>{title}</h3>
                    <p className={`mb-7 text-[15px] leading-relaxed ${featured ? "text-white/80" : "text-muted"}`}>{text}</p>
                    <ul className={`mt-auto flex flex-col gap-3 border-t pt-6 ${featured ? "border-white/15" : "border-line"}`}>
                      {points.map((point) => (
                        <li key={point} className={`flex items-start gap-3 text-[15px] ${featured ? "text-white/90" : "text-ink"}`}>
                          <span
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                              featured ? "bg-white/20 text-white" : "bg-gradient-m text-white"
                            }`}
                          >
                            <CheckIcon size={11} />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto max-w-[1640px]">
          <SectionHeader
            id="benefits"
            label="Why Partner With Us"
            title={
              <>
                Built to Help <span className="italic text-accent">You Sell</span>
              </>
            }
            subtitle="Everything a partner needs to bring professional equipment to market, from the factory floor to after-sales."
            className="mb-14 md:mb-16"
          />
          <Reveal as="ul" variant="none" className="stagger grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }, i) => (
              <li key={title} style={{ "--i": i } as React.CSSProperties}>
                <div
                  data-glow
                  className="group flex h-full gap-5 rounded-[20px] border border-line bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-navy/15 hover:shadow-card-hover md:p-8"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-all duration-500 group-hover:bg-navy group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="mb-2 font-display text-[21px] font-bold leading-snug text-ink">{title}</h3>
                    <p className="text-[15px] leading-relaxed text-muted">{text}</p>
                  </div>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="partner-steps" className="relative overflow-hidden bg-white px-6 py-24 md:px-10 md:py-32 xl:px-[60px]">
        <div aria-hidden="true" className="world-map absolute inset-x-0 top-1/2 mx-auto aspect-[262/124] w-[110%] max-w-[1500px] -translate-y-1/2 bg-navy/[.035]" />
        <div className="relative mx-auto max-w-[1640px]">
          <SectionHeader
            id="partner-steps"
            label="How It Works"
            title={
              <>
                From First Call to <span className="italic text-accent">First Shipment</span>
              </>
            }
            subtitle="A clear path from conversation to launch, with one team beside you at every step."
            className="mb-16 md:mb-24"
          />
          <RouteSteps id="partner" steps={steps} />
        </div>
      </section>

      {/* Inquiry */}
      <section
        id="partner-inquiry"
        aria-labelledby="partner-form"
        className="scroll-mt-[var(--nav-h)] bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-24 xl:px-[60px] xl:py-[120px]"
      >
        <div className="mx-auto grid max-w-[1640px] items-start gap-10 xl:grid-cols-[1fr_1.4fr] xl:gap-14">
          <Reveal variant="none" className="xl:sticky xl:top-[calc(var(--nav-h)+24px)]">
            <p className="pop eyebrow mb-6">Become a Partner</p>
            <h2
              id="partner-form"
              className="mb-6 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] text-ink md:text-[48px]"
            >
              Let&apos;s Build Something <span className="italic text-accent">Together</span>
            </h2>
            <p className="mb-8 max-w-lg text-base leading-[1.8] text-muted md:text-[17px]">
              Tell us about your business, the markets you serve and the equipment you&apos;re interested
              in. Our partnerships team replies within 24 hours.
            </p>
            <ul className="flex flex-col gap-4">
              {["Distributors and dealers", "OEM and private-label brands", "Clinic groups and chains"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-semibold text-ink">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-m text-white">
                    <CheckIcon size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="rounded-[28px] border border-line bg-white p-5 shadow-[0_8px_32px_rgb(18_43_73/0.08)] sm:p-8 md:p-12">
            <ContactForm interest="partnership" />
          </div>
        </div>
      </section>
    </>
  );
}
