-- Aggregated review counts for provider listings (Phase 4)

begin;

create or replace function public.provider_review_counts (pids uuid[])
returns table (
  provider_id uuid,
  review_count integer
)
language sql
stable
security invoker
set search_path = public
as $$
  select r.provider_id, (count(*)::integer) as review_count
  from public.reviews r
  where r.provider_id = any (pids)
  group by r.provider_id;
$$;

grant execute on function public.provider_review_counts (uuid[]) to anon, authenticated;

commit;
