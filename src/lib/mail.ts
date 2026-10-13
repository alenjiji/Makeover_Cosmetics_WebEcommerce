import nodemailer from "nodemailer";
import { Resend } from "resend";
import { site } from "@/lib/site";

type Mail = { subject: string; text: string; html: string; replyTo: string };

/**
 * Sends a contact-form email through the provider chosen by EMAIL_PROVIDER:
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
      console.error(`[contact] ${provider} credentials are not set; inquiry was not delivered.`);
      return false;
    }
    console.info(`[contact] ${provider} not configured, logging instead of sending.\n${mail.subject}\n${mail.text}`);
    return true;
  }

  try {
    return provider === "gmail" ? await sendWithGmail(mail) : await sendWithResend(mail);
  } catch (error) {
    console.error(`[contact] ${provider} failed:`, error);
    return false;
  }
}

async function sendWithResend(mail: Mail) {
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? `${site.name} Website <onboarding@resend.dev>`,
    to: process.env.CONTACT_TO_EMAIL ?? site.email,
    ...mail,
  });
  if (error) console.error("[contact] Resend failed:", error);
  return !error;
}

async function sendWithGmail(mail: Mail) {
  const user = process.env.GMAIL_USER!;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: process.env.GMAIL_APP_PASSWORD },
  });
  await transport.sendMail({
    // Gmail rewrites any other sender address to the account's own.
    from: `"${site.name} Website" <${user}>`,
    // site.email may not exist yet, so default to the Gmail inbox itself.
    to: process.env.CONTACT_TO_EMAIL || user,
    ...mail,
  });
  return true;
}
