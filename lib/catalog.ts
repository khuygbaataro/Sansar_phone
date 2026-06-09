// Сансар гар утас худалдаа — каталогийн "read-model" давхарга.
//
// Хавтгай `phones` (нэг мөр = нэг нэгж)-ийг ЗАГВАРААР бүлэглэж, Apple маягийн
// каталог/дэлгэрэнгүйд хэрэгтэй бүтцийг гаргана. DB-г өөрчлөхгүй — зөвхөн front-end дээр.
//
// Зөвхөн manifest (lib/photos.ts)-д зурагтай iPhone загварууд "showcase" болно;
// бусад iPhone (зураггүй) ба бусад брэнд энгийн нэгж картаараа хэвээр.

import type { Phone } from "./types";
import {
  getModelColors,
  getPhotoModel,
  hasPhotoModel,
  normalizeColor,
  slugifyModel,
  type PhotoColor,
} from "./photos";

/** Apple iPhone эсэх (зурагтай эсэхээс үл хамаарна). */
export function isIphone(p: Phone): boolean {
  return p.brand.trim().toLowerCase() === "apple" && /iphone/i.test(p.model);
}

/** Apple маягийн загвар-харагдацад тэнцэх эсэх (manifest-д зурагтай iPhone). */
export function hasIphoneShowcase(p: Phone): boolean {
  return isIphone(p) && hasPhotoModel(p.model);
}

export interface ModelColor extends PhotoColor {
  inStock: boolean; // тухайн өнгөнд боломжтой нэгж байгаа эсэх
}

export interface ModelGroup {
  modelSlug: string;
  modelName: string;
  brand: string;
  units: Phone[]; // зөвхөн available
  colors: ModelColor[]; // manifest дараалал, inStock тэмдэгтэй
  minPrice: number; // боломжтой нэгжүүдийн хамгийн бага үнэ
  hasNew: boolean;
  hasUsed: boolean;
  heroImage: string | null; // эхний боломжтой өнгөний зураг
}

/**
 * Available iPhone (showcase) нэгжүүдийг загвараар бүлэглэнэ.
 * Зөвхөн `status='available'` ба manifest-д зурагтай загварууд.
 */
export function groupIphoneModels(phones: Phone[]): ModelGroup[] {
  const byModel = new Map<string, Phone[]>();
  for (const p of phones) {
    if (p.status !== "available") continue;
    if (!hasIphoneShowcase(p)) continue;
    const slug = slugifyModel(p.model);
    const arr = byModel.get(slug) ?? [];
    arr.push(p);
    byModel.set(slug, arr);
  }

  const groups: ModelGroup[] = [];
  for (const [slug, units] of byModel) {
    const model = units[0].model;
    const modelName = getPhotoModel(model)?.modelName ?? model;

    const stockSlugs = new Set(
      units
        .map((u) => normalizeColor(u.color))
        .filter((s): s is NonNullable<typeof s> => s != null),
    );

    const colors: ModelColor[] = getModelColors(model).map((c) => ({
      ...c,
      inStock: stockSlugs.has(c.slug),
    }));

    const minPrice = Math.min(...units.map((u) => u.price));
    const firstInStock = colors.find((c) => c.inStock) ?? colors[0] ?? null;

    groups.push({
      modelSlug: slug,
      modelName,
      brand: units[0].brand,
      units,
      colors,
      minPrice,
      hasNew: units.some((u) => u.condition === "new"),
      hasUsed: units.some((u) => u.condition === "used"),
      heroImage: firstInStock?.image ?? null,
    });
  }

  // Тогтвортой эрэмбэ — загварын нэрээр (iPhone 16, iPhone 16 Plus, …).
  groups.sort((a, b) => a.modelName.localeCompare(b.modelName, "en"));
  return groups;
}

/** Нэг загварыг слагаар олно (дэлгэрэнгүй хуудсанд). */
export function getIphoneModel(
  phones: Phone[],
  modelSlug: string,
): ModelGroup | null {
  return groupIphoneModels(phones).find((g) => g.modelSlug === modelSlug) ?? null;
}
