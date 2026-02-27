import { Redis } from "@upstash/redis";
import { requireAdmin } from "../_auth";

const WISHLIST_KEY = "kuriboh:wishlist";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return new Response(auth.error, { status: 401 });

  const body = (await req.json().catch(() => null)) as { url?: string } | null;
  const url = (body?.url || "").trim();
  if (!url) return new Response("Missing url.", { status: 400 });

  const redis = Redis.fromEnv();
  const current = (await redis.get<string[]>(WISHLIST_KEY)) ?? [];
  const next = current.filter((x) => x !== url);
  await redis.set(WISHLIST_KEY, next);

  return Response.json({ ok: true });
}
