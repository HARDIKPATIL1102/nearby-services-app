-- NearbyFix — initial schema, RLS, auth profile sync (Phase 3)
-- Apply in Supabase Dashboard → SQL → New query, or: supabase db push
--
-- If `execute function` errors on your Postgres build, use:
--   execute procedure public.handle_new_user ();
--
-- After apply: confirm Email auth is enabled; optional backfill for users created
-- before this migration:
--   insert into public.users (id, name, email, role)
--   select u.id,
--     coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), split_part(u.email, '@', 1)),
--     u.email,
--     case coalesce(u.raw_user_meta_data->>'role', 'customer') when 'provider' then 'provider' when 'admin' then 'admin' else 'customer' end
--   from auth.users u
--   where not exists (select 1 from public.users p where p.id = u.id)
--   on conflict (id) do nothing;

begin;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null,
  role text not null default 'customer'
    check (role in ('customer', 'provider', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  icon text not null default 'Sparkles',
  description text,
  created_at timestamptz not null default now (),
  constraint categories_name_unique unique (name)
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  business_name text not null,
  category_id uuid not null references public.categories (id),
  location text not null default '',
  description text not null default '',
  rating numeric(3, 2) not null default 0
    check (rating >= 0 and rating <= 5),
  price_range text not null default '$$',
  phone text,
  whatsapp text,
  availability text not null default 'Contact for availability',
  verified boolean not null default false,
  created_at timestamptz not null default now (),
  constraint providers_one_per_user unique (user_id)
);

create index if not exists providers_category_id_idx on public.providers (category_id);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid (),
  provider_id uuid not null references public.providers (id) on delete cascade,
  title text not null,
  description text not null default '',
  category_id uuid not null references public.categories (id),
  price numeric(10, 2) not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now ()
);

create index if not exists services_provider_id_idx on public.services (provider_id);
create index if not exists services_category_id_idx on public.services (category_id);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid (),
  customer_id uuid not null references public.users (id) on delete restrict,
  provider_id uuid not null references public.providers (id) on delete restrict,
  service_id uuid not null references public.services (id) on delete restrict,
  booking_date date not null,
  booking_time time not null,
  address text not null,
  notes text not null default '',
  status text not null default 'pending'
    check (
      status in (
        'pending',
        'confirmed',
        'rejected',
        'in_progress',
        'completed',
        'cancelled'
      )
    ),
  created_at timestamptz not null default now ()
);

create index if not exists bookings_customer_id_idx on public.bookings (customer_id);
create index if not exists bookings_provider_id_idx on public.bookings (provider_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid (),
  customer_id uuid not null references public.users (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now (),
  constraint reviews_one_per_customer_provider unique (customer_id, provider_id)
);

create index if not exists reviews_provider_id_idx on public.reviews (provider_id);

-- ---------------------------------------------------------------------------
-- Sync auth.users → public.users
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    new.email,
    case coalesce(new.raw_user_meta_data->>'role', 'customer')
      when 'provider' then 'provider'
      when 'admin' then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user ();

-- ---------------------------------------------------------------------------
-- Helper: admin check (bypasses RLS when evaluating policies)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin ()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid ()
      and u.role = 'admin'
  );
$$;

grant execute on function public.is_admin () to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.providers enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- users
drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users
  for select using (auth.uid () = id or public.is_admin ());

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users
  for update using (auth.uid () = id)
  with check (auth.uid () = id);

drop policy if exists "users_admin_update" on public.users;
create policy "users_admin_update" on public.users
  for update using (public.is_admin ())
  with check (public.is_admin ());

-- categories
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all" on public.categories
  for select using (true);

drop policy if exists "categories_write_admin" on public.categories;
create policy "categories_write_admin" on public.categories
  for all using (public.is_admin ())
  with check (public.is_admin ());

-- providers
drop policy if exists "providers_select_all" on public.providers;
create policy "providers_select_all" on public.providers
  for select using (true);

