# Super AI Creator Excellence Awards 2026

Landing page, 9-section application form and protected `/admin` dashboard for Super AI Academy.

Stack: React + Vite (TanStack Start), JavaScript components, Tailwind CSS, server API routes, **Neon Postgres** (records) and **Vercel Blob – private store** (images). No Supabase/Firebase.

## Structure
- `src/routes/index.jsx` – landing page · `src/routes/admin.jsx` – admin dashboard
- `src/components/` – Header, Hero, Categories, ApplicationForm, ImageUpload, InfoSections
- `src/lib/categories.js` – the 9 categories (edit English/Telugu text and criteria here)
- `src/lib/validation.js` – shared client + server validation
- `src/routes/api/applications.js` – `POST` submission (validates, uploads to Blob, inserts row)
- `src/routes/api/admin/session.js` – admin login / logout / session check (HMAC-signed HttpOnly cookie)
- `src/routes/api/admin/applications.js` – `GET` list, `PATCH` status + notes (admin only)
- `src/routes/api/admin/file.js` – streams private images to logged-in admins only
- `db/schema.sql` – database schema

## Install & run
```bash
bun install        # or npm install
cp .env.example .env   # fill in values
bun run dev
```

## Database (Neon)
1. Vercel dashboard → Storage → Marketplace → **Neon** → create and connect to the project (sets `DATABASE_URL`).
2. Open the Neon SQL editor and run `db/schema.sql`.

## Blob storage
1. Vercel → Storage → **Blob** → create a store with **Private** access, connect to the project (sets `BLOB_READ_WRITE_TOKEN`).
2. Files are uploaded as `applications/<REF>/…` and are never publicly linked; admins view them through `/api/admin/file`.

## Administrator
Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (≥32 random chars) as environment variables. Sign in at `/admin`. Sessions last 8 hours.

## Testing
- Submit the form with missing/invalid values → field errors appear.
- Without env vars configured the API returns 503 and the form shows an error (no fake success).
- With env vars set, a submission shows the reference number; verify the row in Neon and the files in Blob, then review it in `/admin`.

## GitHub & Vercel deployment
1. Connect the project to GitHub (Lovable → GitHub → Connect); changes sync both ways.
2. Vercel → New Project → import the repo. Framework preset: Vite / TanStack Start. Add the environment variables above (Production + Preview).
3. Vercel needs TanStack Start's Vercel/Nitro output: if the build does not detect it, add the Nitro Vite plugin with `preset: "vercel"` in `vite.config.ts` per the TanStack Start hosting docs.
4. Deploy, run `db/schema.sql`, then test a submission.
