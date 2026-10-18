-- Aggregate counters only. No IP addresses, visitor IDs, emails, full referrers or URL queries.
create table if not exists public.site_metrics_daily (
  day date not null default (now() at time zone 'Asia/Seoul')::date,
  event text not null check (event in ('page_view', 'plan_created', 'affiliate_click', 'card_download')),
  locale text not null check (locale in ('en','ja','zh-tw','zh-cn','vi','th','id','es','ko')),
  path text not null check (char_length(path) <= 200 and path ~ '^/[a-z0-9/-]*$'),
  product_id text not null default '' check (char_length(product_id) <= 80),
  placement text not null,
  source text not null check (source in ('direct','google','naver','bing','social','community','other')),
  count bigint not null default 1 check (count > 0),
  primary key (day, event, locale, path, product_id, placement, source)
);
alter table public.site_metrics_daily enable row level security;
revoke all on public.site_metrics_daily from anon, authenticated;
grant all on public.site_metrics_daily to service_role;

create or replace function public.record_site_metric(
  event_name text, locale_name text, page_name text,
  product_name text, placement_name text, source_name text
) returns void language sql security invoker set search_path = public as $$
  insert into public.site_metrics_daily (event, locale, path, product_id, placement, source)
  values (event_name, locale_name, page_name, product_name, placement_name, source_name)
  on conflict (day, event, locale, path, product_id, placement, source)
  do update set count = site_metrics_daily.count + 1;
$$;
revoke all on function public.record_site_metric(text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.record_site_metric(text,text,text,text,text,text) to service_role;

create or replace function public.site_metrics_report(since_day date)
returns jsonb language sql stable security invoker set search_path = public as $$
  with recent as (select * from public.site_metrics_daily where day >= since_day),
  totals as (select event, sum(count) as n from recent group by event),
  languages as (
    select locale, sum(count) filter (where event = 'page_view') as views,
      sum(count) filter (where event = 'affiliate_click') as clicks
    from recent group by locale
  ),
  products as (
    select product_id, sum(count) as clicks from recent
    where event = 'affiliate_click' group by product_id order by clicks desc limit 20
  ),
  pages as (
    select path, sum(count) filter (where event = 'page_view') as views,
      sum(count) filter (where event = 'affiliate_click') as clicks
    from recent group by path order by sum(count) desc limit 20
  ),
  sources as (
    select source, sum(count) filter (where event = 'page_view') as views,
      sum(count) filter (where event = 'affiliate_click') as clicks
    from recent group by source
  )
  select jsonb_build_object(
    'totals', coalesce((select jsonb_object_agg(event, n) from totals), '{}'::jsonb),
    'languages', coalesce((select jsonb_agg(languages) from languages), '[]'::jsonb),
    'products', coalesce((select jsonb_agg(products) from products), '[]'::jsonb),
    'pages', coalesce((select jsonb_agg(pages) from pages), '[]'::jsonb),
    'sources', coalesce((select jsonb_agg(sources) from sources), '[]'::jsonb)
  );
$$;
revoke all on function public.site_metrics_report(date) from public, anon, authenticated;
grant execute on function public.site_metrics_report(date) to service_role;
notify pgrst, 'reload schema';
