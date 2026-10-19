"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon, CheckIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";

type Props = {
  slug: string;
  name: string;
  className?: string;
  /** For tight spaces (product cards): the product name goes in the accessible label. */
  compact?: boolean;
  /**
   * Whether Shopify can sell it (priced above ₹0 and for sale). Only matters once Shopify is
   * connected; the local cart takes every product, since orders are confirmed by the team.
   */
  purchasable?: boolean;
};

/** Adds a product, then opens the cart drawer. Errors show inline. */
export function AddToCartButton({ slug, name, className = "", compact = false, purchasable = true }: Props) {
  const { add, openDrawer, cart } = useCart();
  const [state, setState] = useState<"idle" | "adding" | "added" | "error">("idle");

  // Shopify connected but the product isn't priced yet: it can't be ordered online.
  if (cart.mode === "shopify" && !purchasable) {
    return (
      <Link
        href={`/contact?product=${slug}#inquiry`}
        aria-label={compact ? `Ask for the price of ${name}` : undefined}
        className={className}
      >
        Ask for Price
      </Link>
    );
  }

  return (
    <div className={compact ? "contents" : "flex flex-1 flex-col"}>
      <button
        type="button"
        disabled={state === "adding"}
        aria-label={compact ? `Add ${name} to cart` : undefined}
        onClick={async () => {
          setState("adding");
          if (await add(slug, 1)) {
            setState("added");
            openDrawer();
            setTimeout(() => setState("idle"), 1800);
          } else {
            setState("error");
          }
        }}
        className={className}
      >
        {state === "adding" ? (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
        ) : state === "added" ? (
          <CheckIcon size={16} />
        ) : (
          <BagIcon size={16} />
        )}
        {state === "added" ? "Added" : state === "error" && compact ? "Unavailable" : "Add to Cart"}
      </button>
      {state === "error" && !compact && (
        <p role="alert" className="mt-2 text-[13px] text-rose-deep">
          Couldn&apos;t add this item right now. Please try again, or send us an inquiry.
        </p>
      )}
    </div>
  );
}
