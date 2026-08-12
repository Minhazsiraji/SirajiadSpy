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

create table if not exists public."Profile" (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan text not null default 'FREE' check (plan in ('FREE','PRO')),
  role text not null default 'USER' check (role in ('USER','OWNER')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','PENDING','SUSPENDED')),
  "planExpiresAt" timestamptz,
  "paymentReference" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create table if not exists public."UsageEvent" (
  id bigint generated always as identity primary key,
  "userId" uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('search','ai','export','landing')),
  "ipHash" text not null,
  "createdAt" timestamptz not null default now()
);
create index if not exists "UsageEvent_user_action_time_idx" on public."UsageEvent" ("userId",action,"createdAt");
create index if not exists "UsageEvent_ip_time_idx" on public."UsageEvent" ("ipHash","createdAt");
alter table public."Profile" enable row level security;
alter table public."UsageEvent" enable row level security;
drop policy if exists "Users read own profile" on public."Profile";
create policy "Users read own profile" on public."Profile" for select to authenticated using (auth.uid()=id);
drop policy if exists "Users read own usage" on public."UsageEvent";
create policy "Users read own usage" on public."UsageEvent" for select to authenticated using (auth.uid()="userId");
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public."Profile"(id,email) values(new.id,coalesce(new.email,'')) on conflict(id) do nothing;return new;end;$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
insert into public."Profile"(id,email)
select id,coalesce(email,'') from auth.users
on conflict(id) do update set email=excluded.email,"updatedAt"=now();
create table if not exists public."PaymentRequest" (
  id bigint generated always as identity primary key,
  "userId" uuid not null references auth.users(id) on delete cascade,
  method text not null check (method in ('BKASH','NAGAD')),
  reference text not null,
  amount integer not null default 799,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  "createdAt" timestamptz not null default now(),
  "reviewedAt" timestamptz
);
alter table public."PaymentRequest" enable row level security;
create policy "Users read own payments" on public."PaymentRequest" for select to authenticated using (auth.uid()="userId");
