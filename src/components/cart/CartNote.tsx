"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";

/** Optional order note, saved to the Shopify cart and shown on the order in Shopify admin. */
export function CartNote() {
  const { cart, setNote, pending } = useCart();
  const [open, setOpen] = useState(Boolean(cart.note));
  const [value, setValue] = useState(cart.note ?? "");
  const [saved, setSaved] = useState(false);
  const dirty = value.trim() !== (cart.note ?? "").trim();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] font-semibold text-navy underline decoration-rose/60 underline-offset-4 hover:decoration-navy"
      >
        + Add a note to your order
      </button>
    );
  }

  return (
    <div>
      <label htmlFor="cart-note" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
        Order note
      </label>
      <textarea
        id="cart-note"
        rows={3}
        maxLength={1000}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        placeholder="Voltage and plug type, delivery details, training requests…"
        className="w-full resize-y rounded-xl border border-divider bg-white px-4 py-3 text-[14px] text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/10"
      />
      <div className="mt-2 flex items-center justify-end gap-3">
        {saved && !dirty && (
          <span role="status" className="inline-flex items-center gap-1 text-[12px] text-whatsapp">
            <CheckIcon size={13} /> Saved
          </span>
        )}
        <button
          type="button"
          disabled={pending || !dirty}
          onClick={async () => setSaved(await setNote(value))}
          className="btn btn-secondary btn-sm disabled:opacity-50"
        >
          Save note
        </button>
      </div>
    </div>
  );
}
