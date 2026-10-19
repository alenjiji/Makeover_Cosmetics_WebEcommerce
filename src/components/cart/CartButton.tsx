"use client";

import { BagIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";

/** Navbar cart icon with a count badge. `light` for navy backgrounds. */
export function CartButton({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const { cart, openDrawer } = useCart();
  const count = cart.totalQuantity;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={count ? `Open cart, ${count} ${count === 1 ? "item" : "items"}` : "Open cart"}
      className={`relative flex size-11 items-center justify-center rounded-full transition-colors ${
        light ? "text-white hover:bg-white/10" : "text-navy hover:bg-mist"
      } ${className}`}
    >
      <BagIcon size={22} />
      {count > 0 && (
        <span
          key={count}
          className="absolute -right-0.5 -top-0.5 flex min-w-5 animate-pop-in items-center justify-center rounded-full bg-rose-deep px-1.5 text-[11px] font-bold leading-5 text-white ring-2 ring-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
