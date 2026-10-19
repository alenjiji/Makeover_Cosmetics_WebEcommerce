"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { placeOrder, type OrderField, type OrderState } from "@/app/(site)/checkout/actions";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, BagIcon, CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { Field, fieldProps, inputClass } from "@/components/ui/form";
import { PRICE_PLACEHOLDER } from "@/lib/commerce/types";
import { useCart } from "./CartProvider";

const initialState: OrderState = { status: "idle" };

/** Checkout while Shopify isn't connected: contact and delivery details, then "Place Order". */
export function CheckoutView() {
  const { cart, loading, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const attempt = state.status === "error" ? state.attempt : 0;
  const values = state.status === "error" ? state.values : {};
  const errors: Partial<Record<OrderField, string>> = state.status === "error" ? state.fieldErrors : {};

  // The order is with the team: empty the cart.
  useEffect(() => {
    if (state.status === "success") clear();
  }, [state.status, clear]);

  // After a failed submit, move focus to the first field that needs fixing.
  useEffect(() => {
    if (attempt) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);

  if (state.status === "success") {
    return (
      <div role="status" className="mx-auto max-w-2xl rounded-[32px] bg-white px-6 py-14 text-center shadow-card ring-1 ring-line md:px-14">
        <span className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full bg-gradient-m text-white shadow-navy">
          <CheckIcon size={36} />
        </span>
        <p className="eyebrow eyebrow-center mb-4">Order {state.orderNumber}</p>
        <h2 className="mb-4 font-display text-[34px] font-bold text-ink md:text-[42px]">
          Thank you, <span className="italic text-accent">{state.name.split(" ")[0]}</span>
        </h2>
        <p className="mx-auto mb-9 max-w-md leading-relaxed text-muted">
          We&apos;ve received your order and sent a confirmation to{" "}
          <strong className="text-ink">{state.email}</strong>. Our team will contact you within 24 hours to
          confirm pricing, payment and delivery.
        </p>
        <Link href="/products" className="btn btn-primary group">
          Continue Browsing
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div aria-busy="true" className="mx-auto h-96 max-w-[1240px] animate-pulse rounded-[28px] bg-white ring-1 ring-line" />;
  }

  // Shopify connected: checkout happens on Shopify.
  if (cart.mode === "shopify") {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] bg-white px-8 py-14 text-center shadow-card ring-1 ring-line">
        <p className="mb-8 text-muted">Checkout is handled securely by Shopify.</p>
        {cart.checkoutUrl ? (
          <a href={cart.checkoutUrl} className="btn btn-primary">
            Continue to Checkout
          </a>
        ) : (
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        )}
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] bg-white px-8 py-16 text-center shadow-card ring-1 ring-line">
        <span className="mx-auto mb-7 flex size-24 items-center justify-center rounded-full bg-mist text-navy">
          <BagIcon size={36} />
        </span>
        <h2 className="mb-3 font-display text-[30px] font-bold text-ink">Your cart is empty</h2>
        <p className="mb-8 text-muted">Add the equipment you need, then place your order here.</p>
        <Link href="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const items = JSON.stringify(cart.lines.map((l) => ({ slug: l.slug, quantity: l.quantity })));

  return (
    <form
      key={attempt}
      ref={formRef}
      action={formAction}
      noValidate
      className="mx-auto grid max-w-[1240px] items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12"
    >
      <div className="space-y-8 rounded-[28px] bg-white p-6 shadow-card ring-1 ring-line sm:p-8 md:p-10">
        {state.status === "error" && state.formError && (
          <div role="alert" className="flex gap-3 rounded-2xl border border-rose/40 bg-blush p-4 text-sm text-ink">
            <AlertIcon size={20} className="mt-0.5 shrink-0 text-rose-deep" />
            <p>{state.formError}</p>
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="mb-5 font-display text-[26px] font-bold text-ink">Contact details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name" error={errors.name}>
              <input {...fieldProps("name", errors)} autoComplete="name" defaultValue={values.name} />
            </Field>
            <Field name="phone" label="Phone" error={errors.phone}>
              <input {...fieldProps("phone", errors)} type="tel" autoComplete="tel" placeholder="+91" defaultValue={values.phone} />
            </Field>
            <Field name="email" label="Email" error={errors.email} className="sm:col-span-2">
              <input {...fieldProps("email", errors)} type="email" autoComplete="email" defaultValue={values.email} />
            </Field>
            <Field name="company" label="Company / clinic" optional error={errors.company}>
              <input {...fieldProps("company", errors, false)} autoComplete="organization" defaultValue={values.company} />
            </Field>
            <Field name="gstin" label="GSTIN" optional error={errors.gstin}>
              <input {...fieldProps("gstin", errors, false)} maxLength={15} placeholder="For a GST invoice" defaultValue={values.gstin} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5 border-t border-line pt-8">
          <legend className="mb-5 font-display text-[26px] font-bold text-ink">Delivery address</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="address1" label="Address" error={errors.address1} className="sm:col-span-2">
              <input {...fieldProps("address1", errors)} autoComplete="address-line1" placeholder="Building, street" defaultValue={values.address1} />
            </Field>
            <Field name="address2" label="Area / landmark" optional error={errors.address2} className="sm:col-span-2">
              <input {...fieldProps("address2", errors, false)} autoComplete="address-line2" defaultValue={values.address2} />
            </Field>
            <Field name="city" label="City" error={errors.city}>
              <input {...fieldProps("city", errors)} autoComplete="address-level2" defaultValue={values.city} />
            </Field>
            <Field name="state" label="State" error={errors.state}>
              <input {...fieldProps("state", errors)} autoComplete="address-level1" defaultValue={values.state} />
            </Field>
            <Field name="pincode" label="PIN code" error={errors.pincode}>
              <input {...fieldProps("pincode", errors)} inputMode="numeric" autoComplete="postal-code" defaultValue={values.pincode} />
            </Field>
            <Field name="country" label="Country" error={errors.country}>
              <input {...fieldProps("country", errors)} autoComplete="country-name" defaultValue={values.country ?? "India"} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="border-t border-line pt-8">
          <Field name="notes" label="Order notes" optional error={errors.notes}>
            <textarea
              {...fieldProps("notes", errors, false)}
              rows={4}
              placeholder="Voltage and plug type, preferred delivery date, training requests…"
              defaultValue={values.notes}
              className={`${inputClass} min-h-[120px] resize-y`}
            />
          </Field>
        </fieldset>

        {/* Honeypot, hidden from people and assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="items" value={items} />
      </div>

      <aside className="space-y-5 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
        <div className="rounded-[28px] bg-white p-6 shadow-card ring-1 ring-line md:p-8">
          <h2 className="mb-2 font-display text-[26px] font-bold text-ink">Your order</h2>
          <ul className="divide-y divide-line">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex items-center gap-4 py-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,var(--color-mist)_70%)]">
                  {line.image && <Image src={line.image} alt="" fill sizes="64px" className="object-contain p-2 mix-blend-multiply" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug text-ink">{line.title}</span>
                  <span className="text-[13px] text-muted">Qty {line.quantity}</span>
                </span>
                <span className="shrink-0 text-[14px] font-semibold text-ink">{PRICE_PLACEHOLDER}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-muted">Subtotal</span>
            <span className="font-display text-[26px] font-bold text-ink">{PRICE_PLACEHOLDER}</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Our team confirms the final price, shipping, GST and payment with you before anything is charged.
          </p>
          <button type="submit" disabled={pending} className="btn btn-primary btn-lg group mt-6 w-full">
            {pending ? (
              <>
                <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Placing order…
              </>
            ) : (
              <>
                Place Order
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-[12px] text-muted">
            <ShieldIcon size={14} className="text-navy" />
            No payment needed to place the order
          </p>
        </div>
        <Link
          href="/cart"
          className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-navy"
        >
          <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" />
          Back to cart
        </Link>
      </aside>
      <p aria-live="polite" className="sr-only">
        {pending ? "Placing your order" : ""}
      </p>
    </form>
  );
}
