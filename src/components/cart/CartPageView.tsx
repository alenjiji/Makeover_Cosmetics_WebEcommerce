"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, BagIcon, BadgeIcon, HeadsetIcon, ShieldIcon } from "@/components/ui/icons";
import { CartCheckout } from "./CartCheckout";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";

const assurances = [
  { icon: ShieldIcon, text: "ISO certified, CE approved" },
  { icon: HeadsetIcon, text: "Training & 24/7 support" },
  { icon: BadgeIcon, text: "Standard 1–2 year warranty" },
];

/** Full cart: lines on the left, a sticky order summary with "Place Order" on the right. */
export function CartPageView() {
  const { cart, loading, clear, pending } = useCart();

  if (loading) {
    return (
      <div aria-busy="true" className="mx-auto grid max-w-[1640px] animate-pulse gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="h-72 rounded-[28px] bg-white ring-1 ring-line" />
        <div className="h-72 rounded-[28px] bg-white ring-1 ring-line" />
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] bg-white px-8 py-16 text-center shadow-card ring-1 ring-line">
        <span className="mx-auto mb-7 flex size-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,var(--color-mist)_70%)] text-navy">
          <BagIcon size={40} />
        </span>
        <h2 className="mb-3 font-display text-[32px] font-bold text-ink">
          Your cart is <span className="italic text-accent">empty</span>
        </h2>
        <p className="mb-9 text-muted">Browse 40+ models across laser, HIFU, body, facial and dental ranges.</p>
        <Link href="/products" className="btn btn-primary group">
          Browse Products
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1640px] grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
      <section aria-labelledby="cart-items" className="rounded-[28px] bg-white px-6 py-4 shadow-card ring-1 ring-line md:px-10 md:py-6">
        <div className="flex items-center justify-between border-b border-line py-4">
          <h2 id="cart-items" className="font-display text-[26px] font-bold text-ink">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
          </h2>
          <button
            type="button"
            onClick={clear}
            disabled={pending}
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-rose-deep disabled:opacity-50"
          >
            Clear all
          </button>
        </div>
        <CartLines />
        <div className="border-t border-line py-5">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-navy"
          >
            <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" />
            Continue browsing
          </Link>
        </div>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
        <div className="theme-dark relative overflow-hidden rounded-[28px] bg-navy p-5 text-white sm:p-7 md:p-8">
          <div aria-hidden="true" className="world-map absolute inset-x-0 top-0 aspect-[262/124] bg-white/[.06]" />
          <h2 className="relative mb-5 font-display text-[26px] font-bold">
            Order <span className="italic text-accent">summary</span>
          </h2>
          {/* The checkout block is styled for light backgrounds; give it a white card. */}
          <div className="relative rounded-[22px] bg-white p-4 text-ink sm:p-5">
            <CartCheckout />
          </div>
        </div>
        <ul className="grid gap-3 rounded-[24px] bg-white p-5 ring-1 ring-line">
          {assurances.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[14px] font-medium text-ink">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                <Icon size={17} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
