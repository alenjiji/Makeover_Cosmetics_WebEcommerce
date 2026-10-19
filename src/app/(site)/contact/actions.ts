"use server";

import { z } from "zod";
import { getProduct, productTitle } from "@/lib/catalog";
import { interestLabel, interestValues, type InquiryFields } from "@/lib/contact";
import { detailsTable, escapeHtml, sendMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";

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

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

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

  if (await isRateLimited("contact")) {
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
${detailsTable(rows)}
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>`;

  return sendMail({ subject, text: plain, html, replyTo: inquiry.email });
}
