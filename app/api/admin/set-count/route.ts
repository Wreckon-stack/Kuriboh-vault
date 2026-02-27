import { Redis } from "@upstash/redis";
import { requireAdmin } from "../_auth";

const COUNT_KEY = "kuriboh:count";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return new Response(auth.error, { status: 401 });

  const body = (await req.json().catch(() => null)) as { count?: number } | null;
  const count = body?.count;

  if (typeof count !== "number" || !Number.isFinite(count) || count < 0 || count > 1_000_000_000) {
    return new Response("Invalid count.", { status: 400 });
  }

  const redis = Redis.fromEnv();
  await redis.set(COUNT_KEY, Math.floor(count));
  return Response.json({ ok: true });
}
