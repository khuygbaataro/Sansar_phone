# Supabase бэлтгэх заавар — Сансар гар утас худалдаа

Энэ бол **эзэн (та)** Supabase дээр хийх ажлын алхам алхмын заавар.
Бүх бэлэн SQL энэ репогийн `supabase/` хавтсанд байгаа — зүгээр хуулж RUN дарна.

> Хэрэгтэй: үнэгүй Supabase акаунт ([supabase.com](https://supabase.com)). Google/GitHub-ээр нэвтэрч болно.

---

## 1. Төсөл үүсгэх
1. [supabase.com](https://supabase.com) → нэвтэрч → **New project**
2. Organization сонгох (эсвэл шинээр үүсгэх)
3. **Name:** `sansar` (дурын нэр)
4. **Database Password:** хүчтэй нууц үг өгөөд **хадгал** (дараа хэрэг болно)
5. **Region:** хэрэглэгчдэд ойр газар → Монголд **Northeast Asia (Tokyo)** эсвэл **Southeast Asia (Singapore)**
6. **Create new project** → 1–2 минут хүлээнэ

## 2. Хүснэгт + хамгаалалт үүсгэх
1. Зүүн цэс → **SQL Editor** → **New query**
2. `supabase/schema.sql` файлыг **бүтнээр** хуулж буулгаад → **Run** (Ctrl+Enter)
3. "Success. No rows returned" гарвал OK

## 3. Анхдагч өгөгдөл нэмэх
1. **New query** → `supabase/seed.sql`-ийг хуулж → **Run**
2. **Table Editor** → `payment_methods`, `settings` дээр өгөгдөл орсныг шалга

## 4. Зургийн сан (Storage)
- **New query** → `supabase/storage.sql`-ийг → **Run**
- (эсвэл гараар: **Storage → New bucket →** нэр `phones`, **Public bucket** асаах)

## 5. Админ хэрэглэгч үүсгэх
1. **Authentication → Users → Add user → Create new user**
2. Эзний **имэйл + нууц үг** → **Create**
3. ⚠️ **Чухал:** **Authentication → Sign In / Providers** (эсвэл Settings) дотор
   **"Allow new users to sign up"**-г **УНТРАА**.
   → Ингэснээр зөвхөн та л нэвтэрнэ, гадны хүн бүртгүүлж чадахгүй.

## 6. Түлхүүрүүдийг авах
1. **Project Settings (⚙) → API**
2. Дараах 3 утгыг хуулж ав:
   - **Project URL** — ж: `https://abcd1234.supabase.co`
   - **anon public** key
   - **service_role** key — 🔒 **НУУЦ**, хэнд ч бүү харуул

---

## 7. Надад юу өгөх вэ (эсвэл `.env.local`-д өөрөө хийх)

| Зүйл | Тайлбар |
|---|---|
| ☐ Project URL | дээрх 6-р алхмаас |
| ☐ anon key | дээрх 6-р алхмаас |
| ☐ service_role key | 🔒 нууц — chat-д өгөхөөс эмээвэл өөрөө `.env.local`-д хий |
| ☐ Facebook линк | `facebook_url` тохиргоонд орно |
| ☐ Дэлгүүрийн лого | зураг (байвал) |
| ☐ Цаг/утас/хаяг зөв эсэх | баннер дээрхийг баталгаажуул |

Эдгээрийг `.env.local` файлд хийнэ (загвар: `.env.example`).
**`.env.local` нь git-д ОРОХГҮЙ** — нууц аюулгүй.

---

## 🔒 Аюулгүй байдлын тэмдэглэл
- **service_role key** нь бүх RLS хамгаалалтыг тойрдог "супер түлхүүр". **Зөвхөн серверт.**
  Хэзээ ч browser-т, `NEXT_PUBLIC_`-д, эсвэл git-д бүү гарга.
- **anon key** ил гарч болно — өгөгдлийг RLS бодлого хамгаална (олон нийт зөвхөн
  зарагдах утас, идэвхтэй апп, тохиргоог л уншина).
