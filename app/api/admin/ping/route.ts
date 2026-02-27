import { requireAdmin } from "../_auth";

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return new Response(auth.error, { status: 401 });
  return Response.json({ ok: true });
}
