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

export function Welcome() {
  return (
    <section aria-labelledby="welcome" className="bg-surface px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal variant="none">
          <p className="pop eyebrow mb-6">Welcome to {site.name}</p>
          <h2
            id="welcome"
            className="mb-7 font-display text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:text-[46px] xl:text-[54px]"
          >
            <SplitWords>
              Let&apos;s find the <span className="italic text-accent">right machine</span> for your clinic
            </SplitWords>
          </h2>
          <p className="rise-late mb-5 max-w-[600px] text-[15px] leading-[1.85] text-muted md:text-[17px]">
            Since 2009, clinic owners, dermatologists and beauty professionals in 5+ countries
            have trusted us with the equipment behind their treatments.
          </p>
          <p className="rise-late mb-10 max-w-[600px] text-[15px] leading-[1.85] text-muted md:text-[17px]">
            Whether you&apos;re opening your first studio or adding a new service, we&apos;re happy to walk
            you through the options. No pressure, just honest advice from people who know the machines.
          </p>
          <div className="rise-late flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
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
              className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-ink transition-colors hover:text-navy"
            >
              <PhoneIcon size={17} className="text-rose-deep" />
              or call us in the UAE or India
            </ContactChooser>
          </div>
        </Reveal>

        <Reveal as="ul" variant="none" className="stagger flex flex-col gap-4">
          {promises.map(({ icon: Icon, title, text }, i) => (
            <li key={title} style={{ "--i": i + 1 } as React.CSSProperties}>
              <div data-glow className="group relative flex gap-5 rounded-[20px] border border-line bg-white p-6 shadow-card transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-navy/15 hover:shadow-card-hover md:p-7">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-all duration-500 group-hover:scale-110 group-hover:bg-navy group-hover:text-white">
                  <Icon size={24} />
                </span>
                <span>
                  <span className="mb-1.5 block font-display text-[22px] font-semibold text-ink">{title}</span>
                  <span className="block text-[15px] leading-relaxed text-muted">{text}</span>
                </span>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