drop policy if exists "providers_insert_own_provider_role" on public.providers;
create policy "providers_insert_own_provider_role" on public.providers
  for insert with check (
    auth.uid () = user_id
    and exists (
      select 1
      from public.users u
      where u.id = auth.uid ()
        and u.role = 'provider'
    )
  );

drop policy if exists "providers_update_own" on public.providers;
create policy "providers_update_own" on public.providers
  for update using (auth.uid () = user_id)
  with check (auth.uid () = user_id);

drop policy if exists "providers_delete_own_or_admin" on public.providers;
create policy "providers_delete_own_or_admin" on public.providers
  for delete using (auth.uid () = user_id or public.is_admin ());

-- services
drop policy if exists "services_select_visible" on public.services;
create policy "services_select_visible" on public.services
  for select using (
    active = true
    or exists (
      select 1
      from public.providers p
      where p.id = services.provider_id
        and p.user_id = auth.uid ()
    )
  );

drop policy if exists "services_insert_owner" on public.services;
create policy "services_insert_owner" on public.services
  for insert with check (
    exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
  );

drop policy if exists "services_update_owner" on public.services;
create policy "services_update_owner" on public.services
  for update using (
    exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
  )
  with check (
    exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
  );

drop policy if exists "services_delete_owner" on public.services;
create policy "services_delete_owner" on public.services
  for delete using (
    exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
  );

-- bookings
drop policy if exists "bookings_select_parties" on public.bookings;
create policy "bookings_select_parties" on public.bookings
  for select using (
    customer_id = auth.uid ()
    or exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
    or public.is_admin ()
  );

drop policy if exists "bookings_insert_customer" on public.bookings;
create policy "bookings_insert_customer" on public.bookings
  for insert with check (
    customer_id = auth.uid ()
    and exists (
      select 1
      from public.users u
      where u.id = auth.uid ()
        and u.role = 'customer'
    )
  );

drop policy if exists "bookings_update_parties" on public.bookings;
create policy "bookings_update_parties" on public.bookings
  for update using (
    customer_id = auth.uid ()
    or exists (
      select 1
      from public.providers p
      where p.id = provider_id
        and p.user_id = auth.uid ()
    )
    or public.is_admin ()
  );

-- reviews
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (customer_id = auth.uid ());

drop policy if exists "reviews_update_own_or_admin" on public.reviews;
create policy "reviews_update_own_or_admin" on public.reviews
  for update using (customer_id = auth.uid () or public.is_admin ());

drop policy if exists "reviews_delete_own_or_admin" on public.reviews;
create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (customer_id = auth.uid () or public.is_admin ());

-- ---------------------------------------------------------------------------
-- Grants (RLS still applies)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on table public.categories to anon, authenticated;
grant select, insert, update, delete on table public.categories to authenticated;

grant select on table public.users to authenticated;
grant update on table public.users to authenticated;

grant select on table public.providers to anon, authenticated;
grant insert, update, delete on table public.providers to authenticated;

grant select on table public.services to anon, authenticated;
grant insert, update, delete on table public.services to authenticated;

grant select, insert, update on table public.bookings to authenticated;

grant select on table public.reviews to anon;
grant select, insert, update, delete on table public.reviews to authenticated;

-- ---------------------------------------------------------------------------
-- Seed categories (idempotent)
-- ---------------------------------------------------------------------------

insert into public.categories (name, icon, description)
values
  ('Plumbing', 'Droplets', 'Leaks, installs, and urgent fixes'),
  ('Electrical', 'Zap', 'Wiring, fixtures, and safety checks'),
  ('Cleaning', 'Sparkles', 'Deep cleans and recurring visits'),
  ('HVAC', 'Wind', 'Heating, cooling, and maintenance'),
  ('Handyman', 'Hammer', 'Small repairs and assembly'),
  ('Gardening', 'Leaf', 'Lawn care and outdoor upkeep')
on conflict (name) do update set
  icon = excluded.icon,
  description = excluded.description;

commit;
