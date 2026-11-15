-- GHSS Vellalankulam Alumni – database schema
-- Run once in Supabase: SQL Editor → New query → paste → Run.
--
-- Access model: the website's server talks to the database with the
-- service_role key. Browsers never talk to the database directly, so the
-- public (anon) and logged-in (authenticated) roles get NO access at all.

create extension if not exists pgcrypto;

create table if not exists public.alumni (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  name             text not null check (length(name) between 1 and 100),
  father_name      text not null check (length(father_name) between 1 and 100),
  -- door_no / street can be empty only for rows imported from the old Google Sheet; the form requires them
  door_no          text check (door_no is null or length(door_no) between 1 and 20),
  street           text check (street is null or length(street) between 1 and 100),
  village          text not null check (length(village) between 1 and 100),
  passed_out_year  int  not null check (passed_out_year between 1950 and 2100),
  phone            text not null check (phone ~ '^\+[0-9]{1,4} [0-9]{6,14}$'),
  email            text check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  worked_as        text check (worked_as is null or length(worked_as) <= 100),
  currently_doing  text not null check (length(currently_doing) between 1 and 150),
  form_language    text not null default 'Tamil' check (form_language in ('Tamil', 'English')),
  show_contact     boolean not null default false,
  token            text not null unique default encode(gen_random_bytes(16), 'hex')
                     check (token ~ '^[a-f0-9]{32}$'),
  source           text not null default 'web'
);

-- Same person can't register twice with the same number (siblings sharing a phone are fine)
create unique index if not exists alumni_name_phone_uniq on public.alumni (lower(name), phone);
create index if not exists alumni_year_idx    on public.alumni (passed_out_year);
create index if not exists alumni_email_idx   on public.alumni (lower(email));
create index if not exists alumni_village_idx on public.alumni (lower(village));

-- "Lost my link" emails: one per address every 10 minutes
create table if not exists public.recovery_log (
  id          bigint generated always as identity primary key,
  email_hash  text not null,
  created_at  timestamptz not null default now()
);
create index if not exists recovery_log_idx on public.recovery_log (email_hash, created_at desc);

-- Lock everything down: Row Level Security on, and no policies → no access for
-- anon/authenticated. (service_role bypasses RLS and is used only on the server.)
alter table public.alumni       enable row level security;
alter table public.recovery_log enable row level security;
revoke all on public.alumni       from anon, authenticated;
revoke all on public.recovery_log from anon, authenticated;
grant all on public.alumni, public.recovery_log to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Small helpers the server calls (counts per batch, village names for suggestions).
-- Only the server's service_role may run them.
create or replace function public.batch_counts()
returns table (passed_out_year int, n bigint)
language sql stable security invoker set search_path = public as $$
  select passed_out_year, count(*) from public.alumni group by passed_out_year order by passed_out_year desc;
$$;

create or replace function public.village_names()
returns table (village text)
language sql stable security invoker set search_path = public as $$
  select min(village) from public.alumni group by lower(village) order by 1;
$$;

revoke execute on function public.batch_counts()  from public, anon, authenticated;
revoke execute on function public.village_names() from public, anon, authenticated;
grant  execute on function public.batch_counts()  to service_role;
grant  execute on function public.village_names() to service_role;
