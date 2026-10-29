import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm, ContactFormFromUrl } from "@/components/contact/ContactForm";
import { Faq } from "@/components/contact/Faq";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  HeadsetIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { SplitWords } from "@/components/ui/SplitWords";
import { faqs } from "@/data/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    `Talk to Makeover Overseas about medical aesthetic and dental equipment: call or WhatsApp our UAE (${site.lines[0].display}) or India (${site.lines[1].display}) lines, or email ${site.email}. Replies within 24 hours.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

const stats = [
  { icon: HeadsetIcon, value: "24/7", label: "Support" },
  { icon: GlobeIcon, value: site.claims.countries, label: "Countries" },
  { icon: ClockIcon, value: "<24h", label: "Response" },
];

const lineValues = site.lines.map((line) => `${line.region} · ${line.display}`);

// Phone and WhatsApp open the UAE/India chooser; email links straight through.
const methods = [
  {
    icon: PhoneIcon,
    label: "Phone",
    values: lineValues,
    channel: "call",
    description: "Call us directly for immediate assistance",
    tone: "bg-mist text-navy",
  },
  {
    icon: MailIcon,
    label: "Email",
    values: [site.email],
    href: `mailto:${site.email}`,
    description: "Send us your detailed inquiries",
    tone: "bg-blush text-rose-deep",
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    values: lineValues,
    channel: "whatsapp",
    description: "Chat with us for quick responses",
    tone: "bg-whatsapp/10 text-whatsapp",
  },
] as const;

const methodClass =
  "group relative flex items-start gap-4 overflow-hidden rounded-[24px] border border-line bg-white p-5 shadow-card transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-top before:scale-y-0 before:bg-gradient-to-b before:from-navy before:to-rose before:transition-transform before:duration-500 hover:translate-x-2 hover:border-navy/15 hover:shadow-card-hover hover:before:scale-y-100 sm:gap-5 md:p-8";

const reasons = [
  "16+ Years Experience",
  `${site.claims.countries} Countries Served`,
  "ISO & CE Certified",
  "24/7 Technical Support",
  "Free Consultation",
  "Worldwide Shipping",
];

