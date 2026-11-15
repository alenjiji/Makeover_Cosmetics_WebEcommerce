import { site } from "@/lib/site";

/**
 * Website forms are delivered through Netlify Forms, so no email keys are needed. Submissions
 * appear under Netlify → Forms, and Netlify emails each one to the addresses set in
 * Forms → Form notifications.
 *
 * Netlify registers the forms from public/__forms.html at deploy time; form and field names
 * here must match that file. In development nothing is sent: the submission is logged.
 */
type Forms = {
  inquiry: { name: string; email: string; phone: string; interest: string; product?: string; message: string };
  order: {
    order: string;
    items: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    gstin?: string;
    address: string;
    notes?: string;
  };
};

export async function submitForm<Name extends keyof Forms>(name: Name, fields: Forms[Name]): Promise<boolean> {
  const body = new URLSearchParams({ "form-name": name });
  for (const [key, value] of Object.entries(fields)) if (value) body.set(key, value);

  if (process.env.NODE_ENV !== "production") {
    console.info(`[forms] "${name}" submission (not sent in development):\n${body.toString().replaceAll("&", "\n")}`);
    return true;
  }

  try {
    const res = await fetch(new URL("/__forms.html", site.url), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!res.ok) console.error(`[forms] "${name}" submission failed: HTTP ${res.status}`);
    return res.ok;
  } catch (error) {
    console.error(`[forms] "${name}" submission failed:`, error);
    return false;
  }
}
