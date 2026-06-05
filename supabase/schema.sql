-- Сансар гар утас худалдаа — Өгөгдлийн сангийн бүтэц (schema)
-- Хэрэглэх: Supabase Dashboard → SQL Editor → New query → энэ файлыг бүтнээр хуулж RUN.
-- Дахин ажиллуулахад аюулгүй (idempotent).

-- ===================== Хүснэгтүүд =====================

-- Утаснууд
create table if not exists public.phones (
  id          uuid primary key default gen_random_uuid(),
  brand       text not null,                       -- Apple, Samsung, Xiaomi…
  model       text not null,                       -- iPhone 15 Pro гэх мэт
  storage     text,                                -- 128GB, 256GB…
  color       text,                                -- өнгө
  condition   text not null default 'used' check (condition in ('new','used')),
  price       integer not null check (price >= 0), -- бэлэн үнэ ₮
  image_url   text,                                -- Supabase Storage-ийн зураг
  description text,                                 -- нэмэлт тайлбар
  status      text not null default 'available' check (status in ('available','sold')),
  created_at  timestamptz not null default now()
);

-- Төлбөрийн аргууд (апп)
create table if not exists public.payment_methods (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,            -- Storepay, M Credit, Pocket, LendMN…
  type             text not null check (type in ('split','loan')),
  max_installments int,                             -- зөвхөн split-д (ж: Storepay=6)
  min_amount       int,                             -- энэ дүнгээс дээш бол хамаарна
  note             text,                            -- монголоор тайлбар
  logo_url         text,                            -- аппын лого
  sort_order       int not null default 0,          -- харагдах дараалал
  is_active        boolean not null default true
);

-- Тохиргоо (key-value)
create table if not exists public.settings (
  key   text primary key,
  value text
);

-- ===================== Индекс =====================
create index if not exists phones_status_idx        on public.phones (status);
create index if not exists phones_brand_idx          on public.phones (brand);
create index if not exists payment_methods_sort_idx  on public.payment_methods (is_active, sort_order);

-- ===================== RLS (мөр түвшний хамгаалалт) =====================
alter table public.phones          enable row level security;
alter table public.payment_methods enable row level security;
alter table public.settings        enable row level security;

-- Утас: олон нийт ЗӨВХӨН available үзнэ; нэвтэрсэн админ бүгдийг удирдана
drop policy if exists "phones public read available" on public.phones;
create policy "phones public read available"
  on public.phones for select to anon
  using (status = 'available');

drop policy if exists "phones admin all" on public.phones;
create policy "phones admin all"
  on public.phones for all to authenticated
  using (true) with check (true);

-- Төлбөрийн апп: олон нийт ЗӨВХӨН идэвхтэйг үзнэ; админ бүгдийг удирдана
drop policy if exists "pm public read active" on public.payment_methods;
create policy "pm public read active"
  on public.payment_methods for select to anon
  using (is_active = true);

drop policy if exists "pm admin all" on public.payment_methods;
create policy "pm admin all"
  on public.payment_methods for all to authenticated
  using (true) with check (true);

-- Тохиргоо: олон нийт уншина (цаг, хаяг, утас — ил мэдээлэл); админ засна
drop policy if exists "settings public read" on public.settings;
create policy "settings public read"
  on public.settings for select to anon
  using (true);

drop policy if exists "settings admin all" on public.settings;
create policy "settings admin all"
  on public.settings for all to authenticated
  using (true) with check (true);
