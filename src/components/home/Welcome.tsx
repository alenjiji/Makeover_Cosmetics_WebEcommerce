import { GraduationIcon, HeadsetIcon, PhoneIcon, ShieldIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { site } from "@/lib/site";

const promises = [
  {
    icon: ShieldIcon,
    title: "Free consultation",
    text: "Tell us your treatments and budget, and we'll help you compare the right models.",
  },
  {
    icon: GraduationIcon,
    title: "Training included",
    text: "Training materials, video tutorials and technical support from day one.",
  },
  {
    icon: HeadsetIcon,
    title: "Support that answers",
    text: "24/7 technical support, with replies to every inquiry within 24 hours.",
  },
];

/** Editorial welcome: a statement on the left, the three promises as a numbered list on the logo's disc. */
export function Welcome() {
  return (
    <section aria-labelledby="welcome" className="relative overflow-hidden bg-white px-6 py-24 md:px-10 md:py-32 xl:px-[60px]">
      {/* The logo's mist disc, half off the page, behind the promises. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30%] top-1/2 aspect-square w-[95%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f7f8f7_0%,var(--color-mist)_70%)] md:-right-[18%] md:w-[70%] lg:-right-[10%] lg:w-[52%]"
      >
        <div className="world-map absolute inset-x-[12%] top-[30%] aspect-[262/124] bg-navy/[.06]" />
      </div>

      <div className="relative mx-auto grid max-w-[1640px] items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <Reveal variant="none">
          <p className="pop eyebrow mb-6">Welcome to {site.name}</p>
          <h2
            id="welcome"
            className="mb-8 font-display text-[36px] font-bold leading-[1.08] tracking-[-0.01em] text-ink md:text-[50px] xl:text-[60px]"
          >
            <SplitWords>
              Let&apos;s find the <span className="italic text-accent">right machine</span> for your clinic
            </SplitWords>
          </h2>
          <p className="rise-late mb-5 max-w-[580px] text-base leading-[1.8] text-muted md:text-[17px]">
            Since 2009, clinic owners, dermatologists and beauty professionals in 5+ countries
            have trusted us with the equipment behind their treatments.
          </p>
          <p className="rise-late mb-10 max-w-[580px] text-base leading-[1.8] text-muted md:text-[17px]">
            Whether you&apos;re opening your first studio or adding a new service, we&apos;re happy to walk
            you through the options. No pressure, just honest advice from people who know the machines.
          </p>
          <div className="rise-late flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <ContactChooser
              channel="whatsapp"
              message={`Hi ${site.name}! I'd like some advice on equipment for my clinic.`}
              className="btn btn-whatsapp"
            >
              <WhatsAppIcon size={18} />
              Say Hello on WhatsApp
            </ContactChooser>
            <ContactChooser
              channel="call"
              className="inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold text-ink underline decoration-rose/60 underline-offset-[6px] transition-colors hover:text-navy hover:decoration-navy"
            >
              <PhoneIcon size={17} className="text-rose-deep" />
              or call us in the UAE or India
            </ContactChooser>
          </div>
        </Reveal>

        <Reveal as="ol" variant="none" className="stagger relative rounded-[32px] bg-white/70 p-3 shadow-[0_30px_80px_rgb(18_43_73/0.1)] ring-1 ring-white backdrop-blur-sm md:p-4">
          {promises.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              style={{ "--i": i + 1 } as React.CSSProperties}
              className="group relative flex flex-col gap-3 rounded-[24px] p-6 transition-colors duration-500 hover:bg-navy sm:flex-row sm:gap-7 md:p-8"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-rose/50 to-transparent transition-opacity group-hover:opacity-0"
                />
              )}
              <span className="font-display text-[38px] font-bold italic leading-none text-rose-deep transition-colors duration-500 group-hover:text-rose-light sm:text-[48px] md:text-[54px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sm:pt-1">
                <span className="mb-2 flex items-center gap-3 font-display text-[22px] font-bold text-ink transition-colors duration-500 group-hover:text-white md:text-[25px]">
                  {title}
                  <Icon size={20} className="hidden text-navy/40 transition-colors duration-500 group-hover:text-rose-light sm:block" />
                </span>
                <span className="block text-[15px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/80">
                  {text}
                </span>
              </span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
