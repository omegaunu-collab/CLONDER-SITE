-- Naddict shop schema (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  subscribe_price_cents integer,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'fulfilled')),
  currency text not null default 'GBP',
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  purchase_type text not null default 'one-time',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products for select
  using (active = true);

-- Orders: no public access; API uses service role

insert into public.products (slug, name, description, price_cents, subscribe_price_cents, image_url, sort_order)
values
  (
    'nad-smartstrip',
    'NAD SmartStrip+',
    'Smartstrip+ with SpeedRelease: ditch the needles and just let it melt for a daily boost.',
    6900,
    4900,
    'cdn/shop/t/32/assets/Nad%20Strip9321.png?v=172847355907439936341775885985',
    1
  ),
  (
    'nad-prime-vials',
    'Nad+Prime Vial kit',
    'Pure, potent NAD+ vial designed to restore cellular energy, focus, and performance.',
    24900,
    21165,
    'cdn/shop/t/32/assets/Vialsff43.png?v=90810362016220207791775885985',
    2
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  subscribe_price_cents = excluded.subscribe_price_cents,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();
