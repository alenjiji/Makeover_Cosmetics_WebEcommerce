"use client";

import Link from "next/link";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/icons";
import { formatMoney, PRICE_PLACEHOLDER } from "@/lib/commerce/types";
import { CartNote } from "./CartNote";
import { useCart } from "./CartProvider";

const placeOrderClass = "btn btn-primary btn-lg group w-full whitespace-normal px-5 text-center";

/**
 * Subtotal and "Place Order". With Shopify connected it opens Shopify's secure checkout
 * (payment, shipping, GST); until then it goes to /checkout, which sends the order to
 * the team to confirm price, payment and delivery.
 */
export function CartCheckout({ onNavigate }: { onNavigate?: () => void }) {
  const { cart, pending, error } = useCart();
  const shopify = cart.mode === "shopify";

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-2xl border border-rose/40 bg-blush px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted">Subtotal</span>
        <span className="font-display text-[28px] font-bold text-ink">
          {cart.subtotal && Number(cart.subtotal.amount) > 0 ? formatMoney(cart.subtotal) : PRICE_PLACEHOLDER}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">
        {shopify
          ? "Shipping and taxes are calculated at checkout."
          : "Final prices, shipping and taxes are confirmed by our team before payment."}
      </p>
      {shopify && <CartNote />}
      {shopify ? (
        <a
          href={cart.checkoutUrl}
          aria-disabled={pending || !cart.checkoutUrl}
          className={`${placeOrderClass} ${pending ? "pointer-events-none opacity-70" : ""}`}
        >
          Place Order
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </a>
      ) : (
        <Link href="/checkout" onClick={onNavigate} className={placeOrderClass}>
          Place Order
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
      <p className="flex items-center justify-center gap-2 text-[12px] text-muted">
        <ShieldIcon size={14} className="text-navy" />
        {shopify ? "Secure checkout by Shopify" : "No payment needed to place the order"}
      </p>
    </div>
  );
}
