create table if not exists public."Ad" (
  id text primary key default gen_random_uuid()::text,
  "externalId" text unique,
  "pageName" text not null,
  "pageId" text,
  "adText" text,
  headline text,
  cta text,
  "creativeUrl" text,
  "creativeType" text not null,
  "thumbnailUrl" text,
  "landingUrl" text,
  country text not null default 'BD',
  "firstSeenAt" timestamptz not null default now(),
  "lastSeenAt" timestamptz not null default now(),
  "daysActive" integer not null default 0,
  "isActive" boolean not null default true,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  "signalScore" integer not null default 0,
  evidence jsonb,
  "aiAnalysis" jsonb,
  "landingAnalysis" jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists "Ad_signalScore_idx" on public."Ad" ("signalScore");
create index if not exists "Ad_daysActive_idx" on public."Ad" ("daysActive");
create index if not exists "Ad_country_idx" on public."Ad" (country);
alter table public."Ad" enable row level security;
alter table public."Ad" add column if not exists "landingAnalysis" jsonb;

create table if not exists public."TikTokAd" (
  id text primary key,
  keyword text not null,
  username text not null,
  caption text not null,
  "videoUrl" text not null,
  "thumbnailUrl" text,
  likes integer not null default 0,
  views integer not null default 0,
  duration integer not null default 0,
  "musicName" text,
  "videoId" text,
  country text not null default 'BD',
  "profitScore" integer not null default 0,
  "firstSeen" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);
create index if not exists "TikTokAd_keyword_idx" on public."TikTokAd" (keyword);
create index if not exists "TikTokAd_profitScore_idx" on public."TikTokAd" ("profitScore");
alter table public."TikTokAd" enable row level security;
