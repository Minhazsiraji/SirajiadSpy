# Siraji AdSpy — Phase 3

Evidence-led Meta and TikTok ad research, landing-page intelligence, Gemini creative analysis and bulk creative export for Bangladesh ecommerce.

## Premium features

- **Meta + TikTok intelligence:** live collection with a clearly labelled, 12-card TikTok demo fallback when upstream access is blocked.
- **Landing Intel:** Browserless screenshot, Supabase Storage persistence, Shopify/WooCommerce, COD, bKash and Nagad detection.
- **Bulk export:** selected videos/images, `copy.txt` and `insights.csv` delivered as a ZIP.
- **BD monetization:** Free (20 searches/day, 5 AI/day) and Pro (unlimited search, 100 AI/day, 50 exports/month) with bKash, Nagad and WhatsApp upgrade flow.
- **Server-enforced security:** Supabase Auth, owner/admin roles, database-backed usage enforcement, per-user/IP limits, payment approvals and RLS.

## Security setup

1. Run the complete `supabase-schema.sql` in Supabase SQL Editor.
2. Enable Email authentication in Supabase Auth.
3. Add `OWNER_EMAIL` and a long random `USAGE_HASH_SALT` in Vercel.
4. Create the owner account through `/login`; matching owner email receives OWNER/PRO access.
5. Review payment requests at `/admin`. Premium APIs never trust browser `localStorage`.

## Product principles

- **Signal Score is not profit.** It prioritizes ads to study using longevity, observable engagement, format, destination, and evidence quality.
- Demo fallback is always labeled. The application never presents generated records as live scraped data.
- Live collection is isolated behind `lib/meta-collector.ts`. Review Meta terms and use an approved source before enabling it.

## Run locally

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000/spy`.

Run `supabase-schema.sql` once after pulling Phase 3 to add `landingAnalysis` and the `TikTokAd` table.

## Enable AI analysis

Add `GEMINI_API_KEY` to `.env.local`. The existing Gemini integration produces the Opportunity Map, persona, five hooks and Bangla improved copies.

## Connect Supabase

1. Create a Supabase Postgres project.
2. Copy its pooled URL to `DATABASE_URL` and direct URL to `DIRECT_URL`.
3. Run `pnpm db:generate` and `pnpm db:push`.
4. Replace the demo repository in the API routes with Prisma reads/upserts.

## Routes

- `/spy` — searchable, filterable creative library
- `/spy/[id]` — ad evidence and AI creative analysis
- `GET /api/ads` — filters: `q`, `country`, `minDays`, `mediaType`, `sortBy`
- `POST /api/collect` — accepts `{ "query": "shoe spray", "country": "BD" }`
- `POST /api/analyze/[id]` — structured AI analysis or deterministic fallback
- `POST /api/tiktok/scrape` — TikTok collection with graceful demo fallback
- `GET /api/tiktok/ads?q=shoe+spray` — persisted TikTok results
- `POST /api/analyze-landing/[id]` — screenshot and commerce detection
- `POST /api/export` — ZIP export for selected Meta or TikTok IDs

## Deployment

Deploy to Vercel normally. Keep `ENABLE_LIVE_META_COLLECTOR=false` for serverless deployments unless collection runs through a maintained external browser worker such as Browserless.
