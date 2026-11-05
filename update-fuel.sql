-- ============================================================
-- دربك: المطاعم + الاستراحات + حالة المحروقات (بنزين / مازوت / غاز)
-- شغّله مرة وحدة: Supabase > SQL Editor > الصق > Run
-- ============================================================

-- 1) فئتا المطاعم والاستراحات
alter table public.facilities drop constraint if exists facilities_kind_check;
alter table public.facilities add constraint facilities_kind_check
  check (kind in ('hospital','ambulance','fire','pharmacy','fuel','police','municipality','registry','hotel','airport','restaurant','rest'));

-- 2) جدول حالة المحروقات: تقرير واحد لكل (حساب، كازية، نوع). تحديثه بيستبدل القديم
create table if not exists public.fuel_reports (
  station text not null check (char_length(station) between 2 and 40),
  ftype text not null check (ftype in ('petrol','diesel','gas')),
  owner uuid not null references auth.users(id) on delete cascade,
  avail boolean not null,
  at timestamptz not null default now(),
  primary key (station, ftype, owner)
);
create index if not exists fuel_reports_at on public.fuel_reports (station, ftype, at desc);
alter table public.fuel_reports enable row level security;
revoke all on public.fuel_reports from anon, authenticated;   -- ما حدا بيقرأ ولا بيكتب مباشرة: بس عبر الدوال

-- 3) إرسال تقرير: لازم حساب مؤكَّد + لازم تكون قريب من الكازية (1.5 كم) + حد بالساعة
create or replace function public.report_fuel(
  p_station text, p_lat double precision, p_lon double precision,
  p_ulat double precision, p_ulon double precision,
  p_petrol boolean default null, p_diesel boolean default null, p_gas boolean default null)
returns void language plpgsql security definer set search_path = '' as $$
declare u uuid := public._need_user(); n int;
begin
  if p_station is null or char_length(p_station) not between 2 and 40 or p_station !~ '^[A-Za-z0-9-]+$' then raise exception 'bad_station'; end if;
  if p_lat is null or p_lon is null or p_ulat is null or p_ulon is null then raise exception 'outside_syria'; end if;
  if p_lat not between 32 and 37.5 or p_lon not between 35.5 and 42.5 then raise exception 'outside_syria'; end if;
  if public._dist_m(p_lat, p_lon, p_ulat, p_ulon) > 1500 then raise exception 'too_far'; end if;
  if p_petrol is null and p_diesel is null and p_gas is null then raise exception 'nothing'; end if;
  select count(*) into n from public.fuel_reports where owner = u and at > now() - interval '1 hour';
  if n >= 24 then raise exception 'rate_limit'; end if;
  if p_petrol is not null then
    insert into public.fuel_reports(station, ftype, owner, avail) values (p_station, 'petrol', u, p_petrol)
    on conflict (station, ftype, owner) do update set avail = excluded.avail, at = now(); end if;
  if p_diesel is not null then
    insert into public.fuel_reports(station, ftype, owner, avail) values (p_station, 'diesel', u, p_diesel)
    on conflict (station, ftype, owner) do update set avail = excluded.avail, at = now(); end if;
  if p_gas is not null then
    insert into public.fuel_reports(station, ftype, owner, avail) values (p_station, 'gas', u, p_gas)
    on conflict (station, ftype, owner) do update set avail = excluded.avail, at = now(); end if;
end $$;

-- 4) قراءة الحالة: آخر تقرير خلال 12 ساعة + كم شخص أكّد نفس الحالة خلال 6 ساعات (للكل، حتى بدون حساب)
create or replace function public.fuel_status(p_ids text[])
returns table(station text, ftype text, avail boolean, at bigint, n int)
language sql stable security definer set search_path = '' as $$
  select l.station, l.ftype, l.avail, (extract(epoch from l.at) * 1000)::bigint,
         (select count(*)::int from public.fuel_reports r
           where r.station = l.station and r.ftype = l.ftype and r.avail = l.avail and r.at > now() - interval '6 hours')
  from (
    select distinct on (station, ftype) station, ftype, avail, at
    from public.fuel_reports
    where station = any (p_ids[1:50]) and at > now() - interval '12 hours'
    order by station, ftype, at desc
  ) l;
$$;

revoke all on function public.report_fuel(text, double precision, double precision, double precision, double precision, boolean, boolean, boolean) from public;
revoke all on function public.fuel_status(text[]) from public;
grant execute on function public.report_fuel(text, double precision, double precision, double precision, double precision, boolean, boolean, boolean) to authenticated;
grant execute on function public.fuel_status(text[]) to anon, authenticated;

-- 5) تنظيف التقارير الأقدم من يومين (اختياري، بيتنفذ كل ما أحد بيرسل تقرير)
create or replace function public._fuel_gc() returns trigger language plpgsql security definer set search_path = '' as $$
begin delete from public.fuel_reports where at < now() - interval '2 days'; return null; end $$;
drop trigger if exists fuel_gc on public.fuel_reports;
create trigger fuel_gc after insert on public.fuel_reports for each statement execute function public._fuel_gc();
