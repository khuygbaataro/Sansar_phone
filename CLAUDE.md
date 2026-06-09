@AGENTS.md

# iPhone — Apple маягийн каталог + дэлгэрэнгүй (front-end)

> Энэ хэсэг нь 2026-06-10-нд нэмэгдсэн iPhone showcase боломжийг тайлбарлана.
> Зорилго: Apple дэлгүүрийн маягийн цэвэр, премиум, mobile-first харагдац — өнгө
> дармагц зураг гөлгөр солигдоно. Зөвхөн iPhone-д энэ дэлгэрэнгүй view хэрэгжинэ.

## Архитектурын шийдэл (additive — DB-г сүйтгээгүй)

`phones` хүснэгт нь **нэг мөр = нэг бодит нэгж (inventory)** хэвээр. Тусдаа
`phone_models`/`inventory` хүснэгт рүү шилжээгүй — оронд нь front-end дээр
**загвараар бүлэглэх "read-model"** үүсгэсэн. Ингэснээр админ/backend бараг
хөндөгдөөгүй. `phones`-д ганц `battery_health int (0..100, nullable)` багана нэмсэн.

## Гол файлууд

- **`lib/photos.ts`** — iPhone зургийн **manifest** (нэг эх сурвалж). Загвар+өнгө →
  зураг (`/photo/<model>/<color>.webp`) + swatch hex. Туслахууд: `slugifyModel`,
  `normalizeColor` (МН/EN өнгө → slug), `getColorImage`, `getModelColors`, `hasPhotoModel`.
- **`lib/catalog.ts`** — `groupIphoneModels(phones)` нь available iPhone-уудыг
  загвараар бүлэглэж `ModelGroup` (өнгө+inStock, minPrice, шинэ/хуучин, hero зураг)
  гаргана. `hasIphoneShowcase(p)` = Apple iPhone **бөгөөд manifest-д зурагтай**.
  Зураггүй iPhone (ж: iPhone 15 Pro) ба бусад брэнд энгийн картаар хэвээр.
- **`components/Catalog.tsx`** — iPhone-ыг загвараар бүлэглэн нэг карт; бусдыг `PhoneCard`-аар.
- **`components/iphone/IphoneModelCard.tsx`** — каталогийн Apple маягийн загварын карт.
- **`app/iphone/[model]/page.tsx`** (server) + **`components/iphone/IphoneDetail.tsx`**
  (client) — том hero (өнгөний зургуудыг opacity-гаар crossfade), өнгөний swatch
  (нөөцгүйг disabled), Шинэ/Хуучин таб, нэгж бүрийн storage/battery/үнэ + хүүгүй
  split highlight, холбоо барих CTA (Messenger `facebook_url` → байхгүй бол `tel:phone`).
  Төлбөрийн тооцоонд одоо байгаа `components/PaymentSection.tsx`-ийг дахин ашигладаг.
- **`components/admin/PhoneForm.tsx`** — `battery_health` талбар (зөвхөн `used`);
  Apple iPhone сонгоход өнгө dropdown болж, model+color-оор `image_url`-ийг manifest-аас
  **автоматаар** оноодог (гараар upload хийсэн зургийг дарж бичихгүй).

## Зургийн сан

- Эх зургууд: репо дахь **`Photo/`** (Apple-ийн албан ёсны хуудаснаас, нэр жигд бус).
- Үйлчилгээний хувилбар: **`public/photo/<model-slug>/<color-slug>.webp`** (next/image-ээр
  optimize). Загвар бүрд нэг primary front зураг сонгож нормчилсон.
- iPhone 16: `iphone-16`, iPhone 16 Plus: `iphone-16-plus`; өнгө: `black, white, pink, teal, ultramarine`.

## Шинэ загвар/өнгө нэмэх

1. `public/photo/<model-slug>/<color>.webp` зураг(ууд) тавих.
2. `lib/photos.ts` → `IPHONE_PHOTOS`-д загвар нэмэх (модель нэр manifest-тэй таарна).
3. Нөөц нэмэхдээ админд тухайн загвар+өнгөг сонгоход зураг автоматаар холбогдоно.

## Өгөгдлийн загвар & тест

- `lib/types.ts` `Phone.battery_health`; `supabase/{schema,setup-all}.sql`-д idempotent
  `alter table ... add column if not exists battery_health`; `seed.sql`-д iPhone 16/16 Plus
  жишиг нөөц (давхардуулахгүй `where not exists`). `mock-data.ts`-д ижил демо (live DB-гүй үед).
- `/api/catalog`-д `battery_health` талбар нэмэгдсэн.
- Тест: `npx vitest run` (`lib/catalog.test.ts` + `lib/calc.test.ts`). Build: `npm run build`.

## Анхаарах (Next.js 16)

`next/image`-ийн `priority` deprecated → `preload`; default `quality=[75]` (custom quality
нэмбэл `next.config`-д allowlist). `params` нь Promise. `middleware` биш `proxy.ts`.
