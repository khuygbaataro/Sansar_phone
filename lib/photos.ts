// Сансар гар утас худалдаа — iPhone-ны зургийн сан (manifest).
//
// `public/photo/<model-slug>/<color-slug>.webp` доторх нормчилсон зургуудыг
// загвар + өнгөөр map хийнэ. Энэ сан ДАХИН АШИГЛАГДАНА:
//   • олон нийтийн дэлгэрэнгүй хуудас — өнгө сонгоход hero зураг солих,
//   • админ — загвар+өнгө сонгоход image_url-ийг автоматаар холбох.
// Шинэ загвар/өнгө нэмэхдээ зөвхөн энэ файлд бичнэ (нэг эх сурвалж).

export type ColorSlug = "black" | "white" | "pink" | "teal" | "ultramarine";

export interface PhotoColor {
  slug: ColorSlug;
  nameMn: string; // mock/seed/админд хэрэглэх монгол нэр
  hex: string; // swatch-ийн бодит өнгө
  image: string; // /photo/... (public-ээс үйлчилнэ)
}

export interface PhotoModel {
  modelSlug: string;
  modelName: string;
  colors: PhotoColor[];
}

// Apple iPhone 16 finish-ийн ойролцоо hex (pastel өнгөлбөр).
const HEX: Record<ColorSlug, string> = {
  black: "#2e3033",
  white: "#f4f3ef",
  pink: "#f5cdd0",
  teal: "#b3d4cc",
  ultramarine: "#a9b4dd",
};

const NAME_MN: Record<ColorSlug, string> = {
  black: "Хар",
  white: "Цагаан",
  pink: "Ягаан",
  teal: "Ногоон-цэнхэр",
  ultramarine: "Хөх",
};

/** Тухайн загварын өнгөнүүдийг (бүгд ижил 5 өнгөтэй) бүтээнэ. */
function colorsFor(modelSlug: string, slugs: ColorSlug[]): PhotoColor[] {
  return slugs.map((slug) => ({
    slug,
    nameMn: NAME_MN[slug],
    hex: HEX[slug],
    image: `/photo/${modelSlug}/${slug}.webp`,
  }));
}

const ALL_COLORS: ColorSlug[] = [
  "black",
  "white",
  "pink",
  "teal",
  "ultramarine",
];

/** modelSlug → загвар. Шинэ iPhone нэмэхэд энд бичнэ. */
export const IPHONE_PHOTOS: Record<string, PhotoModel> = {
  "iphone-16": {
    modelSlug: "iphone-16",
    modelName: "iPhone 16",
    colors: colorsFor("iphone-16", ALL_COLORS),
  },
  "iphone-16-plus": {
    modelSlug: "iphone-16-plus",
    modelName: "iPhone 16 Plus",
    colors: colorsFor("iphone-16-plus", ALL_COLORS),
  },
};

// ===================== Туслах функцууд =====================

/** "iPhone 16 Plus" → "iphone-16-plus" */
export function slugifyModel(model: string): string {
  return model
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Монгол/англи өнгөний нэр → canonical slug.
const COLOR_ALIASES: Record<string, ColorSlug> = {
  black: "black",
  хар: "black",
  white: "white",
  цагаан: "white",
  pink: "pink",
  ягаан: "pink",
  teal: "teal",
  "ногоон-цэнхэр": "teal",
  тийл: "teal",
  ногоон: "teal",
  ultramarine: "ultramarine",
  хөх: "ultramarine",
  ультрамарин: "ultramarine",
  цэнхэр: "ultramarine",
};

/** Чөлөөт өнгөний нэрийг canonical slug руу хөрвүүлнэ (танихгүй бол null). */
export function normalizeColor(
  name: string | null | undefined,
): ColorSlug | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return COLOR_ALIASES[key] ?? null;
}

/** Загварын нэр/слагаар manifest-ийн загварыг олно. */
export function getPhotoModel(model: string): PhotoModel | undefined {
  return IPHONE_PHOTOS[slugifyModel(model)];
}

/** Загварт зураг бүхий бүх өнгийг буцаана (manifest-д байхгүй бол хоосон). */
export function getModelColors(model: string): PhotoColor[] {
  return getPhotoModel(model)?.colors ?? [];
}

/** Загвар + өнгөнд харгалзах зургийн зам (олдохгүй бол null). */
export function getColorImage(
  model: string,
  color: string | null | undefined,
): string | null {
  const m = getPhotoModel(model);
  if (!m) return null;
  const slug = normalizeColor(color);
  if (!slug) return null;
  return m.colors.find((c) => c.slug === slug)?.image ?? null;
}

/** Энэ загвар iPhone manifest-д байгаа эсэх. */
export function hasPhotoModel(model: string): boolean {
  return slugifyModel(model) in IPHONE_PHOTOS;
}
