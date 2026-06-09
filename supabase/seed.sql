-- Сансар гар утас худалдаа — Анхдагч өгөгдөл (seed)
-- Хэрэглэх: schema.sql ажиллуулсны ДАРАА SQL Editor дээр энэ файлыг RUN.
-- Эзэн дараа нь админ панелиас засаж болно. Дахин ажиллуулахад давхардуулахгүй.

-- ----- Төлбөрийн аргууд -----
insert into public.payment_methods (name, type, max_installments, min_amount, note, sort_order, is_active) values
  ('Storepay', 'split', 6,    100000, 'Хүүгүй хуваан төлөлт. 100,000₮-аас дээш дүнд боломжтой.', 1, true),
  ('M Credit', 'split', 4,    null,   'Хүүгүй хуваан төлөлт.',                                    2, true),
  ('Pocket',   'loan',  null, null,   'Цахим зээл. Эцсийн нөхцөл (хүү, хугацаа) аппад тогтоно.',  3, true),
  ('LendMN',   'loan',  null, null,   'Цахим зээл. Эцсийн нөхцөл (хүү, хугацаа) аппад тогтоно.',  4, true)
on conflict (name) do nothing;

-- ----- Тохиргоо (баннераас — эзэн зөвийг шалгана) -----
insert into public.settings (key, value) values
  ('shop_name',    'Сансар гар утас худалдаа'),
  ('hours',        'Өдөр бүр 09:00–21:00'),
  ('phone',        '8806-6726'),
  ('address',      'Сансарын баянцээлийн туслах замаар өгсөөд Laundry zone угаалгын газраар баруун эргээд, Сансар гар утас худалдааны төв'),
  ('facebook_url', ''),   -- эзнээс авна
  ('logo_url',     '')    -- лого upload хийсний дараа бөглөнө
on conflict (key) do nothing;

-- ----- iPhone 16 / 16 Plus жишиг нөөц (зураг public/photo-оос) -----
-- Зөвхөн iPhone 16 урьд нь ороогүй бол нэмнэ (давхардуулахгүй).
-- color/model нь lib/photos.ts manifest-тэй таарна → вэбэд зураг автоматаар холбогдоно.
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
