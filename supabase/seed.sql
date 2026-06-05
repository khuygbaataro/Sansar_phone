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
