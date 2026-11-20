import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";
import { ArrowRightIcon, BagIcon, TruckIcon } from "@/components/ui/icons";
import { getProduct } from "@/lib/catalog";
import { getPriceMap } from "@/lib/commerce/shopify";
import { formatMoney, isListed } from "@/lib/commerce/types";
import { site } from "@/lib/site";
import { HeroShowcase, type ShowcaseItem } from "./HeroShowcase";
import { HeroTitle } from "./HeroTitle";

const stats = [
  { value: 5, label: "Countries" },
  { value: 16, label: "Years" },
  { value: 40, label: "Models" },
  { value: 14, label: "Series" },
];

// Products on the hero's stage, in order: one per kind of buyer, each with a clean product shot.
const showcase = [
  "7-in-1-hydrafacial-machine",
  "rechargeable-led-light-therapy-mask",
  "ultima-a11-wireless-microneedling-pen",
  "2-in-1-fractional-rf-microneedling-machine",
  "plasma-pen-pink",
];

// What buying online involves, beside the stage.
const assurances = [
  { icon: BagIcon, title: "Order online", text: "Secure checkout" },
  { icon: TruckIcon, title: "Ships across India", text: "7–15 business days" },
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
export async function Hero() {
  // Featured products Shopify lists for sale; prices shown once they're priced.
  const prices = await getPriceMap();
  const items: ShowcaseItem[] = showcase.flatMap((slug) => {
    const product = getProduct(slug);
    if (!product || !isListed(slug, prices)) return [];
    const price = prices[slug];
    return [
      {
        slug,
        name: product.name,
        category: product.category,
        image: product.image,
        alt: product.alt,
        price: price?.purchasable ? formatMoney(price.price) : undefined,
      },
    ];
  });

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

      <div className="relative mx-auto grid max-w-[1640px] items-center px-6 pb-14 pt-[118px] md:px-10 lg:min-h-screen lg:grid-cols-2 lg:gap-20 lg:pb-20 lg:pt-[140px] xl:px-[60px]">
        {/* Below lg this column dissolves (contents) so phones see the products straight after the title. */}
        <div className="max-lg:contents">
          <p
            style={rise(0)}
            className="mb-7 inline-flex w-fit animate-rise-in max-lg:order-1 items-center gap-3 rounded-full border border-white/15 bg-white/[.07] py-2.5 pl-4 pr-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur lg:mb-8 lg:border-line lg:bg-surface lg:text-ink"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-rose" />
              <span className="relative size-2 rounded-full bg-rose lg:bg-rose-deep" />
            </span>
            <span className="hidden sm:inline">{site.descriptor} · </span>
            {site.markets.join(" · ")}
          </p>
          {/* Sized to its column (never past the panel), capped so it doesn't dwarf the copy. */}
          <HeroTitle className="mb-7 w-full max-w-[600px] max-lg:order-2 max-lg:hero-title-light lg:mb-9 lg:pr-4" />
          <p
            style={rise(0.55)}
            className="mb-9 max-w-[540px] animate-rise-in text-base max-lg:order-4 leading-[1.8] text-white/80 md:text-[17px] lg:mb-10 lg:text-muted"
          >
            Professional aesthetic machines, plus the devices, derma pens, cartridges and skin-care supplies
            clinics and salons use every day: order online and we deliver across India.
          </p>
          <div style={rise(0.7)} className="mb-10 flex animate-rise-in flex-col gap-3 max-lg:order-5 sm:flex-row sm:gap-4 lg:mb-14">
            {/* White on navy below lg; the navy primary button on white from lg. */}
            <Link
              href="/products#shop"
              className="btn btn-primary group overflow-hidden max-lg:bg-white max-lg:bg-none max-lg:text-navy max-lg:shadow-[0_12px_30px_rgb(0_0_0/0.3)]"
            >
              {/* Sheen that sweeps across on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
              />
              <span className="relative">Shop Products</span>
              <ArrowRightIcon className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products#machines"
              className="btn btn-secondary max-lg:border-white/35 max-lg:bg-transparent max-lg:text-white max-lg:hover:border-white max-lg:hover:bg-white/10"
            >
              Machines on Inquiry
            </Link>
          </div>
          {/* Glass panel on navy; an open row with hairline dividers on white. */}
          <dl className="grid grid-cols-4 rounded-[22px] max-lg:order-6 bg-white/[.06] px-2 py-5 ring-1 ring-white/10 backdrop-blur sm:flex sm:w-fit sm:items-center sm:gap-9 sm:px-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:ring-0 lg:backdrop-blur-none">
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

        <div style={rise(0.35)} className="relative mx-auto mb-10 w-full max-w-[440px] animate-rise-in max-lg:order-3 lg:mb-0 lg:max-w-[480px]">
          {/* Rose halo behind the stage on navy. */}
          <div
            aria-hidden="true"
            className="absolute -inset-10 animate-fade rounded-full bg-[radial-gradient(circle_at_50%_55%,rgb(202_153_142/0.35),transparent_65%)] lg:hidden"
          />
          <div className="relative">
            <HeroShowcase items={items} />
          </div>
          <ul className="relative mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            {assurances.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                style={{ ...rise(1), "--i": i } as React.CSSProperties}
                className="flex animate-rise-in items-center gap-3 rounded-2xl bg-white/[.08] px-3 py-3 ring-1 ring-white/15 backdrop-blur lg:bg-white/95 lg:shadow-float lg:ring-navy/5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-navy lg:bg-mist">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold leading-tight text-white lg:text-ink">{title}</span>
                  <span className="mt-0.5 block text-[10px] uppercase leading-snug tracking-[0.1em] text-white/65 sm:text-[11px] lg:text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
