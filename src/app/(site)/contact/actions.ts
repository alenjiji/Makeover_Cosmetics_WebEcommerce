"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { getProduct, productTitle } from "@/lib/catalog";
import { interestLabel, interestValues, type InquiryFields } from "@/lib/contact";
import { site } from "@/lib/site";

export type FieldName = "name" | "email" | "phone" | "interest" | "message";

export type InquiryState =
  | { status: "idle" }
  | {
      status: "error";
      /** Submitted values, echoed back so the form can be re-filled. */
      values: Partial<Record<FieldName, string>>;
      fieldErrors: Partial<Record<FieldName, string>>;
      formError?: string;
      attempt: number;
    }
  | { status: "success"; name: string; email: string };

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, "Please enter a valid phone number, including country code."),
  interest: z.enum(interestValues, "Please choose a product."),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(5000, "Please keep your message under 5,000 characters."),
});

// In-memory limiter: fine for a single server, but each serverless instance keeps its own
// counts, so swap for a shared store (e.g. Upstash Redis) if abuse becomes a problem.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendInquiry(prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const attempt = prev.status === "error" ? prev.attempt + 1 : 1;
  const values = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    interest: text(formData, "interest"),
    message: text(formData, "message"),
  };

  // Honeypot: real visitors never see this field. Pretend it worked so bots don't retry.
  if (text(formData, "website")) return { status: "success", name: values.name, email: values.email };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", values, fieldErrors, attempt };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      values,
      fieldErrors: {},
      formError: "You've sent several messages in a short time. Please try again in a few minutes, or reach us on WhatsApp.",
      attempt,
    };
  }

  const product = getProduct(text(formData, "product"));
  const inquiry: InquiryFields = {
    ...parsed.data,
    product: product ? productTitle(product) : undefined,
  };

  const sent = await deliver(inquiry);
  if (!sent) {
    return {
      status: "error",
      values,
      fieldErrors: {},
      formError: "We couldn't send your message just now. Please try again, or contact us on WhatsApp or by phone.",
      attempt,
    };
  }

  return { status: "success", name: parsed.data.name, email: parsed.data.email };
}

async function deliver(inquiry: InquiryFields): Promise<boolean> {
  const interest = interestLabel(inquiry.interest);
  const rows: [string, string][] = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Product interest", interest],
    ...(inquiry.product ? [["Product page", inquiry.product] as [string, string]] : []),
  ];
  const subject = `New inquiry: ${inquiry.product ?? interest} – ${inquiry.name}`;
  const plain = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${inquiry.message}`;
  const html = `<h2 style="font-family:sans-serif">New website inquiry</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#56616f">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join("")}</table>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] RESEND_API_KEY is not set; inquiry was not delivered.");
      return false;
    }
    console.info(`[contact] RESEND_API_KEY not set, logging instead of sending.\n${subject}\n${plain}`);
    return true;
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? `${site.name} Website <onboarding@resend.dev>`,
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    replyTo: inquiry.email,
    subject,
    text: plain,
    html,
  });
  if (error) {
    console.error("[contact] Resend failed:", error);
    return false;
  }
  return true;
}