function SectionLabel({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return <p className={`eyebrow mb-6 ${center ? "eyebrow-center" : ""}`}>{children}</p>;
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="theme-dark relative overflow-hidden bg-[linear-gradient(165deg,#0b1c31_0%,#122b49_55%,#1d3352_100%)] px-4 pb-16 pt-[124px] sm:px-6 md:px-10 md:pb-24 md:pt-[174px] xl:px-[60px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="world-map absolute -left-[10%] top-[16%] aspect-[262/124] w-[130%] bg-white/[.06] xl:w-[95%]" />
          <div className="absolute -right-24 -top-48 size-[600px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.3),transparent_65%)]" />
          <div className="absolute -bottom-36 -left-24 size-[420px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(100_91_103/0.4),transparent_70%)] [animation-direction:reverse] [animation-duration:25s]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose/60 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-[1640px] items-center gap-12 xl:grid-cols-2 xl:gap-20">
          <div>
            <p className="mb-8 inline-flex animate-pop-in items-center gap-3 rounded-full border border-white/15 bg-white/[.07] py-2.5 pl-4 pr-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping-soft rounded-full bg-rose" />
                <span className="relative size-2 rounded-full bg-rose" />
              </span>
              Let&apos;s Talk
            </p>
            <h1
              style={{ "--split-delay": "0.1s" } as React.CSSProperties}
              className="split-load mb-7 font-display text-[40px] font-bold leading-[1.08] tracking-[-0.01em] text-white sm:text-[48px] md:mb-8 md:text-[60px] xl:text-[72px]"
            >
              <SplitWords>
                Start Your Journey to <span className="italic text-accent">Success</span>
              </SplitWords>
            </h1>
            <p className="mb-10 max-w-[540px] animate-rise-in text-base leading-[1.8] text-white/75 [--rise-delay:.45s] md:text-[17px]">
              Connect with our experts today and discover how our advanced medical beauty equipment
              can transform your business and elevate your services to new heights.
            </p>
            <dl className="flex justify-between gap-3 sm:justify-start sm:gap-8">
              {stats.map(({ icon: Icon, value, label }, i) => (
                <div
                  key={label}
                  style={{ "--i": i } as React.CSSProperties}
                  className="flex flex-1 animate-rise-in flex-col [--rise-delay:.6s] items-center gap-2 text-center sm:flex-none sm:flex-row sm:gap-3 sm:text-left">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-rose-light ring-1 ring-white/15 sm:size-12">
                    <Icon size={22} />
                  </span>
                  <div className="flex flex-col-reverse">
                    <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/65 sm:text-[11px]">{label}</dt>
                    <dd className="font-display text-[24px] font-bold leading-none text-white sm:text-[28px]">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <ul className="flex flex-col gap-4 md:gap-5">
            {methods.map((method, i) => {
              const { icon: Icon, label, values, description, tone } = method;
              const body = (
                <>
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110 sm:size-14 md:size-[72px] ${tone}`}>
                    <Icon size={26} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
                    {values.map((value) => (
                      <span
                        key={value}
                        className="mb-1 block break-words text-base font-bold text-ink transition-colors group-hover:text-navy md:text-lg"
                      >
                        {value}
                      </span>
                    ))}
                    <span className="mt-1.5 block text-[13px] leading-normal text-muted md:text-sm">{description}</span>
                  </span>
                </>
              );
              return (
                <li key={label} style={{ "--i": i } as React.CSSProperties} className="animate-rise-in [--rise-delay:.35s]">
                  {"channel" in method ? (
                    <ContactChooser channel={method.channel} className={methodClass}>
                      {body}
                    </ContactChooser>
                  ) : (
                    <a href={method.href} className={methodClass}>
                      {body}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Form + sidebar */}
      <section id="inquiry" className="scroll-mt-[var(--nav-h)] bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-24 xl:px-[60px] xl:py-[120px]">
        <div className="mx-auto grid max-w-[1640px] items-start gap-10 xl:grid-cols-[1.5fr_1fr] xl:gap-14">
          <div className="relative rounded-[28px] border border-line bg-white p-5 shadow-[0_8px_32px_rgb(18_43_73/0.08)] sm:p-8 md:p-14">
            <header className="mb-10">
              <SectionLabel>Send Message</SectionLabel>
              <h2 className="mb-4 font-display text-[34px] font-bold leading-tight tracking-[-0.01em] text-ink md:text-[48px]">
                How Can We <span className="italic text-accent">Help You?</span>
              </h2>
              <p className="leading-relaxed text-muted">
                Fill out the form below and we&apos;ll get back to you within 24 hours
              </p>
            </header>
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromUrl />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-6 xl:sticky xl:top-[calc(var(--nav-h)+24px)]">
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-card md:p-10">
              <h2 className="mb-6 font-display text-[28px] font-bold text-ink">Why Choose Us?</h2>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-3 text-[15px] font-semibold text-ink">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-m text-white">
                      <CheckIcon size={13} />
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="theme-dark relative overflow-hidden rounded-[24px] bg-navy p-6 text-white md:p-10">
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -right-16 size-72 rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.4),transparent_65%)]"
              />
              <h2 className="relative mb-6 font-display text-[28px] font-bold">Visit Our Office</h2>
              <div className="relative flex gap-4">
                <MapPinIcon size={22} className="mt-1 shrink-0 text-rose-light" />
                <div>
                  <address className="mb-6 text-[15px] not-italic leading-[1.8] text-white/90">
                    {site.addressLines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </address>
                  <a
                    href={site.maps.place}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-light"
                  >
                    Get Directions
                    <ArrowRightIcon />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Map */}
      <section aria-labelledby="location" className="bg-white px-4 py-16 sm:px-6 md:px-10 md:py-24 xl:px-[60px] xl:py-[120px]">
        <div className="mx-auto max-w-[1640px]">
          <div className="mb-12 text-center md:mb-14">
            <SectionLabel center>Find Us</SectionLabel>
            <h2 id="location" className="font-display text-[34px] font-bold tracking-[-0.01em] text-ink md:text-[48px]">
              Our <span className="italic text-accent">Location</span>
            </h2>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-line shadow-[0_30px_60px_rgb(11_28_49/0.14)]">
            <iframe
              src={site.maps.embed}
              title={`Map showing the ${site.name} office at UNIGROVE Business Center, Al Garhoud, Dubai`}
              className="block h-[320px] w-full border-0 md:h-[500px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="bg-surface px-4 py-16 sm:px-6 md:px-10 md:py-24 xl:px-[60px] xl:py-[120px]">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12 text-center md:mb-14">
            <SectionLabel center>FAQ</SectionLabel>
            <h2 id="faq" className="mb-5 font-display text-[34px] font-bold tracking-[-0.01em] text-ink md:text-[48px]">
              Frequently Asked <span className="italic text-accent">Questions</span>
            </h2>
            <p className="mx-auto max-w-[600px] text-[15px] text-muted md:text-[17px]">
              Find answers to common questions about our products and services
            </p>
          </div>
          <Faq items={faqs} />
          <p className="mt-10 text-center text-muted">
            Still have a question?{" "}
            <ContactChooser
              channel="whatsapp"
              message={`Hi ${site.name}, I have a question about your equipment.`}
              className="font-semibold text-navy underline decoration-rose underline-offset-4 hover:decoration-navy"
            >
              Ask us on WhatsApp
            </ContactChooser>
          </p>
        </div>
      </section>
    </>
  );
}
