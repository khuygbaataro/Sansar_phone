// GET /api/catalog — чатботын read-only мэдээллийн эх сурвалж.
// Олон нийтэд нээлттэй, CORS нээлттэй. Зөвхөн зарагдах боломжтой утас.
// Админ өгөгдөл шинэчлэхэд бот энэ endpoint-оос автоматаар синк болно.

import { NextResponse } from "next/server";
import {
  getAvailablePhones,
  getActivePaymentMethods,
  getSettings,
} from "@/lib/data";
import { computeSplitOptions } from "@/lib/calc";

// Үргэлж шинэ өгөгдөл (статик кэш хийхгүй) — админ өөрчлөлт шууд тусна.
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const [phones, methods, settings] = await Promise.all([
    getAvailablePhones(),
    getActivePaymentMethods(),
    getSettings(),
  ]);

  const splitMethods = methods.filter((m) => m.type === "split");

  const phonesPayload = phones.map((p) => ({
    id: p.id,
    brand: p.brand,
    model: p.model,
    storage: p.storage,
    color: p.color,
    condition: p.condition,
    battery_health: p.battery_health,
    price: p.price,
    image_url: p.image_url,
    description: p.description,
    // хүүгүй хуваан төлөлтийн боломжит бүх сонголт (method, сар, сарын төлбөр)
    splits: splitMethods.flatMap((m) =>
      computeSplitOptions(p.price, m).map((o) => ({
        method: m.name,
        months: o.months,
        monthly: o.monthly,
        total: o.total,
      })),
    ),
  }));

  const paymentMethodsPayload = methods.map((m) => ({
    name: m.name,
    type: m.type, // 'split' (хүүгүй) | 'loan' (хүүтэй)
    max_installments: m.max_installments,
    min_amount: m.min_amount,
    note: m.note,
    logo_url: m.logo_url,
  }));

  return NextResponse.json(
    {
      phones: phonesPayload,
      payment_methods: paymentMethodsPayload,
      settings: {
        shop_name: settings.shop_name ?? "",
        hours: settings.hours ?? "",
        phone: settings.phone ?? "",
        address: settings.address ?? "",
        facebook_url: settings.facebook_url ?? "",
      },
      generated_at: new Date().toISOString(),
    },
    { headers: CORS },
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
