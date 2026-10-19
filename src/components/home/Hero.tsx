import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowRightIcon, BadgeIcon, HeadsetIcon, ShieldIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { HeroParallax } from "./HeroParallax";
import { HeroTitle } from "./HeroTitle";

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

/** Navy fading through the M's mauve; the desktop panel behind the product shot. */
const panelClass = "bg-[linear-gradient(160deg,#0b1c31_0%,#122b49_50%,#2c3b55_78%,#645b67_100%)]";

/**
 * Two compositions sharing one markup:
 * - Below lg the whole hero is navy: the logo's map and the M's mauve and rose glowing
 *   through it, with light type, glass stats and the product shot on a rose halo.
 * - From lg the copy sits on white beside a navy disc edge that carries the product shot.
 */
export function Hero() {
  return (
    <section className="theme-dark-below-lg relative overflow-hidden bg-navy-deep lg:min-h-screen lg:bg-white">
      {/* Mobile and tablet backdrop. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(172deg,#0b1c31_0%,#122b49_42%,#1b3150_68%,#2f3a52_100%)]" />
        <div className="world-map absolute -left-[45%] top-[70px] aspect-[262/124] w-[200%] animate-fade bg-white/[.07] sm:-left-[15%] sm:w-[130%]" />
        <div className="absolute -left-40 top-[38%] size-[380px] rounded-full bg-[radial-gradient(circle,rgb(100_91_103/0.45),transparent_70%)]" />
        <div className="absolute -right-36 bottom-[8%] size-[460px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.38),transparent_65%)] [animation-duration:22s]" />
        {/* A hairline of the M's gradient where the hero meets the trust strip. */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose/60 to-transparent" />
      </div>

      {/* Desktop: a navy disc edge sweeping in from the right, carrying the logo's map. It
          starts at the page centre, where the image column begins, so on any screen width
          it stays clear of the title. */}
      <div aria-hidden="true" className="absolute inset-y-0 left-1/2 right-0 hidden animate-wave-in lg:block">
        <div className={`absolute -right-[5%] -top-[10%] h-[120%] w-[105%] overflow-hidden rounded-l-[50%] ${panelClass}`}>
          <div className="world-map absolute left-[6%] top-[16%] aspect-[262/124] w-[115%] bg-white/[.07]" />
          <div className="absolute -bottom-[15%] -right-[10%] size-[70%] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.45),transparent_65%)]" />
        </div>
        <div className="absolute -bottom-[20%] -right-[10%] h-[60%] w-full animate-blob rounded-t-[50%] bg-rose-light opacity-[.07] [animation-duration:18s]" />
      </div>

      <div className="relative mx-auto grid max-w-[1640px] items-center gap-12 px-6 pb-14 pt-[118px] sm:gap-14 md:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-20 lg:pb-20 lg:pt-[140px] xl:px-[60px]">
        <div>
          <p
            style={rise(0)}
            className="mb-7 inline-flex animate-rise-in items-center gap-3 rounded-full border border-white/15 bg-white/[.07] py-2.5 pl-4 pr-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur lg:mb-8 lg:border-line lg:bg-surface lg:text-ink"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-rose" />
              <span className="relative size-2 rounded-full bg-rose lg:bg-rose-deep" />
            </span>
            <span className="hidden sm:inline">{site.descriptor} · </span>
            {site.markets.join(" · ")}
          </p>
          {/* Sized to its column (never past the panel), capped so it doesn't dwarf the copy. */}
          <HeroTitle className="mb-7 w-full max-w-[600px] max-lg:hero-title-light lg:mb-9 lg:pr-4" />
          <p
            style={rise(0.55)}
            className="mb-9 max-w-[540px] animate-rise-in text-base leading-[1.8] text-white/80 md:text-[17px] lg:mb-10 lg:text-muted"
          >
            Experience the pinnacle of medical aesthetics technology with our comprehensive range of 40+
            advanced devices, transforming beauty standards across 5+ countries.
          </p>
          <div style={rise(0.7)} className="mb-10 flex animate-rise-in flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-14">
            {/* White on navy below lg; the navy primary button on white from lg. */}
            <Link
              href="/products"
              className="btn btn-primary group overflow-hidden max-lg:bg-white max-lg:bg-none max-lg:text-navy max-lg:shadow-[0_12px_30px_rgb(0_0_0/0.3)]"
            >
              {/* Sheen that sweeps across on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
              />
              <span className="relative">Explore Products</span>
              <ArrowRightIcon className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="btn btn-secondary max-lg:border-white/35 max-lg:bg-transparent max-lg:text-white max-lg:hover:border-white max-lg:hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
          {/* Glass panel on navy; an open row with hairline dividers on white. */}
          <dl className="grid grid-cols-4 rounded-[22px] bg-white/[.06] px-2 py-5 ring-1 ring-white/10 backdrop-blur sm:flex sm:w-fit sm:items-center sm:gap-9 sm:px-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:ring-0 lg:backdrop-blur-none">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{ ...rise(0.85), "--i": i } as React.CSSProperties}
                className="flex animate-rise-in items-center gap-9"
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden h-11 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block lg:via-divider"
                  />
                )}
                <div className="flex flex-col-reverse text-center sm:text-left">
                  <dt className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/65 sm:text-[11px] sm:tracking-[0.15em] lg:text-muted">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-[30px] font-bold leading-none text-white sm:text-[40px] lg:text-navy">
                    <CountUp to={stat.value} />
                    <span className="text-rose lg:text-rose-deep">+</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <HeroParallax className="relative mx-auto w-full max-w-[420px] lg:max-w-[540px]">
          {/* Rose halo behind the product shot on navy. */}
          <div
            aria-hidden="true"
            className="absolute -inset-10 animate-fade rounded-full bg-[radial-gradient(circle_at_50%_55%,rgb(202_153_142/0.35),transparent_65%)] lg:hidden"
          />
          <div className="tilt relative">
            <div
              style={{ animationDelay: "0.3s" }}
              className="relative aspect-[4/5] animate-wipe-up overflow-hidden rounded-[28px] bg-[#202020] shadow-[0_30px_60px_rgb(0_0_0/0.4)] ring-1 ring-white/15 lg:aspect-auto lg:h-[600px] lg:shadow-[0_30px_60px_rgb(11_28_49/0.3)] lg:ring-white/10"
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
                className="group absolute inset-x-4 bottom-4 flex animate-rise-in items-center justify-between gap-3 rounded-2xl bg-navy-deep/45 px-5 py-4 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-navy-deep/60"
              >
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-light">New arrival</span>
                  <span className="mt-1 block font-display text-xl font-bold">2-in-1 Diode + Nd:YAG Laser</span>
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

          {/* Phones: the same assurances as a row of glass chips under the shot. */}
          <ul className="relative mt-5 flex flex-wrap justify-center gap-2 sm:hidden">
            {floatingCards.map(({ icon: Icon, title }, i) => (
              <li
                key={title}
                style={{ ...rise(1.2), "--i": i } as React.CSSProperties}
                className="flex animate-rise-in items-center gap-2 rounded-full bg-white/[.08] py-2 pl-2 pr-3.5 text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-navy">
                  <Icon size={13} />
                </span>
                {title}
              </li>
            ))}
          </ul>
        </HeroParallax>
      </div>
    </section>
  );
}
