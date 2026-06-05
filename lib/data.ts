// Сансар гар утас худалдаа — өгөгдөл унших давхарга.
//
// Одоогоор mock өгөгдлөөр ажиллана. Supabase креденшл (.env.local) орвол
// доорх TODO хэсгүүдэд бодит query нэмж, нэг дор сэлгэнэ. Дуудлагын талбар
// (async signature) өөрчлөгдөхгүй тул UI-д нөлөөлөхгүй.

import type { Phone, PaymentMethod, Settings } from "./types";
import { mockPhones, mockPaymentMethods, mockSettings } from "./mock-data";

/** Supabase холболт тохируулагдсан эсэх */
export const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Зарагдах боломжтой утаснууд (шинээр нэмэгдсэнээс эхэлж). */
export async function getAvailablePhones(): Promise<Phone[]> {
  if (hasSupabase) {
    // TODO(Supabase): select * from phones where status='available' order by created_at desc
  }
  return mockPhones
    .filter((p) => p.status === "available")
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

/** Нэг утас id-аар (зарагдсан ч буцааж болно — хуудас өөрөө шийднэ). */
export async function getPhoneById(id: string): Promise<Phone | null> {
  if (hasSupabase) {
    // TODO(Supabase): select * from phones where id = :id
  }
  return mockPhones.find((p) => p.id === id) ?? null;
}

/** Идэвхтэй төлбөрийн аргууд (харагдах дарааллаар). */
export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  if (hasSupabase) {
    // TODO(Supabase): select * from payment_methods where is_active=true order by sort_order
  }
  return mockPaymentMethods
    .filter((m) => m.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** Дэлгүүрийн тохиргоо (key-value). */
export async function getSettings(): Promise<Settings> {
  if (hasSupabase) {
    // TODO(Supabase): select key, value from settings
  }
  return mockSettings;
}
