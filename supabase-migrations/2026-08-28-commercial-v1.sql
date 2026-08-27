begin;

create index if not exists "Ad_country_signal_idx" on public."Ad" (country,"signalScore" desc);
alter table public."TikTokAd" add column if not exists "isMock" boolean not null default false;
create index if not exists "TikTokAd_country_signal_idx" on public."TikTokAd" (country,"profitScore" desc);

alter table public."PaymentRequest" add column if not exists "referenceNormalized" text;
alter table public."PaymentRequest" add column if not exists "reviewedBy" uuid references auth.users(id);
update public."PaymentRequest" set "referenceNormalized"=upper(regexp_replace(reference,'\s+','','g')) where "referenceNormalized" is null;
with ranked as (select id,row_number() over(partition by "referenceNormalized" order by id) rn from public."PaymentRequest" where "referenceNormalized" is not null) update public."PaymentRequest" p set "referenceNormalized"=null from ranked r where p.id=r.id and r.rn>1;
create unique index if not exists "PaymentRequest_reference_normalized_key" on public."PaymentRequest" ("referenceNormalized") where "referenceNormalized" is not null;

-- Recalculate historical Meta observations with Signal Score V2 so legacy scores no longer cluster at 80.
update public."Ad" set "signalScore"=least(100,
  least(34,round(12*log(10,greatest(1,"daysActive")+1))) +
  least(22,round(4*log(10,greatest(0,coalesce(likes,0)+coalesce(comments,0)*3+coalesce(shares,0)*4)+1))) +
  16 + case when "creativeType"='VIDEO' then 9 when "creativeType"='CAROUSEL' then 8 else 6 end +
  case when "landingUrl" is not null and length("landingUrl")>0 then 9 else 2 end
)::int;

create or replace function public.review_adspy_payment(p_id bigint,p_reviewer uuid,p_decision text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare p public."PaymentRequest";begin
  if p_decision not in ('APPROVED','REJECTED') then raise exception 'Invalid decision';end if;
  select * into p from public."PaymentRequest" where id=p_id for update;
  if not found then raise exception 'Payment request not found';end if;
  if p.status<>'PENDING' then raise exception 'Payment request already reviewed';end if;
  update public."PaymentRequest" set status=p_decision,"reviewedAt"=now(),"reviewedBy"=p_reviewer where id=p_id returning * into p;
  if p_decision='APPROVED' then update public."Profile" set plan='PRO',status='ACTIVE',"paymentReference"=p.reference,"planExpiresAt"=now()+interval '30 days',"updatedAt"=now() where id=p."userId";end if;
  return to_jsonb(p);
end$$;
revoke all on function public.review_adspy_payment(bigint,uuid,text) from public,anon,authenticated;
grant execute on function public.review_adspy_payment(bigint,uuid,text) to service_role;

commit;
