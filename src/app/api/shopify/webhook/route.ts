import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/commerce/shopify";

/**
 * Shopify webhooks → instant refresh of cached prices and policies.
 *
 * In Shopify admin → Settings → Notifications → Webhooks, create JSON webhooks pointing at
 * https://makeoveroverseas.com/api/shopify/webhook for the topics below, and copy the
 * signing key shown on that page into SHOPIFY_WEBHOOK_SECRET.
 */
const priceTopics = new Set([
  "products/create",
  "products/update",
  "products/delete",
  "inventory_levels/update",
  "collections/update",
]);
const policyTopics = new Set(["shop/update"]);

function verified(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhooks are not configured.", { status: 501 });

  // The signature covers the raw body, so read it as text before anything else.
  const body = await request.text();
  if (!verified(body, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return new Response("Invalid signature.", { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  if (priceTopics.has(topic)) revalidateTag(TAGS.prices, "max");
  if (policyTopics.has(topic)) revalidateTag(TAGS.policies, "max");

  // Always 200 for verified calls so Shopify doesn't retry topics we don't use.
  return Response.json({ ok: true, topic });
}
