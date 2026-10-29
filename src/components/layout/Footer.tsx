import Link from "next/link";
import { cacheLife } from "next/cache";
import { TradeRoutes } from "@/components/ui/TradeRoutes";
import { getPolicies } from "@/lib/commerce/shopify";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const productLinks = [
  { href: "/products?category=laser-light", label: "Laser Systems" },
  { href: "/products?category=hifu-machine", label: "HIFU Devices" },
  { href: "/products?category=body-skin", label: "Beauty Equipment" },
  { href: "/products", label: "View All" },
];

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-light">{title}</h2>
      {children}
    </div>
  );
}

const linkClass =
  "inline-block text-sm text-white/75 transition-all hover:translate-x-1 hover:text-white";

export async function Footer() {
  // Store policies from Shopify; none until the store is connected and policies are written.
  const policies = await getPolicies();
  return (
    <footer className="theme-dark relative overflow-hidden bg-[linear-gradient(165deg,#0b1c31_0%,#122b49_70%,#1f3150_100%)] text-white/80">
      {/* The M's rose end, glowing in from the corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-40 size-[560px] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.22),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-[1640px] px-6 md:px-10 xl:px-[60px]">
        {/* Motto, with the logo's three markets on the map. */}
        <div className="grid items-center gap-10 border-b border-white/[.08] py-16 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-light mb-6">{site.markets.join(" · ")}</p>
            <p className=" font-display text-[40px] font-bold leading-[1.05] tracking-[-0.01em] text-white md:text-[56px] xl:text-[64px]">
              Quality Beyond <em className="text-accent text-accent-light">Borders.</em>
            </p>
            <p className="mt-6 max-w-md text-base leading-[1.8] text-white/75">
              Medical aesthetic and dental equipment, exported and imported across India, the UAE and
              China.
            </p>
          </div>
          <TradeRoutes landClassName="bg-white/[.09]" className="-mx-2 lg:mx-0" />
        </div>

        <div className="grid gap-14 border-b border-white/[.08] py-14 lg:grid-cols-[1.4fr_2fr] lg:gap-24">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${site.name} home`} className="mb-6 inline-block">
              <Logo tone="light" />
            </Link>
            <p className="text-sm leading-[1.8] text-white/70">
              16 years of excellence in medical aesthetics. Trusted by professionals worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-14">
            <FooterColumn title="Quick Links">
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/" className={linkClass}>Home</Link></li>
                <li><Link href="/products" className={linkClass}>Products</Link></li>
                <li><Link href="/about" className={linkClass}>About Us</Link></li>
                <li><Link href="/our-services" className={linkClass}>Our Services</Link></li>
                <li><Link href="/global-presence" className={linkClass}>Global Presence</Link></li>
                <li><Link href="/partner-brands" className={linkClass}>Partner Brands</Link></li>
              </ul>
            </FooterColumn>
            <FooterColumn title="Products">
              <ul className="flex flex-col gap-3.5">
                {productLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClass}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
            <FooterColumn title="Connect">
              <ul className="mb-7 flex flex-col gap-3.5">
                <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
              </ul>
              <dl className="flex gap-8">
                {[
                  [site.claims.countries, "Countries"],
                  [site.claims.models, "Models"],
                ].map(([num, label]) => (
                  <div key={label} className="flex flex-col-reverse gap-1.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">{label}</dt>
                    <dd className="font-display text-3xl font-bold leading-none text-rose-light">{num}</dd>
                  </div>
                ))}
              </dl>
            </FooterColumn>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-7 text-center text-[12px] text-white/60 sm:flex-row">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          {policies.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {policies.map((p) => (
                <li key={p.handle}>
                  <Link href={`/policies/${p.handle}`} className="hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="uppercase tracking-[0.15em]">ISO Certified · CE Approved</p>
        </div>
      </div>
    </footer>
  );
}
