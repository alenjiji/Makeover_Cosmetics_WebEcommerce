import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import {
  ArrowRightIcon,
  BadgeIcon,
  GlobeIcon,
  GraduationIcon,
  HeadsetIcon,
  LayersIcon,
  ShieldIcon,
  WrenchIcon,
} from "@/components/ui/icons";
import { CountUp } from "@/components/ui/CountUp";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SplitWords } from "@/components/ui/SplitWords";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Makeover Overseas has developed and manufactured medical and beauty equipment for 16+ years: a 7,000 m² self-owned facility, 50+ professionals, a 10-engineer R&D team and customers in 5+ countries.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

// Claims are strings like "16+"; split them so the number can count up.
const claim = (value: string | number) => {
  const [, num = "0", suffix = ""] = String(value).match(/^(\d+)(.*)$/) ?? [];
  return { to: Number(num), suffix };
};

const stats = [
  { icon: BadgeIcon, ...claim(site.claims.years), label: "Years of Experience" },
  { icon: GlobeIcon, ...claim(site.claims.countries), label: "Countries Served" },
  { icon: LayersIcon, ...claim(site.claims.series), label: "Product Series" },
  { icon: ShieldIcon, ...claim(site.claims.models), label: "Product Models" },
];

// The legacy page's third photo was a hotlinked stock image; the testing bench replaces it.
const photos = [
  { src: "/images/site/about-factory.webp", alt: "Production line inside the factory", label: "7,000 m² Manufacturing Facility", width: 574, height: 1200 },
  { src: "/images/site/about-production.webp", alt: "Technicians assembling equipment on the production floor", label: "Production Floor", width: 686, height: 1200 },
  { src: "/images/site/about-testing.webp", alt: "Technician testing a machine before shipping", label: "Testing & Quality Control", width: 800, height: 1200 },
];

// Copy from the legacy About page.
const facility = [
  {
    icon: LayersIcon,
    title: "7,000 m² Self-Owned Facility",
    text: "Our fully-owned office building features state-of-the-art manufacturing equipment and modern infrastructure designed for optimal production efficiency.",
  },
  {
    icon: ShieldIcon,
    title: "50+ Experienced Professionals",
    text: "Our skilled workforce ensures timely delivery through meticulous inspection processes and comprehensive 24-hour testing protocols for every equipment.",
  },
  {
    icon: WrenchIcon,
    title: "Professional R&D Team",
    text: "Our team of 10 exceptional hardware and software engineers continuously research, develop, and design innovative products that push industry boundaries.",
  },
  {
    icon: BadgeIcon,
    title: "Commitment to Excellence",
    text: "Our professional R&D team maintains an unwavering focus on delivering world-class customer experiences through superior product quality and innovation.",
  },
];

const team = [
  {
    icon: GraduationIcon,
    title: "Professional Training",
    text: "Our team members undergo extensive training programs, equipping them with professional knowledge to help every customer identify the ideal products.",
  },
  {
    icon: GlobeIcon,
    title: "Comprehensive Support",
    text: "We provide personalized guidance to help you gain a deeper understanding of our company, capabilities, and comprehensive solutions for your business.",
  },
  {
    icon: HeadsetIcon,
    title: "Responsive After-Sales",
    text: "Our dedicated support team addresses any after-sales concerns promptly and efficiently, ensuring complete customer satisfaction without delays.",
  },
];

