import { headers } from "next/headers";

// In-memory limiter: fine for a single server, but each serverless instance keeps its own
// counts, so swap for a shared store (e.g. Upstash Redis) if abuse becomes a problem.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/** True once this visitor has made more than `max` submissions of `bucket` in 10 minutes. */
export async function isRateLimited(bucket: string, max = 5) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}
