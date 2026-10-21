# Super AI Creator Excellence Awards 2026

Landing page, nine-field application form, and protected `/admin` dashboard for Super AI Academy.

**Stack:** React 19 · TanStack Start (SSR) · TanStack Router · Vite 8 · Tailwind CSS 4 · Neon PostgreSQL · Vercel Blob (private) · JavaScript components

No Supabase, no Firebase. All data stays in Neon; all files stay in private Vercel Blob.

---

## Project structure

```
src/
  routes/
    index.jsx                       — Public landing page
    admin.jsx                       — Admin dashboard (/admin)
    api/
      applications.js               — POST /api/applications  (public submit)
      admin/
        applications.js             — GET + PATCH /api/admin/applications
        session.js                  — GET / POST / DELETE /api/admin/session
        file.js                     — GET /api/admin/file (private blob proxy)
  components/
    ApplicationForm.jsx             — Nine-field submission form
    Header.jsx                      — Logo + nav
    Hero.jsx / Categories.jsx / InfoSections.jsx
    ImageUpload.jsx                 — Screenshot + photo upload
  lib/
    categories.js                   — 9 award categories + 5 status values
    validation.js                   — Shared client + server validation
    server/
      auth.server.js                — HMAC-SHA256 cookie auth (server only)
      db.server.js                  — Neon client factory (server only)
db/
  schema.sql                        — Run once in Neon SQL editor
```

---

## Environment variables

Create a `.env` file in the project root (never commit it — it is in `.gitignore`):

```env
# Neon pooled Postgres connection string — server only
DATABASE_URL=postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# Vercel Blob private store token — server only
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxx

# Admin credentials — server only
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-to-a-long-random-password

# HMAC session secret — minimum 32 characters
# Generate with: openssl rand -hex 32
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret-at-least-32-chars
```

All five variables are required for the application to accept submissions and for the admin dashboard to function.

---

## Local setup

```bash
# 1. Install dependencies (bun is recommended; npm also works)
bun install

# 2. Copy the example env file and fill in real values
cp .env.example .env

# 3. Start the development server
bun run dev
```

The dev server starts on `http://localhost:3000` (or the next available port). The form returns a 503 until `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are set.

---

## Database setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create a project, **or** add Neon via the Vercel dashboard → Storage → Marketplace → Neon.
2. Copy the **pooled connection string** into `DATABASE_URL`.
3. Open the **Neon SQL editor** and run the contents of `db/schema.sql` once. This creates the `applications` table with all constraints and indexes.
4. Verify by running `SELECT * FROM applications LIMIT 1;` — it should return zero rows with no errors.

---

## Blob storage setup (Vercel Blob — private)

1. In the Vercel dashboard go to **Storage → Blob → Create Store**.
2. Set the access mode to **Private**.
3. Connect the store to your project. Vercel will set `BLOB_READ_WRITE_TOKEN` as an environment variable automatically.
4. Copy the token into your local `.env`.

Uploaded files are stored as `applications/<REFERENCE_NO>/<filename>` and are **never publicly accessible**. Admins view them through the `/api/admin/file` proxy, which streams files only to authenticated sessions.

---

## Admin credentials

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` as environment variables.

- Use a strong, unique password (at least 16 characters).
- Generate the session secret with `openssl rand -hex 32` or any equivalent.
- Sessions are HMAC-SHA256 signed, HttpOnly, Secure, SameSite=Strict, and expire after **8 hours**.
- The login page is at `/admin`. Wrong credentials add a 600 ms delay to resist brute-force attempts.

---

## Running tests and lint

```bash
# Run the test suite (single pass, no watch)
bun run test

# Lint
bun run lint

# Production build
bun run build
```

The tests in `src/test/app-routing.test.tsx` verify basic route rendering. They do not require a database connection. The build requires all dependencies to be installed but does **not** require env vars to be set.

---

## Vercel deployment

1. Push the repository to GitHub.
2. In the Vercel dashboard choose **New Project → Import** the repository.
3. Framework preset: **Vite** (TanStack Start is handled by Nitro automatically via `@lovable.dev/vite-tanstack-config`).
4. Add the five environment variables listed above under **Settings → Environment Variables** for **Production** (and **Preview** if you want preview deployments to work).
5. Deploy. After the first successful deploy, run `db/schema.sql` in the Neon SQL editor if you have not done so already.
6. Test a real form submission and confirm the reference number appears, the row is visible in Neon, and the files appear in Vercel Blob. Then sign in at `/admin` and verify the application appears in the dashboard.

No `vercel.json` is required — Nitro generates the correct Vercel output format automatically.

---

## What is not yet live

The following require your manual action before the site works end-to-end:

| Step           | Action                                                 |
| -------------- | ------------------------------------------------------ |
| Database       | Run `db/schema.sql` in the Neon SQL editor             |
| Blob store     | Create a private Vercel Blob store and copy the token  |
| Env vars       | Set all five variables locally and in Vercel           |
| Admin password | Choose a strong password and store it only in env vars |

The public landing page and form are already live and do not require a database connection to render. Submissions and the admin dashboard require all five env vars.
