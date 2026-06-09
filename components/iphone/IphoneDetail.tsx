"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ModelGroup } from "@/lib/catalog";
import type { PaymentMethod, Phone, PhoneCondition, Settings } from "@/lib/types";
import { normalizeColor } from "@/lib/photos";
import { bestSplitHighlight, formatTugrik } from "@/lib/calc";
import { PaymentSection } from "@/components/PaymentSection";

type ConditionFilter = "all" | PhoneCondition;

export function IphoneDetail({
  group,
  methods,
  settings,
}: {
  group: ModelGroup;
  methods: PaymentMethod[];
  settings: Settings;
}) {
  const firstColor =
    group.colors.find((c) => c.inStock)?.slug ?? group.colors[0]?.slug ?? "";
  const [activeColor, setActiveColor] = useState<string>(firstColor);
  const [condition, setCondition] = useState<ConditionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeColorInfo = group.colors.find((c) => c.slug === activeColor);

  // Сонгосон өнгөний бүх боломжит нэгж (condition харгалзахгүй) — гарчгийн "₮X-аас"-д.
  const colorUnits = useMemo(
    () => group.units.filter((u) => normalizeColor(u.color) === activeColor),
    [group.units, activeColor],
  );

  // Өнгө + төлвөөр шүүсэн, үнээр өсгөсөн жагсаалт.
  const filteredUnits = useMemo(() => {
    return colorUnits
      .filter((u) => condition === "all" || u.condition === condition)
      .sort((a, b) => a.price - b.price);
  }, [colorUnits, condition]);

  const colorMinPrice = colorUnits.length
    ? Math.min(...colorUnits.map((u) => u.price))
    : group.minPrice;

  // Сонгосон нэгж (жагсаалтад байхгүй бол эхнийх).
  const selectedUnit =
    filteredUnits.find((u) => u.id === selectedId) ?? filteredUnits[0] ?? null;

  function pickColor(slug: string, inStock: boolean) {
    if (!inStock) return;
    setActiveColor(slug);
    setSelectedId(null);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {/* ===== Зүүн: hero зураг (Apple маягийн цайвар панель) ===== */}
      <div className="md:sticky md:top-6 md:self-start">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#e9ebef]">
          {group.colors.map((c) => (
            <Image
              key={c.slug}
              src={c.image}
              alt={`${group.modelName} — ${c.nameMn}`}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className={`object-contain p-6 transition-opacity duration-500 ease-out ${
                c.slug === activeColor ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ===== Баруун: мэдээлэл, сонголт ===== */}
      <div>
        <p className="text-sm text-muted">Apple</p>
        <h1 className="text-2xl font-bold sm:text-3xl">{group.modelName}</h1>

        <p className="tabular mt-2 text-muted">
          <span className="text-2xl font-bold text-foreground">
            {formatTugrik(colorMinPrice)}
          </span>
          <span className="text-sm">-аас</span>
        </p>

        {/* Өнгө сонголт */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Өнгө</span>
            <span className="text-sm text-muted">{activeColorInfo?.nameMn}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {group.colors.map((c) => {
              const active = c.slug === activeColor;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => pickColor(c.slug, c.inStock)}
                  disabled={!c.inStock}
                  title={c.inStock ? c.nameMn : `${c.nameMn} — дууссан`}
                  aria-label={c.nameMn}
                  aria-pressed={active}
                  className={`relative grid h-9 w-9 place-items-center rounded-full transition ${
                    active
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "ring-1 ring-border"
                  } ${c.inStock ? "" : "cursor-not-allowed opacity-35"}`}
                >
                  <span
                    className="h-7 w-7 rounded-full ring-1 ring-black/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  {!c.inStock && (
                    <span className="absolute h-px w-9 -rotate-45 bg-muted/70" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Шинэ / Хуучин шүүлтүүр */}
        <div className="mt-6">
          <span className="text-sm font-medium">Нөхцөл</span>
          <div className="mt-2 inline-flex rounded-xl border border-border bg-surface p-0.5">
            {(
              [
                ["all", "Бүгд"],
                ["new", "Шинэ"],
                ["used", "Хуучин"],
              ] as [ConditionFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setCondition(value);
                  setSelectedId(null);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm transition ${
                  condition === value
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Боломжтой нэгжүүд */}
        <div className="mt-6">
          <span className="text-sm font-medium">
            Боломжтой нэгж{" "}
            <span className="text-muted">({filteredUnits.length})</span>
          </span>
          {filteredUnits.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted">
              Энэ өнгө/нөхцөлд одоогоор нэгж алга.
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {filteredUnits.map((u) => (
                <UnitRow
                  key={u.id}
                  unit={u}
                  methods={methods}
                  selected={selectedUnit?.id === u.id}
                  onSelect={() => setSelectedId(u.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Сонгосон нэгж — холбоо барих + төлбөрийн тооцоо */}
        {selectedUnit && (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {group.modelName} · {selectedUnit.storage}
                </p>
                <p className="text-xs text-muted">
                  {activeColorInfo?.nameMn} ·{" "}
                  {selectedUnit.condition === "new" ? "Шинэ" : "Хуучин"}
                  {selectedUnit.condition === "used" &&
                    selectedUnit.battery_health != null &&
                    ` · Батарей ${selectedUnit.battery_health}%`}
                </p>
              </div>
              <p className="text-glow tabular text-xl font-bold text-accent">
                {formatTugrik(selectedUnit.price)}
              </p>
            </div>

            <ContactCta settings={settings} unit={selectedUnit} model={group.modelName} />

            <div className="mt-5 border-t border-border pt-5">
              <PaymentSection price={selectedUnit.price} methods={methods} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Нэг нэгжийн мөр (сонгогддог) ----
function UnitRow({
  unit,
  methods,
  selected,
  onSelect,
}: {
  unit: Phone;
  methods: PaymentMethod[];
  selected: boolean;
  onSelect: () => void;
}) {
  const isNew = unit.condition === "new";
  const best = bestSplitHighlight(unit.price, methods);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
        selected
          ? "border-accent bg-accent/5"
          : "border-border bg-surface hover:border-foreground/30"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{unit.storage}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              isNew
                ? "bg-accent/15 text-accent"
                : "border border-border text-muted"
            }`}
          >
            {isNew ? "Шинэ" : "Хуучин"}
          </span>
          {!isNew && unit.battery_health != null && (
            <span className="text-xs text-muted">
              Батарей {unit.battery_health}%
            </span>
          )}
        </div>
        {best && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {best.method.name}-ээр сард{" "}
            <span className="tabular text-foreground">
              {formatTugrik(best.option.monthly)}
            </span>
            -аас, хүүгүй
          </p>
        )}
      </div>
      <span className="tabular shrink-0 font-bold text-accent">
        {formatTugrik(unit.price)}
      </span>
    </button>
  );
}

// ---- Холбоо барих CTA (Messenger / утас) ----
function ContactCta({
  settings,
  unit,
  model,
}: {
  settings: Settings;
  unit: Phone;
  model: string;
}) {
  const fb = settings.facebook_url?.trim();
  const phone = settings.phone?.trim();
  const condText = unit.condition === "new" ? "шинэ" : "хуучин";
  const note = `Сайн байна уу, ${model} (${unit.storage}, ${condText}) сонирхож байна.`;

  if (fb) {
    return (
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={fb}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-center font-medium text-accent-foreground transition hover:opacity-90"
        >
          Messenger-ээр захиалах
        </a>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="rounded-xl border border-border px-4 py-2.5 text-center font-medium text-foreground transition hover:border-accent"
          >
            {phone}
          </a>
        )}
        <span className="sr-only">{note}</span>
      </div>
    );
  }

  return (
    <a
      href={phone ? `tel:${phone}` : "#"}
      className="mt-4 block rounded-xl bg-accent px-4 py-2.5 text-center font-medium text-accent-foreground transition hover:opacity-90"
    >
      {phone ? `Залгах — ${phone}` : "Холбоо барих"}
    </a>
  );
}
