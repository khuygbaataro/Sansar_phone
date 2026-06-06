-- ============================================================
-- Сансар гар утас худалдаа — БҮХ тохиргоо НЭГ дор
-- Supabase Dashboard → SQL Editor → New query → энэ файлыг
-- бүтнээр хуулж тавиад RUN дарна уу. (schema + seed + storage)
-- Дахин ажиллуулахад аюулгүй (idempotent).
-- ============================================================

-- ===================== 1. ХҮСНЭГТҮҮД =====================

create table if not exists public.phones (
  id          uuid primary key default gen_random_uuid(),
  brand       text not null,
  model       text not null,
  storage     text,
  color       text,
  condition   text not null default 'used' check (condition in ('new','used')),
  price       integer not null check (price >= 0),
  image_url   text,
  description text,
  status      text not null default 'available' check (status in ('available','sold')),
  created_at  timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  type             text not null check (type in ('split','loan')),
  max_installments int,
  min_amount       int,
  note             text,
  logo_url         text,
  sort_order       int not null default 0,
  is_active        boolean not null default true
);

create table if not exists public.settings (
  key   text primary key,
  value text
);

create index if not exists phones_status_idx       on public.phones (status);
create index if not exists phones_brand_idx         on public.phones (brand);
create index if not exists payment_methods_sort_idx on public.payment_methods (is_active, sort_order);

-- ===================== 2. RLS (хамгаалалт) =====================

alter table public.phones          enable row level security;
alter table public.payment_methods enable row level security;
alter table public.settings        enable row level security;

drop policy if exists "phones public read available" on public.phones;
create policy "phones public read available"
  on public.phones for select to anon
  using (status = 'available');

drop policy if exists "phones admin all" on public.phones;
create policy "phones admin all"
  on public.phones for all to authenticated
  using (true) with check (true);

drop policy if exists "pm public read active" on public.payment_methods;
create policy "pm public read active"
  on public.payment_methods for select to anon
  using (is_active = true);

drop policy if exists "pm admin all" on public.payment_methods;
create policy "pm admin all"
  on public.payment_methods for all to authenticated
  using (true) with check (true);

drop policy if exists "settings public read" on public.settings;
create policy "settings public read"
  on public.settings for select to anon
  using (true);

drop policy if exists "settings admin all" on public.settings;
create policy "settings admin all"
  on public.settings for all to authenticated
  using (true) with check (true);

-- ===================== 3. SEED (анхдагч өгөгдөл) =====================

insert into public.payment_methods (name, type, max_installments, min_amount, note, sort_order, is_active) values
  ('Storepay', 'split', 6,    100000, 'Хүүгүй хуваан төлөлт. 100,000₮-аас дээш дүнд боломжтой.', 1, true),
  ('M Credit', 'split', 4,    null,   'Хүүгүй хуваан төлөлт.',                                    2, true),
  ('Pocket',   'loan',  null, null,   'Цахим зээл. Эцсийн нөхцөл (хүү, хугацаа) аппад тогтоно.',  3, true),
  ('LendMN',   'loan',  null, null,   'Цахим зээл. Эцсийн нөхцөл (хүү, хугацаа) аппад тогтоно.',  4, true)
on conflict (name) do nothing;

insert into public.settings (key, value) values
  ('shop_name',    'Сансар гар утас худалдаа'),
  ('hours',        'Өдөр бүр 09:00–21:00'),
  ('phone',        '8806-6726'),
  ('address',      'Сансарын баянцээлийн туслах замаар өгсөөд Laundry zone угаалгын газраар баруун эргээд, Сансар гар утас худалдааны төв'),
  ('facebook_url', ''),
  ('logo_url',     '')
on conflict (key) do nothing;

-- ===================== 4. STORAGE (зургийн сан) =====================

insert into storage.buckets (id, name, public)
values ('phones', 'phones', true)
on conflict (id) do nothing;

drop policy if exists "phones images public read" on storage.objects;
create policy "phones images public read"
  on storage.objects for select to anon
  using (bucket_id = 'phones');

drop policy if exists "phones images admin write" on storage.objects;
create policy "phones images admin write"
  on storage.objects for all to authenticated
  using (bucket_id = 'phones')
  with check (bucket_id = 'phones');

-- ============================================================
-- Дууслаа! "Success. No rows returned" гарвал зөв.
-- ============================================================
