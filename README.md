# Kuriboh Vault (Next.js + Upstash Redis)

A Yu‑Gi‑Oh styled one-page site with:
- About section + Kuriboh image
- "How many Kuribohs we own" counter (live-editable via Admin, no redeploy)
- Wishlist image gallery (add/remove live via Admin)
- Admin panel protected by a server-side password
- Join X Community button

---

## 1) Run locally

### Install dependencies
```bash
npm install
```

### Configure environment variables
Create `.env.local` in the project root (already .gitignored):
```env
# Required — checked server-side for all admin API routes
ADMIN_PASSWORD=your-strong-password-here

# Required for Redis to work locally — pull from your Vercel project:
#   npx vercel env pull .env.local
# Or copy from: Vercel Dashboard → your project → Settings → Environment Variables
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

> Without `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, the app still loads locally —
> it shows count=0, empty wishlist, and an orange banner explaining Redis is not connected.

### Start dev server
```bash
npm run dev
```

Open http://localhost:3000

---

## 2) Deploy on Vercel

### Step-by-step

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USER/kuriboh-vault.git
   git push -u origin main
   ```

2. **Import into Vercel**
   - Go to https://vercel.com/new
   - Click **Import** on your GitHub repo
   - Framework detected as **Next.js** automatically
   - Click **Deploy** (may fail before env vars are set — that's fine)

3. **Attach Upstash Redis**
   - Vercel Dashboard → your project → **Integrations** tab (or https://vercel.com/marketplace?category=storage&search=redis)
   - Find **Upstash Redis** → click **Add Integration**
   - Create a new Redis database (free tier available) and connect it to your project
   - Vercel automatically injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

4. **Add `ADMIN_PASSWORD` environment variable**
   - Vercel Dashboard → your project → **Settings → Environment Variables**
   - Add: `ADMIN_PASSWORD` = `your-strong-password-here`
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

5. **Redeploy**
   - Vercel Dashboard → your project → **Deployments**
   - Click **⋯** on the latest deployment → **Redeploy**
   - Or push a new commit to trigger automatically

### Required environment variables on Vercel

| Variable | How to get it |
|---|---|
| `ADMIN_PASSWORD` | Set manually in Vercel env vars |
| `UPSTASH_REDIS_REST_URL` | Auto-injected by Upstash Redis integration |
| `UPSTASH_REDIS_REST_TOKEN` | Auto-injected by Upstash Redis integration |

> `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are **never** set manually —
> Vercel injects them automatically when you connect Upstash Redis.

---

## 3) Use the Admin Panel (no redeploy needed)

Once deployed:
1. Click **Admin** button on the site
2. Enter your `ADMIN_PASSWORD` → click **Unlock**
3. The panel shows a green **● Unlocked** badge when authenticated
4. Use the controls to:
   - **Edit Kuriboh Count** — set the number and click **Save Count**
   - **Add Wishlist Image** — paste an image URL and click **Add**
   - **Remove Wishlist Items** — click **Remove** next to any item

All changes persist to Upstash Redis instantly. No redeploy required.

---

## 4) Customization

Open [app/page.tsx](app/page.tsx) and replace:
- `DEFAULT_KURIBOH_IMG` — your hosted Kuriboh image URL
- `DEFAULT_BG` — your Yu-Gi-Oh duel field background URL
- `CA` — your memecoin contract address
- `X_COMMUNITY` — your X Community URL (already set)

---

## Security notes

- The admin password is **never exposed to the browser** — it only lives in `process.env.ADMIN_PASSWORD` on the server
- `.env.local` is in `.gitignore` and will never be committed
- All admin API routes (`/api/admin/*`) reject requests with a missing or wrong `x-admin-password` header, returning HTTP 401
- Input validation is enforced server-side on count and wishlist URLs
