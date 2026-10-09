# Mohamed Selim — Portfolio + CMS

Bilingual (English / Arabic RTL) freelance portfolio with a built-in admin dashboard.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Cloudflare Workers (OpenNext) · D1 (content, inquiries, analytics) · R2 (uploads).

## Features

- Public pages: Home, About, Projects (filterable), Project case study, Services, Contact / Start a Project, localized 404.
- English (LTR) + Arabic (true RTL) from shared translation files (`src/i18n/messages/*.ts`). Language is in the URL (`/en`, `/ar`) and remembered in a cookie.
- Admin dashboard at `/en/admin` (or `/ar/admin`): overview with real visitor analytics, inquiries inbox, media library with uploads, and editors for hero, about, page copy, projects (+ screenshots), categories, services, process, benefits, testimonials, FAQs, stats, journey, certificates, skills, navigation, social links, contact details, SEO, theme colors and site visibility (maintenance mode). Every item supports publish/draft, reorder, search/filter, preview, delete confirmation and validation.
- Unknown business data (stats, testimonials, results, live URLs, WhatsApp…) is empty by default and hidden on the site until you fill it in.
- SEO: per-page metadata, hreflang alternates, OpenGraph image (auto-generated), JSON-LD, `sitemap.xml`, `robots.txt`, favicon from the MS logo.
- Privacy-friendly analytics (aggregate counts only, no third parties).

## Run locally

```bash
npm install
cp .env.example .env.local
npm run hash-password -- "your-strong-password"
npm run db:migrate:local
npm run dev
```

Paste the `ADMIN_PASSWORD_HASH=…` line into `.env.local` and set `ADMIN_EMAIL` and `AUTH_SECRET` (32+ random characters).

`next dev` gets local D1/R2 emulated by wrangler (stored in `.wrangler/`). On the first request the CMS is seeded from `src/lib/seed.ts`. Admin: http://localhost:3000/en/admin.

To run the real Workers runtime locally: copy `.dev.vars.example` to `.dev.vars`, fill it in, then `npm run preview`.

Checks: `npm run lint` · `npm run typecheck` · `npm run build`.

## Deploy to Cloudflare

Already created in the account: D1 database `ms-portfolio-db` (id in `wrangler.jsonc`) and R2 bucket `ms-portfolio-media`.

1. Create the tables in the remote database:
   ```bash
   npm run db:migrate:remote
   ```
2. Add the secrets (each command asks for the value):
   ```bash
   npx wrangler secret put ADMIN_EMAIL
   npx wrangler secret put ADMIN_PASSWORD_HASH
   npx wrangler secret put AUTH_SECRET
   ```
3. Create `.env.production` with the public URL (used for canonical URLs, sitemap and OpenGraph):
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```
4. Deploy (repeat for every update):
   ```bash
   npm run deploy
   ```
5. Custom domain: Cloudflare dashboard → Workers & Pages → `ms-portfolio` → Settings → Domains & Routes → Add custom domain.

Optional email for new inquiries: `npx wrangler secret put RESEND_API_KEY` plus `CONTACT_NOTIFY_FROM` and `CONTACT_NOTIFY_TO`.

Backup: `npx wrangler d1 export ms-portfolio-db --remote --output backup.sql`.

OpenNext recommends building on Linux, macOS or WSL. Builds on Windows work but are marked "not fully supported".

## Project structure

```
src/app/[lang]/(site)/     public pages
src/app/[lang]/admin/      login + dashboard (protected by src/middleware.ts and server-side checks)
src/app/actions/           server actions (inquiry form, CMS mutations)
src/app/api/               upload + analytics endpoints
src/lib/admin/schema.ts    declarative CMS schema (drives forms, tables, validation)
src/lib/store.ts           D1 + R2 persistence
migrations/                D1 schema
src/lib/seed.ts            initial real content
src/i18n/                  translations (UI + admin field labels)
src/components/            site, UI and admin components
```