const cardClass =
  "group relative h-full rounded-[20px] border border-line bg-white p-7 shadow-card transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-navy/15 hover:shadow-card-hover md:p-8";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        badge="Our Story"
        title={
          <>
            About <span className="italic text-accent">Makeover Overseas</span>
          </>
        }
        subtitle="16 years of excellence in medical and beauty equipment manufacturing"
      />

      {/* Overview */}
      <section aria-labelledby="overview" className="bg-white px-6 pb-20 pt-8 md:px-10 md:pb-28 xl:px-[60px]">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal variant="none">
            <h2
              id="overview"
              className="mb-8 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] text-ink md:text-[48px]"
            >
              <SplitWords>
                Leading the Industry for Over <span className="block italic text-accent">16 Years</span>
              </SplitWords>
            </h2>
            <p className="rise-late mb-5 text-base leading-[1.8] text-muted md:text-[17px]">
              With over 16 years of continuous development and innovation, our products have earned an
              outstanding reputation in both domestic and international markets. We are committed to
              developing and manufacturing premium medical and beauty equipment, combining cutting-edge
              technology with unwavering dedication to excellence.
            </p>
            <p className="rise-late mb-9 text-base leading-[1.8] text-muted md:text-[17px]">
              Our comprehensive product portfolio spans 14 specialized series, including CO2 laser systems,
              diode laser hair removal machines, 1064nm long pulse ND YAG lasers, picosecond laser
              technology, dental lasers, Q-Switch ND YAG lasers, spider vein removal lasers, multifunctional
              Elight IPL RF ND YAG systems, SHR technology, HIFU devices, LED therapy equipment,
              cryolipolysis slimming machines, cooling beauty systems, and advanced facial care machines.
            </p>
            <Link
              href="/products"
              className="rise-late group inline-flex items-center gap-2 border-b border-navy/20 pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:border-navy"
            >
              Explore our product range
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal variant="none">
            <dl className="stagger grid grid-cols-2 gap-4 md:gap-5">
              {stats.map(({ icon: Icon, to, suffix, label }, i) => (
                <div
                  key={label}
                  style={{ "--i": i } as React.CSSProperties}
                  className={`flex flex-col-reverse rounded-[24px] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8 ${
                    i === 0 ? "theme-dark bg-gradient-m text-white shadow-navy" : "bg-surface ring-1 ring-line"
                  }`}
                >
                  <dt className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${i === 0 ? "text-white/80" : "text-muted"}`}>{label}</dt>
                  <dd>
                    <Icon size={24} className={`mb-5 ${i === 0 ? "text-rose-light" : "text-rose-deep"}`} />
                    <span className={`block font-display text-[44px] font-bold leading-none md:text-[56px] ${i === 0 ? "" : "text-navy"}`}>
                      <CountUp to={to} />
                      {suffix}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Facility */}
      <section aria-labelledby="facility" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader
            id="facility"
            label="Our Facility"
            title={
              <>
                Modernized <span className="italic text-accent">Factory</span>
              </>
            }
            subtitle="State-of-the-art manufacturing facility with stringent quality control measures"
            className="mb-14 md:mb-16"
          />

          <ul className="mb-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mb-16">
            {photos.map((photo, i) => (
              <Reveal
                as="li"
                variant="clip"
                key={photo.src}
                delay={i * 150}
                className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <figure className="group relative overflow-hidden rounded-[28px] shadow-[0_20px_40px_rgb(11_28_49/0.14)]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw"
                    className={`settle w-full object-cover ${
                      i === 0 ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[3/4]" : "aspect-[4/3] sm:aspect-[3/4]"
                    }`}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/0 to-navy-deep/0" />
                  <figcaption className="absolute inset-x-4 bottom-4 inline-flex w-fit transition-transform duration-500 group-hover:-translate-y-1 items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink shadow-lg">
                    <span className="size-1.5 rotate-45 bg-rose" aria-hidden="true" />
                    {photo.label}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          <Reveal as="ul" variant="none" className="stagger grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {facility.map(({ icon: Icon, title, text }, i) => (
              <li key={title} style={{ "--i": i } as React.CSSProperties}>
                <div data-glow className={cardClass}>
                  <span className="mb-6 flex size-14 items-center justify-center rounded-full bg-mist text-navy transition-all duration-500 group-hover:scale-110 group-hover:bg-navy group-hover:text-white">
                    <Icon size={24} />
                  </span>
                  <h3 className="mb-3 font-display text-[22px] font-bold leading-snug text-ink">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* People */}
      <section aria-labelledby="people" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader
            id="people"
            label="Our People"
            title={
              <>
                Expert Sales <span className="italic text-accent">Team</span>
              </>
            }
            subtitle="Professional team members trained with comprehensive knowledge to provide exceptional service"
            className="mb-14 md:mb-16"
          />
          <Reveal as="ul" variant="none" className="stagger grid gap-5 md:grid-cols-3">
            {team.map(({ icon: Icon, title, text }, i) => (
              <li key={title} style={{ "--i": i } as React.CSSProperties}>
                <div data-glow className={`${cardClass} text-center`}>
                  <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-m text-white shadow-navy transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                    <Icon size={26} />
                  </span>
                  <h3 className="mb-3 font-display text-[24px] font-bold leading-snug text-ink">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <ClosingInvite />
    </>
  );
}
