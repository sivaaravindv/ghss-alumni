# GHSS Vellalankulam Alumni Network

அரசு மேல்நிலைப் பள்ளி, வெள்ளாளங்குளம் – முன்னாள் மாணவர் வலையமைப்பு

A bilingual (Tamil / English) website where alumni register and then see who from their batch (passing-out year) has already joined. Built with **Next.js 15** on **Vercel** and **Supabase** (Postgres). Runs entirely on free plans.

## What it does

| Page | What people see |
|---|---|
| `/` | Registration form: village suggestions, country codes, "show my number to batchmates" consent, "lost my link?" by email |
| `/b/<token>` | Private batch page: batchmates by year (±1 year tabs), call/WhatsApp only for people who allowed it, counts for every batch, invite-on-WhatsApp button, private link to save |

Admin:
- **CSV export** of everyone, including each person's private link and a "send link on WhatsApp" link: `/api/admin/export?key=ADMIN_KEY`
- Live Google Sheet for the committee: in any Sheet cell, `=IMPORTDATA("https://YOUR-SITE/api/admin/export?key=YOUR_ADMIN_KEY")`

### Privacy design
- Browsers never talk to the database. Only the Next.js server does, with the service-role key.
- Every table has Row Level Security on with **no policies**, and all access for `anon`/`authenticated` is revoked. The public Supabase API therefore returns "permission denied" even if someone finds your project URL.
- Batchmates see only name, village and current work. Phone numbers are shown only when that person turns on consent. Father's name, address and email are never shown.
- Private pages send `Referrer-Policy: no-referrer` and `noindex`, so links don't leak to other sites or search engines.
- The "lost my link" reply is the same whether or not an email is registered, and is limited to one email per address every 10 minutes.

## Setup (about 30 minutes)

### 1. Supabase (database)
1. Create a free project at [supabase.com](https://supabase.com). Region: **Mumbai (ap-south-1)**.
2. **SQL Editor → New query**, paste all of `supabase/migrations/0001_alumni.sql`, then **Run**.
3. **Project Settings → API**: copy the **Project URL** and the **service_role** secret key.

### 2. Vercel (website)
1. Push this folder to a GitHub repo, or run `npx vercel` from it.
2. In Vercel: **Add New → Project →** import the repo (framework: Next.js, detected automatically).
3. **Settings → Environment Variables**: add everything from `.env.example`:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `SITE_URL`: your Vercel address, e.g. `https://ghss-vellalankulam.vercel.app`
   - `SHARE_URL`: `https://tinyurl.com/GHSS-Vellalankulam-Alumni`
   - `ADMIN_KEY`: a long random string, e.g. from `openssl rand -hex 24`
   - Optional, for "lost my link" emails: `GMAIL_USER` and `GMAIL_APP_PASSWORD`. These need 2-step verification on the Gmail account, then Google Account → Security → App passwords.
4. Deploy. The daily cron in `vercel.json` calls `/api/health` so the free Supabase project never pauses for inactivity.

### 3. Move the existing Google Sheet data
1. In the Google Sheet, run **🎓 Alumni → Create private links for everyone**. This fixes `#ERROR!` phone numbers and gives every row a token.
2. Open the **Responses** tab and choose **File → Download → Comma-separated values (.csv)**.
3. Run:
   ```bash
   npm install
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-sheet.mjs Responses.csv
   ```
   - Existing tokens are kept, so private links already sent keep working on the new site.
   - The import is safe to run again: people already imported are skipped.
   - Rows it can't use (e.g. a broken phone number) are listed. Fix them in the Sheet and run again.

### 4. Point the old link to the new site
In the **old Apps Script project**:
1. Replace `Code.gs` with `apps-script-redirect/Code.gs`.
2. Set `NEW_SITE` to your Vercel address.
3. **Deploy → Manage deployments → ✏️ Edit → New version.**

The TinyURL and every old `…/exec?t=…` private link now open the new site, so nobody has to re-share anything.

## Develop locally
```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run typecheck
```

## Project layout
```
src/app/page.tsx              form page (village list refreshed every 5 min)
src/app/b/[token]/page.tsx    private batch page
src/app/api/*                 register, visibility, recover, health, admin/export
src/components/               RegisterForm, BatchView, Header, LangProvider
src/lib/i18n.ts               all Tamil / English text
src/lib/alumni.ts             database queries (server only)
src/lib/validate.ts           validation shared by browser and server
supabase/migrations/          database schema
scripts/import-sheet.mjs      Google Sheet → Supabase import
apps-script-redirect/Code.gs  old link → new site
```

## Ideas for next steps
- Login by email link (Supabase Auth) in place of private links.
- Events with RSVP, a mentorship board, and a school-needs board.
- A Flutter app on the same Supabase database, for push notifications.
