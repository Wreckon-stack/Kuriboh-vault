export function requireAdmin(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false as const, error: "ADMIN_PASSWORD is not set on server." };
  }
  const got = req.headers.get("x-admin-password") || "";
  if (got !== expected) {
    return { ok: false as const, error: "Unauthorized." };
  }
  return { ok: true as const };
}
