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
  battery_health int check (battery_health between 0 and 100),
  price       integer not null check (price >= 0),
  image_url   text,
  description text,
  status      text not null default 'available' check (status in ('available','sold')),
  created_at  timestamptz not null default now()
);

-- Хуучин суулгацад багана нэмэх (idempotent)
alter table public.phones
  add column if not exists battery_health int check (battery_health between 0 and 100);

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

-- iPhone 16 / 16 Plus жишиг нөөц (зураг public/photo-оос). Зөвхөн урьд ороогүй бол.
insert into public.phones
  (brand, model, storage, color, condition, battery_health, price, image_url, status)
select v.brand, v.model, v.storage, v.color, v.condition, v.battery_health, v.price, v.image_url, 'available'
from (values
  ('Apple','iPhone 16','128GB','Хар','new',           null::int, 2990000, '/photo/iphone-16/black.webp'),
  ('Apple','iPhone 16','256GB','Хар','new',           null,      3290000, '/photo/iphone-16/black.webp'),
  ('Apple','iPhone 16','128GB','Хар','used',          84,        2450000, '/photo/iphone-16/black.webp'),
  ('Apple','iPhone 16','128GB','Цагаан','new',        null,      2990000, '/photo/iphone-16/white.webp'),
  ('Apple','iPhone 16','256GB','Цагаан','used',       91,        2750000, '/photo/iphone-16/white.webp'),
  ('Apple','iPhone 16','256GB','Ягаан','new',         null,      3290000, '/photo/iphone-16/pink.webp'),
  ('Apple','iPhone 16','128GB','Ногоон-цэнхэр','new', null,      2990000, '/photo/iphone-16/teal.webp'),
  ('Apple','iPhone 16','128GB','Ногоон-цэнхэр','used',88,        2500000, '/photo/iphone-16/teal.webp'),
  ('Apple','iPhone 16','512GB','Хөх','new',           null,      3890000, '/photo/iphone-16/ultramarine.webp'),
  ('Apple','iPhone 16 Plus','128GB','Хар','new',      null,      3490000, '/photo/iphone-16-plus/black.webp'),
  ('Apple','iPhone 16 Plus','256GB','Хар','used',     93,        3150000, '/photo/iphone-16-plus/black.webp'),
  ('Apple','iPhone 16 Plus','256GB','Цагаан','new',   null,      3790000, '/photo/iphone-16-plus/white.webp'),
  ('Apple','iPhone 16 Plus','128GB','Ягаан','new',    null,      3490000, '/photo/iphone-16-plus/pink.webp'),
  ('Apple','iPhone 16 Plus','128GB','Ягаан','used',   86,        2990000, '/photo/iphone-16-plus/pink.webp'),
  ('Apple','iPhone 16 Plus','256GB','Ногоон-цэнхэр','new', null, 3790000, '/photo/iphone-16-plus/teal.webp'),
  ('Apple','iPhone 16 Plus','128GB','Хөх','new',      null,      3490000, '/photo/iphone-16-plus/ultramarine.webp'),
  ('Apple','iPhone 16 Plus','512GB','Хөх','used',     90,        3690000, '/photo/iphone-16-plus/ultramarine.webp')
) as v(brand, model, storage, color, condition, battery_health, price, image_url)
where not exists (
  select 1 from public.phones where model in ('iPhone 16','iPhone 16 Plus')
);

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
