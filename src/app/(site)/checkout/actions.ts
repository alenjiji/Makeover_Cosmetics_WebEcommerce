"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getProduct, productTitle, sellsOnline } from "@/lib/catalog";
import { submitForm } from "@/lib/forms";
import { isRateLimited } from "@/lib/rate-limit";

/*
 * Order placement while Shopify isn't connected: the order is sent to the team through
 * Netlify Forms (see src/lib/forms.ts), and the team confirms price, payment and delivery.
 * Once Shopify is connected, "Place Order" goes to Shopify checkout instead.
 */

export type OrderField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "gstin"
  | "address1"
  | "address2"
  | "city"
  | "state"
  | "pincode"
  | "country"
  | "notes";

export type OrderState =
  | { status: "idle" }
  | {
      status: "error";
      values: Partial<Record<OrderField, string>>;
      fieldErrors: Partial<Record<OrderField, string>>;
      formError?: string;
      attempt: number;
    }
  | { status: "success"; orderNumber: string; name: string; email: string };

const optional = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{7,20}$/, "Please enter a valid phone number, including country code."),
  company: optional(120),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => !v || /^[0-9A-Z]{15}$/.test(v), "A GSTIN is 15 letters and digits.")
    .transform((v) => v || undefined),
  address1: z.string().trim().min(5, "Please enter the delivery address.").max(200),
  address2: optional(200),
  city: z.string().trim().min(2, "Please enter the city.").max(80),
  state: z.string().trim().min(2, "Please enter the state or region.").max(80),
  pincode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, "Please enter a valid PIN / postal code."),
  country: z.string().trim().min(2, "Please enter the country.").max(80),
  notes: optional(2000),
});

const itemsSchema = z
  .array(z.object({ slug: z.string().max(120), quantity: z.number().int().min(1).max(99) }))
  .min(1)
  .max(50);

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

/** e.g. MO-261019-7KQ2: date plus a random suffix, easy to read out on the phone. */
function orderNumber() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const suffix = randomBytes(3).toString("hex").slice(0, 4).toUpperCase();
  return `MO-${date}-${suffix}`;
}

export async function placeOrder(prev: OrderState, formData: FormData): Promise<OrderState> {
  const attempt = prev.status === "error" ? prev.attempt + 1 : 1;
  const fields: OrderField[] = ["name", "email", "phone", "company", "gstin", "address1", "address2", "city", "state", "pincode", "country", "notes"];
  const values = Object.fromEntries(fields.map((f) => [f, text(formData, f)])) as Record<OrderField, string>;
  const fail = (formError: string): OrderState => ({ status: "error", values, fieldErrors: {}, formError, attempt });

  // Honeypot: real visitors never see this field.
  if (text(formData, "website")) return { status: "success", orderNumber: orderNumber(), name: values.name, email: values.email };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<OrderField, string>> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as OrderField] ??= issue.message;
    return { status: "error", values, fieldErrors, attempt };
  }

  // Items come from the browser: keep only real catalog products, described by the server.
  let raw: unknown;
  try {
    raw = JSON.parse(text(formData, "items") || "[]");
  } catch {
    raw = [];
  }
  const items = itemsSchema.safeParse(raw);
  const lines = (items.success ? items.data : []).flatMap(({ slug, quantity }) => {
    const product = getProduct(slug);
    return product && sellsOnline(product) ? [{ quantity, title: productTitle(product), slug }] : [];
  });
  if (!lines.length) return fail("Your cart is empty. Add a product before placing an order.");

  if (await isRateLimited("order", 5)) {
    return fail("Several orders were placed from here in a short time. Please try again in a few minutes, or call us.");
  }

  const order = parsed.data;
  const number = orderNumber();
  const address = [order.address1, order.address2, `${order.city}, ${order.state} ${order.pincode}`, order.country]
    .filter(Boolean)
    .join("\n");
  const sent = await submitForm("order", {
    order: number,
    items: lines.map((l) => `${l.quantity} × ${l.title}`).join("\n"),
    name: order.name,
    email: order.email,
    phone: order.phone,
    company: order.company,
    gstin: order.gstin,
    address,
    notes: order.notes,
  });
  if (!sent) return fail("We couldn't place your order just now. Please try again, or call us to order.");

  return { status: "success", orderNumber: number, name: order.name, email: order.email };
}
