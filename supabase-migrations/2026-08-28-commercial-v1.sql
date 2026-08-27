begin;

-- Market-scoped records: application writes now use sourceId::COUNTRY so existing public detail ids remain stable.
create index if not exists "Ad_country_signal_idx" on public."Ad" (country,"signalScore" desc);

alter table public."TikTokAd" add column if not exists "isMock" boolean not null default false;
create index if not exists "TikTokAd_country_signal_idx" on public."TikTokAd" (country,"profitScore" desc);

alter table public."PaymentRequest" add column if not exists "referenceNormalized" text;
alter table public."PaymentRequest" add column if not exists "reviewedBy" uuid references auth.users(id);
update public."PaymentRequest" set "referenceNormalized"=upper(regexp_replace(reference,'\s+','','g')) where "referenceNormalized" is null;
create unique index if not exists "PaymentRequest_reference_normalized_key" on public."PaymentRequest" ("referenceNormalized") where "referenceNormalized" is not null;

commit;
