"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRightIcon, BagIcon, CloseIcon } from "@/components/ui/icons";
import { CartCheckout } from "./CartCheckout";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";

/** Slide-over cart, opened from the navbar and after adding a product. */
export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, loading } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) dialog.showModal();
    if (!drawerOpen && dialog.open) dialog.close();
  }, [drawerOpen]);

  const empty = !loading && cart.lines.length === 0;

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-drawer-title"
      onClose={closeDrawer}
      onClick={(e) => e.target === e.currentTarget && closeDrawer()}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-[min(100vw,440px)] max-w-none bg-white p-0 text-ink shadow-[-30px_0_60px_rgb(11_28_49/0.25)] backdrop:bg-navy-deep/55 backdrop:backdrop-blur-sm open:animate-[drawer-in_0.45s_var(--ease-out)]"
    >
      <div className="flex h-full flex-col">
        <header className="theme-dark relative flex items-center justify-between overflow-hidden bg-navy px-6 py-5 text-white">
          <div aria-hidden="true" className="world-map absolute inset-y-0 -right-1/4 aspect-[262/124] bg-white/[.07]" />
          <h2 id="cart-drawer-title" className="relative flex items-center gap-3 font-display text-[24px] font-bold">
            <BagIcon size={22} className="text-rose-light" />
            Your Cart
            {cart.totalQuantity > 0 && (
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-sans text-xs font-semibold">{cart.totalQuantity}</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="relative flex size-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <CloseIcon size={20} />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-6 flex size-24 items-center justify-center rounded-full bg-mist text-navy">
              <BagIcon size={36} />
            </span>
            <p className="mb-2 font-display text-[26px] font-bold">Nothing here yet</p>
            <p className="mb-8 text-[15px] text-muted">Browse 40+ models and add the ones you&apos;re interested in.</p>
            <Link href="/products" onClick={closeDrawer} className="btn btn-primary group">
              Browse Products
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <CartLines compact onNavigate={closeDrawer} />
            </div>
            <footer className="border-t border-line bg-surface px-6 py-6">
              <CartCheckout onNavigate={closeDrawer} />
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-4 block text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-navy underline decoration-rose/60 underline-offset-4 hover:decoration-navy"
              >
                View full cart
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
