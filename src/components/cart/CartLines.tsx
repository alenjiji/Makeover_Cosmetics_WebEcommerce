"use client";

import Image from "next/image";
import Link from "next/link";
import { formatMoney, PRICE_PLACEHOLDER } from "@/lib/commerce/types";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";

/** Cart lines with quantity steppers. Used by the drawer and the cart page. */
export function CartLines({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { cart, pending, setQuantity, remove } = useCart();

  return (
    <ul className="divide-y divide-line">
      {cart.lines.map((line) => (
        <li key={line.id} className={`flex gap-4 ${compact ? "py-4" : "py-6"}`}>
          <Link
            href={`/products/${line.slug}`}
            onClick={onNavigate}
            className={`relative shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,var(--color-mist)_70%)] ${
              compact ? "size-20" : "size-24 md:size-28"
            }`}
          >
            {line.image && (
              <Image src={line.image} alt="" fill sizes="112px" className="object-contain p-3 mix-blend-multiply" />
            )}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/products/${line.slug}`}
                onClick={onNavigate}
                className={`font-display font-bold leading-snug text-ink hover:text-navy ${compact ? "text-[17px]" : "text-[20px]"}`}
              >
                {line.title}
              </Link>
              <span className="shrink-0 text-[15px] font-semibold text-ink">
                {line.total && Number(line.total.amount) > 0 ? formatMoney(line.total) : PRICE_PLACEHOLDER}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-full ring-1 ring-divider">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                  aria-label={`Decrease quantity of ${line.title}`}
                  className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist disabled:opacity-50"
                >
                  <MinusIcon size={14} />
                </button>
                <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-label={`Quantity ${line.quantity}`}>
                  {line.quantity}
                </span>
                <button
                  type="button"
                  disabled={pending || line.quantity >= 99}
                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                  aria-label={`Increase quantity of ${line.title}`}
                  className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist disabled:opacity-50"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => remove(line.id)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted transition-colors hover:text-rose-deep disabled:opacity-50"
              >
                <TrashIcon size={14} />
                Remove
              </button>
            </div>
            {line.price && line.quantity > 1 && (
              <p className="text-[12px] text-muted">{formatMoney(line.price)} each</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
