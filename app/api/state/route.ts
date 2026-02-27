import { Redis } from "@upstash/redis";

const COUNT_KEY = "kuriboh:count";
const WISHLIST_KEY = "kuriboh:wishlist";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return Response.json({
      count: 0,
      wishlist: [],
      kvError:
        "Upstash Redis is not configured. " +
        "In your Vercel project go to Integrations → Upstash Redis, attach a database, " +
        "and Vercel will inject UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN automatically.",
    });
  }

  try {
    const redis = new Redis({ url, token });
    const count = (await redis.get<number>(COUNT_KEY)) ?? 0;
    const wishlist = (await redis.get<string[]>(WISHLIST_KEY)) ?? [];
    return Response.json({ count, wishlist });
  } catch (err) {
    console.error("[kuriboh-vault] Redis read error:", err);
    return Response.json({
      count: 0,
      wishlist: [],
      kvError:
        "Could not reach Upstash Redis. Verify UPSTASH_REDIS_REST_URL and " +
        "UPSTASH_REDIS_REST_TOKEN are correct in your Vercel environment variables.",
    });
  }
}
