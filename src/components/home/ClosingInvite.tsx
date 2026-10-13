import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { site } from "@/lib/site";

const numbers = site.lines.map((line) => `${line.region} ${line.display}`);

const channels = [
  { icon: PhoneIcon, label: "Call us", values: numbers, channel: "call" },
  { icon: WhatsAppIcon, label: "WhatsApp", values: numbers, channel: "whatsapp" },
  { icon: MailIcon, label: "Email", values: [site.email], href: `mailto:${site.email}` },
] as const;

const channelClass =
  "group flex items-center gap-4 rounded-[20px] bg-white/[.07] p-4 ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/[.14] md:p-5";

export function ClosingInvite() {
  return (
    <section aria-labelledby="invite" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <Reveal variant="scale">
        <div className="theme-dark relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-navy px-6 py-14 text-white md:px-16 md:py-20">
          <div aria-hidden="true" className="world-map absolute -left-[5%] top-[10%] aspect-[262/124] w-[110%] bg-white/[.05]" />
          {/* The M's gradient, blooming from the far corner. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-56 -right-40 size-[640px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.5)_0%,rgb(100_91_103/0.35)_40%,transparent_70%)] [animation-duration:26s]"
          />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow eyebrow-light mb-6">We&apos;re here to help</p>
              <h2
                id="invite"
                className="mb-6 font-display text-[34px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[52px]"
              >
                <SplitWords>
                  We&apos;d love to hear about <span className="italic text-accent text-accent-light">your clinic</span>
                </SplitWords>
              </h2>
              <p className="rise-late mb-9 max-w-xl text-[15px] leading-[1.85] text-white/80 md:text-[17px]">
                Tell us about the treatments you offer and where you&apos;re based. We&apos;ll reply within 24
                hours with recommendations and a quote tailored to you.
              </p>
              <Link href="/contact#inquiry" className="rise-late btn btn-light group w-full sm:w-auto">
                Get a Free Quote
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <ul className="stagger flex flex-col gap-3">
              {channels.map((item, i) => {
                const { icon: Icon, label, values } = item;
                const body = (
                  <>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-light">{label}</span>
                      {values.map((value) => (
                        <span key={value} className="block truncate text-[15px] font-bold md:text-base">
                          {value}
                        </span>
                      ))}
                    </span>
                    <ArrowRightIcon className="shrink-0 opacity-70 transition-transform group-hover:translate-x-1" />
                  </>
                );
                return (
                  <li key={label} style={{ "--i": i + 2 } as React.CSSProperties}>
                    {"channel" in item ? (
                      <ContactChooser channel={item.channel} className={channelClass}>
                        {body}
                      </ContactChooser>
                    ) : (
                      <a href={item.href} className={channelClass}>
                        {body}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
