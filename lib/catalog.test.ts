import { describe, it, expect } from "vitest";
import {
  isIphone,
  hasIphoneShowcase,
  groupIphoneModels,
  getIphoneModel,
} from "./catalog";
import type { Phone } from "./types";

function p(over: Partial<Phone>): Phone {
  return {
    id: Math.random().toString(36).slice(2),
    brand: "Apple",
    model: "iPhone 16",
    storage: "128GB",
    color: "Хар",
    condition: "new",
    battery_health: null,
    price: 2990000,
    image_url: null,
    description: null,
    status: "available",
    created_at: "2026-06-08T10:00:00Z",
    ...over,
  };
}

describe("isIphone / hasIphoneShowcase", () => {
  it("identifies iPhones", () => {
    expect(isIphone(p({ model: "iPhone 16" }))).toBe(true);
    expect(isIphone(p({ brand: "Samsung", model: "Galaxy S24" }))).toBe(false);
  });

  it("showcase requires a manifest model (зурагтай)", () => {
    expect(hasIphoneShowcase(p({ model: "iPhone 16" }))).toBe(true);
    expect(hasIphoneShowcase(p({ model: "iPhone 16 Plus" }))).toBe(true);
    // iPhone боловч manifest-д зураггүй → showcase биш
    expect(hasIphoneShowcase(p({ model: "iPhone 15 Pro" }))).toBe(false);
  });
});

describe("groupIphoneModels", () => {
  const phones: Phone[] = [
    p({ model: "iPhone 16", color: "Хар", condition: "new", price: 2990000 }),
    p({ model: "iPhone 16", color: "Хар", condition: "used", battery_health: 84, price: 2450000 }),
    p({ model: "iPhone 16", color: "Цагаан", condition: "new", price: 3290000 }),
    p({ model: "iPhone 16 Plus", color: "Хөх", condition: "new", price: 3490000 }),
    // available биш — орохгүй
    p({ model: "iPhone 16", color: "Ягаан", status: "sold", price: 100000 }),
    // showcase биш — орохгүй
    p({ model: "iPhone 15 Pro", price: 5200000 }),
    p({ brand: "Samsung", model: "Galaxy S24", price: 3400000 }),
  ];

  it("groups available showcase iPhones by model", () => {
    const groups = groupIphoneModels(phones);
    expect(groups.map((g) => g.modelSlug)).toEqual([
      "iphone-16",
      "iphone-16-plus",
    ]);
  });

  it("computes minPrice from available units only (sold-ийг тооцохгүй)", () => {
    const g = getIphoneModel(phones, "iphone-16")!;
    expect(g.minPrice).toBe(2450000); // 100000 (sold) тооцоонд орохгүй
    expect(g.units).toHaveLength(3);
  });

  it("flags new/used correctly", () => {
    const g = getIphoneModel(phones, "iphone-16")!;
    expect(g.hasNew).toBe(true);
    expect(g.hasUsed).toBe(true);
    const plus = getIphoneModel(phones, "iphone-16-plus")!;
    expect(plus.hasNew).toBe(true);
    expect(plus.hasUsed).toBe(false);
  });

  it("marks color inStock by availability and keeps all manifest colors", () => {
    const g = getIphoneModel(phones, "iphone-16")!;
    expect(g.colors).toHaveLength(5); // black, white, pink, teal, ultramarine
    const bySlug = Object.fromEntries(g.colors.map((c) => [c.slug, c.inStock]));
    expect(bySlug.black).toBe(true);
    expect(bySlug.white).toBe(true);
    expect(bySlug.pink).toBe(false); // зөвхөн sold байсан → нөөцгүй
    expect(bySlug.teal).toBe(false);
    // heroImage = эхний боломжтой өнгөний зураг
    expect(g.heroImage).toBe("/photo/iphone-16/black.webp");
  });

  it("returns null for unknown model slug", () => {
    expect(getIphoneModel(phones, "iphone-99")).toBeNull();
  });
});
