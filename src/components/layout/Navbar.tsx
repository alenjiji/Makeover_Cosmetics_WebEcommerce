"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-navy/[.08] bg-white/85 shadow-[0_4px_30px_rgb(18_43_73/0.07)] backdrop-blur-xl"
            : "border-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-[padding] duration-300 md:px-10 xl:px-[60px] ${
            scrolled ? "py-3.5 md:py-4" : "py-4 md:py-6"
          }`}
        >
          <Link href="/" aria-label={`${site.name} home`} className="relative z-[60] shrink-0">
            <Logo compact={scrolled} preload />
          </Link>

          <div className="hidden items-center gap-10 lg:flex xl:gap-12">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                // The navy panel only sits behind the links from lg up.
                className={`group relative text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  overHero
                    ? "text-ink hover:text-navy lg:text-white/85 lg:hover:text-white lg:aria-[current=page]:text-white"
                    : "text-ink/75 hover:text-navy"
                } aria-[current=page]:text-navy`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 ${
                    overHero
                      ? "bg-gradient-to-r from-navy to-rose lg:from-white lg:to-rose-light"
                      : "bg-gradient-to-r from-navy to-rose"
                  }`}
                />
              </Link>
            ))}
            <Link
              href="/contact"
              // Over the hero's navy panel (lg+) it turns white, like .btn-light.
              className={`btn btn-sm btn-primary group ${
                overHero ? "lg:bg-white lg:bg-none lg:text-navy lg:shadow-[0_10px_30px_rgb(0_0_0/0.18)] lg:hover:bg-blush" : ""
              }`}
            >
              Get Quote
              <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            className="relative z-[60] flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-[2px] w-[26px] rounded-full bg-navy transition-all duration-300 ${
                  open && i === 0 ? "translate-x-0 translate-y-[7.5px] rotate-45" : ""
                } ${open && i === 1 ? "opacity-0" : ""} ${
                  open && i === 2 ? "-translate-y-[7.5px] -rotate-45" : ""
                }`}
              />
            ))}
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-white/[.98] backdrop-blur-xl transition-transform duration-400 ease-[cubic-bezier(.4,0,.2,1)] lg:hidden ${
          open ? "translate-x-0" : "invisible translate-x-full"
        }`}
        inert={!open}
      >
        <div className="flex flex-col gap-1 px-8 pb-10 pt-[112px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="border-b border-line py-4 font-display text-[32px] font-medium text-ink aria-[current=page]:italic aria-[current=page]:text-rose-deep"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-8"
          >
            Get Quote
          </Link>
        </div>
        {/* Motto and markets, as a quiet sign-off at the foot of the menu. */}
        <div className="mt-auto px-8 pb-10">
          <p className="font-display text-xl italic text-navy">{site.tagline}.</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted">
            {site.markets.join(" · ")}
          </p>
        </div>
      </div>
    </>
  );
}
