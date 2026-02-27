"use client";

import { useEffect, useState } from "react";

type State = {
  count: number;
  wishlist: string[];
  kvError?: string;
};

const DEFAULT_KURIBOH_IMG = "/kuriboh.jpg";

const CA = "HJHYKbc4sCdBAgKbRWpZZJHJm2nt5CKPaZG7TZVNpump";
const X_COMMUNITY = "https://x.com/i/communities/2026803416702357892";
const BUY_LINK = `https://pump.fun/coin/${CA}`;

export default function Page() {
  const [state, setState] = useState<State>({ count: 0, wishlist: [] });
  const [loading, setLoading] = useState(true);

  const [caCopied, setCaCopied] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminMsg, setAdminMsg] = useState<string | null>(null);

  const [draftCount, setDraftCount] = useState<number>(0);
  const [newUrl, setNewUrl] = useState("");

  function copyCA() {
    navigator.clipboard.writeText(CA);
    setCaCopied(true);
    setTimeout(() => setCaCopied(false), 2000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      const data = (await res.json()) as State;
      setState(data);
      setDraftCount(data.count);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function adminPing(password: string) {
    setAdminMsg(null);
    const res = await fetch("/api/admin/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
    });
    if (!res.ok) {
      setAdminAuthed(false);
      setAdminMsg("Wrong password.");
      return false;
    }
    setAdminAuthed(true);
    setAdminMsg("Admin unlocked.");
    return true;
  }

  async function adminUpdateCount() {
    setAdminMsg(null);
    const res = await fetch("/api/admin/set-count", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
      body: JSON.stringify({ count: draftCount }),
    });
    if (!res.ok) {
      setAdminMsg("Failed to update count (check password).");
      return;
    }
    setAdminMsg("Count updated.");
    await load();
  }

  async function adminAddWishlist() {
    setAdminMsg(null);
    const url = newUrl.trim();
    if (!url) return;
    const res = await fetch("/api/admin/add-wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      setAdminMsg("Failed to add image (check URL/password).");
      return;
    }
    setNewUrl("");
    setAdminMsg("Added to wishlist.");
    await load();
  }

  async function adminRemoveWishlist(url: string) {
    setAdminMsg(null);
    const res = await fetch("/api/admin/remove-wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": adminPw },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      setAdminMsg("Failed to remove (check password).");
      return;
    }
    setAdminMsg("Removed.");
    await load();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 18px 80px" }}>

        {/* ── Hero title ── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              margin: "0 0 6px",
              fontSize: "clamp(40px, 9vw, 86px)",
              fontWeight: 900,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              lineHeight: 1,
              background: "linear-gradient(135deg, #c8960c 0%, #ffd700 40%, #f7d46b 65%, #ffd700 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(247,212,107,.7)) drop-shadow(0 2px 8px rgba(0,0,0,.8))",
            }}
          >
            KURIBOH VAULT
          </h1>

          {/* Nav row */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <a
              href={X_COMMUNITY}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                borderRadius: 14,
                background: "#fff",
                border: "2px solid #fff",
                color: "#000",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 0 28px rgba(255,255,255,.4)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
              </svg>
              Join Community
            </a>
            <a
              href={BUY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                borderRadius: 14,
                background: "rgba(247,212,107,.15)",
                border: "2px solid rgba(247,212,107,.8)",
                color: "#ffd700",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 0 20px rgba(247,212,107,.25)",
              }}
            >
              Buy $KURIBOH
            </a>
          </div>
        </div>

        {/* KV error banner */}
        {state.kvError && (
          <div
            style={{
              marginBottom: 18,
              padding: "12px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,77,109,.35)",
              background: "rgba(255,77,109,.07)",
              color: "rgba(255,180,100,.95)",
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            <b style={{ color: "rgba(255,77,109,.95)" }}>KV Storage unavailable.</b>{" "}
            {state.kvError}
          </div>
        )}

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gap: 16 }} className="grid">

          {/* Left column */}
          <div style={{ display: "grid", gap: 16 }}>

            {/* About */}
            <Card title="ABOUT ME">
              <div style={{ display: "grid", gap: 18, gridTemplateColumns: "140px 1fr", alignItems: "center" }}>
                {/* Kuriboh avatar */}
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 24,
                    border: "2px solid rgba(247,212,107,.6)",
                    overflow: "hidden",
                    background: "rgba(0,0,0,.40)",
                    boxShadow: "0 0 32px rgba(247,212,107,.35), 0 18px 40px rgba(0,0,0,.6)",
                  }}
                >
                  <img src={DEFAULT_KURIBOH_IMG} alt="Kuriboh" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div>
                  <p style={{ margin: "0 0 12px", lineHeight: 1.6, fontSize: 15, color: "#fff" }}>
                    Welcome to the Kuriboh Vault — part shrine, part scoreboard, part wishlist.
                    The homebase for our Kuriboh memecoin and the eternal mission: collect more Kuribohs.
                  </p>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(247,212,107,.5), transparent)", margin: "12px 0" }} />
                  <div style={{ ...monoStyle(), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ color: "rgba(247,212,107,.6)", marginBottom: 5, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" }}>Contract Address</div>
                      <span style={{ wordBreak: "break-all", color: "#fff" }}>{CA}</span>
                    </div>
                    <button
                      onClick={copyCA}
                      style={{ ...btnStyle({ ok: caCopied }), flexShrink: 0, fontSize: 12, padding: "6px 12px", transition: "all .2s" }}
                    >
                      {caCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Wishlist */}
            <Card title="WISHLIST">
              {loading ? (
                <p style={{ color: "rgba(255,255,255,.5)", margin: 0 }}>Loading…</p>
              ) : state.wishlist.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,.5)", margin: 0 }}>
                  No wishlist items yet. Open <b style={{ color: "#ffd700" }}>Admin</b> to add image URLs.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                  {state.wishlist.map((url) => (
                    <div
                      key={url}
                      style={{
                        borderRadius: 18,
                        border: "2px solid rgba(247,212,107,.4)",
                        background: "rgba(10,8,0,.6)",
                        overflow: "hidden",
                        boxShadow: "0 0 20px rgba(247,212,107,.15), 0 16px 40px rgba(0,0,0,.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: "3/4",
                      }}
                      title={url}
                    >
                      <img src={url} alt="Wishlist card" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <Card title="KURIBOHS OWNED">
              <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,.5)", fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
                  Current count
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(64px, 14vw, 96px)",
                    lineHeight: 1,
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #c8960c, #ffd700, #f7d46b)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 32px rgba(247,212,107,.7))",
                  }}
                >
                  {loading ? "…" : state.count}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Admin modal ── */}
      {adminOpen && (
        <div style={modalBackdrop()} onClick={() => setAdminOpen(false)}>
          <div style={modalCard()} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div>
                <div style={{ letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(247,212,107,.6)", fontSize: 12 }}>
                  Admin Panel
                </div>
                <div style={{ fontSize: 18, marginTop: 6, color: "#fff", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  Kuriboh Control Console
                  {adminAuthed && (
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        border: "1px solid rgba(34,197,94,.45)",
                        background: "rgba(34,197,94,.12)",
                        color: "rgba(34,197,94,.95)",
                        fontSize: 12,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      ● Unlocked
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setAdminOpen(false)} style={btnStyle({ ghost: true })}>
                Close
              </button>
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(247,212,107,.4), transparent)", margin: "14px 0" }} />

            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>Admin Password</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="password"
                  value={adminPw}
                  onChange={(e) => setAdminPw(e.target.value)}
                  placeholder="Enter password…"
                  style={inputStyle()}
                />
                <button onClick={() => adminPing(adminPw)} style={btnStyle({ ok: true })}>
                  Unlock
                </button>
              </div>
              {adminMsg && (
                <div style={{ color: adminAuthed ? "rgba(34,197,94,.95)" : "rgba(255,77,109,.95)", fontSize: 13 }}>
                  {adminMsg}
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(247,212,107,.4), transparent)", margin: "14px 0" }} />

            <div style={{ opacity: adminAuthed ? 1 : 0.5, pointerEvents: adminAuthed ? "auto" : "none" }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>Edit Kuriboh Count</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="number"
                      value={draftCount}
                      onChange={(e) => setDraftCount(Number(e.target.value))}
                      style={inputStyle({ width: 160 })}
                    />
                    <button onClick={adminUpdateCount} style={btnStyle({ ok: true })}>
                      Save Count
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>Add Wishlist Image (URL)</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://…"
                      style={inputStyle({ minWidth: 320, flex: 1 })}
                    />
                    <button onClick={adminAddWishlist} style={btnStyle({ ok: true })}>
                      Add
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>Remove Wishlist Items</div>
                  {state.wishlist.length === 0 ? (
                    <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>No wishlist items yet.</div>
                  ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                      {state.wishlist.map((url) => (
                        <div
                          key={url}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid rgba(247,212,107,.2)",
                            background: "rgba(247,212,107,.04)",
                            padding: "10px 12px",
                            borderRadius: 14,
                          }}
                        >
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {url}
                          </div>
                          <button onClick={() => adminRemoveWishlist(url)} style={btnStyle({ danger: true })}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!adminAuthed && (
              <div style={{ marginTop: 12, color: "rgba(255,255,255,.35)", fontSize: 12 }}>
                Tip: this is server-side protection — don't share the password.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating admin button */}
      <button
        onClick={() => setAdminOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 40,
          padding: "9px 18px",
          borderRadius: 14,
          background: "rgba(247,212,107,.12)",
          border: "2px solid rgba(247,212,107,.7)",
          color: "#ffd700",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 0 16px rgba(247,212,107,.2)",
        }}
      >
        Admin
      </button>

      <style>{`
        @media (min-width: 900px) {
          .grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid rgba(247,212,107,.25)",
        borderRadius: 22,
        background: "rgba(15,12,0,.85)",
        boxShadow: "0 0 0 1px rgba(247,212,107,.08), 0 20px 60px rgba(0,0,0,.6)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -2,
          background:
            "radial-gradient(700px 250px at 20% 0%, rgba(247,212,107,.07), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", padding: 20 }}>
        <div style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(247,212,107,.7)", fontWeight: 700 }}>
          {title}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(247,212,107,.35), transparent)", margin: "12px 0" }} />
        {children}
      </div>
    </section>
  );
}

function btnStyle(opts?: { danger?: boolean; ok?: boolean; ghost?: boolean }) {
  const border = opts?.danger
    ? "1px solid rgba(255,77,109,.55)"
    : opts?.ok
      ? "1px solid rgba(34,197,94,.55)"
      : "1px solid rgba(247,212,107,.35)";
  const bg = opts?.ghost
    ? "rgba(255,255,255,.08)"
    : opts?.danger
      ? "rgba(255,77,109,.12)"
      : opts?.ok
        ? "rgba(34,197,94,.12)"
        : "rgba(247,212,107,.10)";
  return {
    border,
    background: bg,
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  } as const;
}

function inputStyle(opts?: { width?: number; minWidth?: number; flex?: number }) {
  return {
    width: opts?.width ? `${opts.width}px` : "260px",
    minWidth: opts?.minWidth ? `${opts.minWidth}px` : undefined,
    flex: opts?.flex ?? undefined,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(247,212,107,.3)",
    background: "rgba(0,0,0,.5)",
    color: "#fff",
    outline: "none",
  } as const;
}

function monoStyle() {
  return {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 12,
    color: "#fff",
    background: "rgba(0,0,0,.4)",
    border: "1px solid rgba(247,212,107,.2)",
    padding: "10px 12px",
    borderRadius: 14,
    overflow: "auto",
  } as const;
}

function modalBackdrop() {
  return {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,.75)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 50,
  };
}

function modalCard() {
  return {
    width: "min(860px, 100%)",
    borderRadius: 22,
    border: "1px solid rgba(247,212,107,.25)",
    background: "rgba(10,8,0,.97)",
    boxShadow: "0 0 0 1px rgba(247,212,107,.08), 0 30px 90px rgba(0,0,0,.8)",
    padding: 20,
  };
}
