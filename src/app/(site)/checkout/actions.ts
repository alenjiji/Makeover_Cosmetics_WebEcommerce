"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getProduct, productTitle } from "@/lib/catalog";
import { detailsTable, escapeHtml, sendMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/*
 * Order placement while Shopify isn't connected: the order is emailed to the team (who
 * confirm price, payment and delivery) and a confirmation goes to the customer. Once
 * Shopify is connected, "Place Order" goes to Shopify checkout instead.
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
    return product ? [{ quantity, title: productTitle(product), slug }] : [];
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
  const itemsText = lines.map((l) => `${l.quantity} × ${l.title}`).join("\n");
  const itemsHtml = `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;margin:12px 0">${lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 16px 6px 0;font-weight:bold">${l.quantity} ×</td><td style="padding:6px 0"><a href="${site.url}/products/${l.slug}">${escapeHtml(l.title)}</a></td></tr>`,
    )
    .join("")}</table>`;

  const rows: [string, string][] = [
    ["Order", number],
    ["Name", order.name],
    ["Email", order.email],
    ["Phone", order.phone],
    ...(order.company ? [["Company / clinic", order.company] as [string, string]] : []),
    ...(order.gstin ? [["GSTIN", order.gstin] as [string, string]] : []),
    ["Deliver to", address],
    ...(order.notes ? [["Notes", order.notes] as [string, string]] : []),
  ];

  const toTeam = await sendMail({
    subject: `New order ${number} – ${order.name} (${lines.reduce((n, l) => n + l.quantity, 0)} items)`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nItems:\n${itemsText}`,
    html: `<h2 style="font-family:sans-serif">New website order ${number}</h2>${itemsHtml}${detailsTable(rows)}`,
    replyTo: order.email,
  });
  if (!toTeam) return fail("We couldn't place your order just now. Please try again, or call us to order.");

  // Confirmation for the customer: best effort, the order is already with the team.
  await sendMail({
    to: order.email,
    replyTo: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER || site.email,
    subject: `We've received your order ${number} – ${site.name}`,
    text: `Hi ${order.name},\n\nThank you for your order. Our team will contact you within 24 hours to confirm pricing, payment and delivery.\n\nOrder ${number}\n${itemsText}\n\nDeliver to:\n${address}\n\n${site.name}`,
    html: `<div style="font-family:sans-serif;font-size:15px;color:#101b2b;line-height:1.6">
<p>Hi ${escapeHtml(order.name)},</p>
<p>Thank you for your order. Our team will contact you within 24 hours to confirm pricing, payment and delivery.</p>
<h3 style="margin:24px 0 4px">Order ${number}</h3>${itemsHtml}
<p style="white-space:pre-line"><strong>Deliver to</strong><br>${escapeHtml(address)}</p>
<p>${site.name}<br>${site.tagline}</p></div>`,
  });

  return { status: "success", orderNumber: number, name: order.name, email: order.email };
}
