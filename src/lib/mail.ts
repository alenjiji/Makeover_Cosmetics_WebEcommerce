import nodemailer from "nodemailer";
import { Resend } from "resend";
import { site } from "@/lib/site";

type Mail = {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  /** Recipient. Defaults to the business inbox (CONTACT_TO_EMAIL); set it to email a customer. */
  to?: string;
};

/**
 * Sends an email through the provider chosen by EMAIL_PROVIDER:
 * - "resend" (default): RESEND_API_KEY, sending from a domain verified in Resend.
 * - "gmail": GMAIL_USER + GMAIL_APP_PASSWORD over Gmail SMTP. A stopgap until the
 *   company domain's email is set up; Gmail only sends as the account itself.
 * With no credentials, development logs the email instead; production reports failure.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER === "gmail" ? "gmail" : "resend";
  const ready =
    provider === "gmail"
      ? Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
      : Boolean(process.env.RESEND_API_KEY);

  if (!ready) {
    if (process.env.NODE_ENV === "production") {
      console.error(`[mail] ${provider} credentials are not set; "${mail.subject}" was not delivered.`);
      return false;
    }
    console.info(`[mail] ${provider} not configured, logging instead of sending.\n${mail.subject}\n${mail.text}`);
    return true;
  }

  try {
    return provider === "gmail" ? await sendWithGmail(mail) : await sendWithResend(mail);
  } catch (error) {
    console.error(`[mail] ${provider} failed:`, error);
    return false;
  }
}

async function sendWithResend({ to, ...mail }: Mail) {
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? `${site.name} Website <onboarding@resend.dev>`,
    to: to ?? process.env.CONTACT_TO_EMAIL ?? site.email,
    ...mail,
  });
  if (error) console.error("[mail] Resend failed:", error);
  return !error;
}

async function sendWithGmail({ to, ...mail }: Mail) {
  const user = process.env.GMAIL_USER!;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: process.env.GMAIL_APP_PASSWORD },
  });
  await transport.sendMail({
    // Gmail rewrites any other sender address to the account's own.
    from: `"${site.name}" <${user}>`,
    // site.email may not exist yet, so the business copy defaults to the Gmail inbox itself.
    to: to ?? (process.env.CONTACT_TO_EMAIL || user),
    ...mail,
  });
  return true;
}

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Label/value rows as a simple HTML table for notification emails. */
export function detailsTable(rows: [string, string][]) {
  return `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#444d5a;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;white-space:pre-line"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join("")}</table>`;
}
