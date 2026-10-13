import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowRightIcon, BadgeIcon, HeadsetIcon, ShieldIcon } from "@/components/ui/icons";
import { SplitWords } from "@/components/ui/SplitWords";
import { site } from "@/lib/site";
import { HeroParallax } from "./HeroParallax";

const stats = [
  { value: 5, label: "Countries" },
  { value: 16, label: "Years" },
  { value: 40, label: "Models" },
  { value: 14, label: "Series" },
];

// depth: how far each card drifts with the cursor (negative moves against it).
const floatingCards = [
  { icon: ShieldIcon, title: "ISO Certified", text: "Quality Assured", position: "left-0 top-[8%] lg:-left-[10%] lg:top-[10%]", depth: 28, delay: 1.0 },
  { icon: BadgeIcon, title: "CE Approved", text: "EU Standards", position: "right-0 top-[46%] lg:-right-[8%] lg:top-1/2", depth: -22, delay: 1.2 },
  { icon: HeadsetIcon, title: "24/7 Support", text: "Always Available", position: "bottom-[22%] left-[4%] lg:-left-[12%] lg:bottom-[24%]", depth: 16, delay: 1.4 },
];

const rise = (seconds: number) => ({ "--rise-delay": `${seconds}s` }) as React.CSSProperties;

/** Navy fading through the M's mauve; used for the panel behind the product shot. */
const panelClass = "bg-[linear-gradient(160deg,#0b1c31_0%,#122b49_50%,#2c3b55_78%,#645b67_100%)]";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white lg:min-h-screen">
      {/* Desktop: a navy disc edge sweeping in from the right, carrying the logo's map.
          On small screens a panel sits behind the image instead. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[55%] animate-wave-in lg:block">
        <div className={`absolute -right-[5%] -top-[10%] h-[120%] w-[105%] overflow-hidden rounded-l-[50%] ${panelClass}`}>
          <div className="world-map absolute left-[6%] top-[16%] aspect-[262/124] w-[115%] bg-white/[.07]" />
          <div className="absolute -bottom-[15%] -right-[10%] size-[70%] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.45),transparent_65%)]" />
        </div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[60%] w-full animate-blob rounded-t-[50%] bg-rose-light opacity-[.07] [animation-duration:18s]" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-6 pb-16 pt-[124px] md:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-20 lg:pb-20 lg:pt-[140px] xl:px-[60px]">
        <div>
          <p
            style={rise(0)}
            className="mb-8 inline-flex animate-rise-in items-center gap-3 rounded-full border border-line bg-surface py-2.5 pl-4 pr-5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink sm:text-[11px]"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-rose" />
              <span className="relative size-2 rounded-full bg-rose-deep" />
            </span>
            <span className="hidden sm:inline">{site.descriptor} · </span>
            {site.markets.join(" · ")}
          </p>
          <h1
            style={{ "--split-delay": "0.15s" } as React.CSSProperties}
            className="split-load opsz-auto mb-8 font-display text-[54px] font-medium leading-[1.02] tracking-[-0.025em] text-ink sm:text-[68px] lg:text-[76px] xl:text-[92px]"
          >
            <SplitWords>
              Quality Beyond <span className="italic text-accent">Borders.</span>
            </SplitWords>
          </h1>
          <p
            style={rise(0.55)}
            className="mb-10 max-w-[540px] animate-rise-in text-[15px] leading-[1.85] text-muted md:text-[17px]"
          >
            Experience the pinnacle of medical aesthetics technology with our comprehensive range of 40+
            advanced devices, transforming beauty standards across 5+ countries.
          </p>
          <div style={rise(0.7)} className="mb-12 flex animate-rise-in flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-14">
            <Link href="/products" className="btn btn-primary group overflow-hidden">
              {/* Sheen that sweeps across on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
              />
              <span className="relative">Explore Products</span>
              <ArrowRightIcon className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
          <dl className="grid grid-cols-4 sm:flex sm:items-center sm:gap-9">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{ ...rise(0.85), "--i": i } as React.CSSProperties}
                className="flex animate-rise-in items-center gap-9"
              >
                {i > 0 && (
                  <span aria-hidden="true" className="hidden h-11 w-px bg-gradient-to-b from-transparent via-divider to-transparent sm:block" />
                )}
                <div className="flex flex-col-reverse text-center sm:text-left">
                  <dt className="mt-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted sm:text-[11px] sm:tracking-[0.2em]">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-[30px] font-medium leading-none text-navy sm:text-[40px]">
                    <CountUp to={stat.value} />
                    <span className="text-rose-deep">+</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <HeroParallax className="relative mx-auto w-full max-w-[420px] lg:max-w-[540px]">
          <div
            aria-hidden="true"
            className={`absolute -inset-x-6 -bottom-6 top-12 animate-wave-in overflow-hidden rounded-[40px] lg:hidden ${panelClass}`}
          >
            <div className="world-map absolute -left-[20%] top-[8%] aspect-[262/124] w-[160%] bg-white/[.07]" />
          </div>
          <div className="tilt relative">
            <div
              style={{ animationDelay: "0.3s" }}
              className="relative aspect-[4/5] animate-wipe-up overflow-hidden rounded-[28px] bg-[#202020] shadow-[0_30px_60px_rgb(11_28_49/0.3)] ring-1 ring-white/10 lg:aspect-auto lg:h-[600px]"
            >
              <Image
                src="/images/home/hero-2in1.webp"
                alt="2-in-1 diode laser and Nd:YAG laser platform"
                fill
                preload
                sizes="(min-width: 1024px) 540px, 420px"
                className="animate-settle object-cover object-[50%_30%]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-navy/25 via-transparent to-rose/10" />
              <Link
                href="/products/2-in-1-diode-nd-yag-laser"
                style={rise(1.1)}
                className="group absolute inset-x-4 bottom-4 flex animate-rise-in items-center justify-between gap-3 rounded-2xl bg-navy-deep/40 px-5 py-4 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-navy-deep/60"
              >
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-light">New arrival</span>
                  <span className="mt-1 block font-display text-xl font-medium">2-in-1 Diode + Nd:YAG Laser</span>
                </span>
                <ArrowRightIcon size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {floatingCards.map(({ icon: Icon, title, text, position, depth, delay }) => (
            <div
              key={title}
              data-depth
              style={{ "--depth": depth } as React.CSSProperties}
              className={`absolute hidden sm:block ${position}`}
            >
              <div
                style={{
                  animation: `pop-in 0.8s var(--ease-spring) ${delay}s both, hero-float 3.4s ease-in-out ${delay + 0.8}s infinite`,
                }}
                className="flex items-center gap-4 rounded-2xl bg-white/95 py-4 pl-4 pr-6 shadow-float ring-1 ring-navy/5 backdrop-blur"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="text-[14px] font-bold leading-tight text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </HeroParallax>
      </div>
    </section>
  );
}
