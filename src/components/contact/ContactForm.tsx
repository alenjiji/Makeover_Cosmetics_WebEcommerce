"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendInquiry, type FieldName, type InquiryState } from "@/app/(site)/contact/actions";
import { getProduct, productTitle } from "@/lib/catalog";
import { inquiryWhatsappMessage, interestForCategory, interestOptions } from "@/lib/contact";
import { ContactChooser } from "@/components/ui/ContactChooser";
import type { Product } from "@/data/products";
import { site } from "@/lib/site";
import { AlertIcon, ArrowRightIcon, CheckIcon, CloseIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Reads `?product=<slug>`; must render inside <Suspense>. */
export function ContactFormFromUrl() {
  const slug = useSearchParams().get("product");
  return <ContactForm product={slug ? getProduct(slug) : undefined} />;
}

/** Remounting via `key` is how "Send another message" resets the action state. */
export function ContactForm({ product }: { product?: Product }) {
  const [round, setRound] = useState(0);
  return <InquiryForm key={round} product={product} onReset={() => setRound((r) => r + 1)} />;
}

const initialState: InquiryState = { status: "idle" };

function InquiryForm({ product: initialProduct, onReset }: { product?: Product; onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendInquiry, initialState);
  const [product, setProduct] = useState(initialProduct);
  const formRef = useRef<HTMLFormElement>(null);

  const attempt = state.status === "error" ? state.attempt : 0;
  const values = state.status === "error" ? state.values : {};
  const errors = state.status === "error" ? state.fieldErrors : {};

  // After a failed submit, move focus to the first field that needs fixing.
  useEffect(() => {
    if (attempt) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);

  if (state.status === "success") {
    return (
      <div role="status" className="py-6 text-center">
        <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-m text-white shadow-navy">
          <CheckIcon size={30} />
        </span>
        <h3 className="mb-3 font-display text-[34px] font-bold text-ink">Message sent</h3>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-muted">
          Thanks, {state.name}. We&apos;ve received your inquiry and will reply to{" "}
          <strong className="text-ink">{state.email}</strong> within 24 hours.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onReset} className="btn btn-secondary btn-sm">
            Send another message
          </button>
          <Link href="/products" className="btn btn-primary btn-sm">
            Browse products
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    );
  }

  const fallbackInterest = product ? interestForCategory(product.category) : "";

  return (
    <form
      // Remount on each failed attempt so the echoed values become the new defaults.
      key={attempt}
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
    >
      {product && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose/30 bg-blush p-3 pr-4">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white">
            <Image src={product.image} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-rose-deep">
              Asking about
            </span>
            <span className="block truncate font-semibold text-ink">{productTitle(product)}</span>
          </span>
          <button
            type="button"
            onClick={() => setProduct(undefined)}
            aria-label="Remove product from inquiry"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white hover:text-ink"
          >
            <CloseIcon size={16} />
          </button>
          <input type="hidden" name="product" value={product.slug} />
        </div>
      )}

      {state.status === "error" && state.formError && (
        <div role="alert" className="flex gap-3 rounded-2xl border border-rose/40 bg-blush p-4 text-sm text-ink">
          <AlertIcon size={20} className="mt-0.5 shrink-0 text-rose-deep" />
          <p>{state.formError}</p>
        </div>
      )}

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <Field name="name" label="Full Name" error={errors.name}>
          <input
            {...fieldProps("name", errors)}
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            defaultValue={values.name}
          />
        </Field>
        <Field name="email" label="Email Address" error={errors.email}>
          <input
            {...fieldProps("email", errors)}
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            defaultValue={values.email}
          />
        </Field>
        <Field name="phone" label="Phone Number" error={errors.phone}>
          <input
            {...fieldProps("phone", errors)}
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            defaultValue={values.phone}
          />
        </Field>
        <Field name="interest" label="Product Interest" error={errors.interest}>
          <select
            {...fieldProps("interest", errors)}
            defaultValue={values.interest ?? fallbackInterest}
            className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%23444d5a'%20stroke-width='2'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[position:right_18px_center] bg-no-repeat pr-12`}
          >
            <option value="" disabled>
              Select a product
            </option>
            {interestOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field name="message" label="Your Message" error={errors.message}>
        <textarea
          {...fieldProps("message", errors)}
          rows={5}
          placeholder="Tell us about your requirements..."
          defaultValue={values.message}
          className={`${inputClass} min-h-[132px] resize-y`}
        />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary btn-lg group"
        >
          {pending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send Message
              <ArrowRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        <ContactChooser
          channel="whatsapp"
          message={`Hi ${site.name}, I'd like to ask about your equipment.`}
          getMessage={() => {
            // Carry over whatever has been typed, in the legacy message format.
            if (!formRef.current) return `Hi ${site.name}, I'd like to ask about your equipment.`;
            const data = new FormData(formRef.current);
            const get = (key: string) => String(data.get(key) ?? "").trim();
            return inquiryWhatsappMessage({
              name: get("name"),
              email: get("email"),
              phone: get("phone"),
              interest: get("interest"),
              message: get("message"),
              product: product ? productTitle(product) : undefined,
            });
          }}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-whatsapp underline-offset-4 hover:underline"
        >
          <WhatsAppIcon size={18} />
          Chat on WhatsApp instead
        </ContactChooser>
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? "Sending your message" : ""}
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-divider bg-surface px-5 py-4 text-[15px] text-ink transition-all placeholder:text-muted/70 focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10 aria-invalid:border-rose-deep aria-invalid:bg-blush";

function fieldProps(name: FieldName, errors: Partial<Record<FieldName, string>>) {
  return {
    id: name,
    name,
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  };
}

function Field({
  name,
  label,
  error,
  children,
}: {
  name: FieldName;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-deep">
          <AlertIcon size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
