// Сансар гар утас худалдаа — өгөгдөл унших давхарга.
//
// Supabase креденшл (.env.local) байвал бодит DB, үгүй бол mock өгөгдөл.
// Дуудлагын талбар (async signature) ижил тул UI-д нөлөөлөхгүй.

import type { Phone, PaymentMethod, Settings } from "./types";
import { mockPhones, mockPaymentMethods, mockSettings } from "./mock-data";
import { createClient } from "./supabase/server";

/** Supabase холболт тохируулагдсан эсэх */
export const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Зарагдах боломжтой утаснууд (шинээр нэмэгдсэнээс эхэлж). */
export async function getAvailablePhones(): Promise<Phone[]> {
  if (hasSupabase) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("phones")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Phone[];
  }
  return mockPhones
    .filter((p) => p.status === "available")
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

/** Нэг утас id-аар (зарагдсан ч буцааж болно — хуудас өөрөө шийднэ). */
export async function getPhoneById(id: string): Promise<Phone | null> {
  if (hasSupabase) {
    // UUID биш бол шууд "олдсонгүй" — Postgres uuid алдаанаас (500) сэргийлнэ
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    ) {
      return null;
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("phones")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Phone) ?? null;
  }
  return mockPhones.find((p) => p.id === id) ?? null;
}

/** Идэвхтэй төлбөрийн аргууд (харагдах дарааллаар). */
export async function getActivePaymentMethods(): Promise<PaymentMethod[]> {
  if (hasSupabase) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PaymentMethod[];
  }
  return mockPaymentMethods
    .filter((m) => m.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** Дэлгүүрийн тохиргоо (key-value → объект). */
export async function getSettings(): Promise<Settings> {
  if (hasSupabase) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error) throw error;
    const out: Settings = {};
    for (const row of data ?? []) out[row.key as string] = (row.value as string) ?? "";
    return out;
  }
  return mockSettings;
}
