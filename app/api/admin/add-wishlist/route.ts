import { Redis } from "@upstash/redis";
import { requireAdmin } from "../_auth";

const WISHLIST_KEY = "kuriboh:wishlist";

function isLikelyUrl(s: string) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return new Response(auth.error, { status: 401 });

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const url = (body?.url || "").trim();

  if (!url || url.length > 2000 || !isLikelyUrl(url)) {
    return new Response("Invalid url.", { status: 400 });
  }

  const redis = Redis.fromEnv();
  const current = (await redis.get<string[]>(WISHLIST_KEY)) ?? [];
  const next = Array.from(new Set([url, ...current])).slice(0, 200);
  await redis.set(WISHLIST_KEY, next);

  return Response.json({ ok: true });
}
