revoke all on function public.handle_new_user() from public, anon, authenticated;

drop policy if exists "Users read own profile" on public."Profile";
create policy "Users read own profile" on public."Profile"
for select to authenticated
using (
  (select auth.uid()) = id
  and coalesce(((select auth.jwt())->>'is_anonymous')::boolean,false)=false
);

drop policy if exists "Users read own usage" on public."UsageEvent";
create policy "Users read own usage" on public."UsageEvent"
for select to authenticated
using (
  (select auth.uid()) = "userId"
  and coalesce(((select auth.jwt())->>'is_anonymous')::boolean,false)=false
);

drop policy if exists "Users read own payments" on public."PaymentRequest";
create policy "Users read own payments" on public."PaymentRequest"
for select to authenticated
using (
  (select auth.uid()) = "userId"
  and coalesce(((select auth.jwt())->>'is_anonymous')::boolean,false)=false
);

create index if not exists "PaymentRequest_userId_idx" on public."PaymentRequest" ("userId");
create index if not exists "PaymentRequest_reviewedBy_idx" on public."PaymentRequest" ("reviewedBy");
