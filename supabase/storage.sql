-- Сансар гар утас худалдаа — Storage (утасны зураг)
-- Хэрэглэх: SQL Editor дээр RUN. Эсвэл Dashboard → Storage-оос гараар "phones"
-- нэртэй PUBLIC bucket үүсгэж болно.

-- "phones" нэртэй нийтэд харагдах bucket
insert into storage.buckets (id, name, public)
values ('phones', 'phones', true)
on conflict (id) do nothing;

-- Зургийг олон нийт үзнэ
drop policy if exists "phones images public read" on storage.objects;
create policy "phones images public read"
  on storage.objects for select to anon
  using (bucket_id = 'phones');

-- Зөвхөн нэвтэрсэн админ зураг нэмэх / солих / устгах
drop policy if exists "phones images admin write" on storage.objects;
create policy "phones images admin write"
  on storage.objects for all to authenticated
  using (bucket_id = 'phones')
  with check (bucket_id = 'phones');
