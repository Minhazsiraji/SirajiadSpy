# Siraji AdSpy

Evidence-led competitor ad research and creative generation for Bangladesh ecommerce. Built with Next.js App Router, TypeScript, Prisma/Supabase readiness, and the OpenAI Responses API.

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

Without environment variables, the dashboard, filters, detail pages, Signal Score, and deterministic analysis fallback all work with six realistic demo records.

## Enable AI analysis

Add `OPENAI_API_KEY` to `.env.local`. `OPENAI_MODEL` defaults to `gpt-5.6-luna`. Analysis uses the Responses API with a strict JSON schema, then validates the result with Zod.

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

## Deployment

Deploy to Vercel normally. Keep `ENABLE_LIVE_META_COLLECTOR=false` for serverless deployments unless collection runs through a maintained external browser worker such as Browserless.
