"use client";

import { useMemo, useState } from "react";
import type { Phone, PaymentMethod } from "@/lib/types";
import { PhoneCard } from "./PhoneCard";

export function Catalog({
  phones,
  methods,
}: {
  phones: Phone[];
  methods: PaymentMethod[];
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");

  const brands = useMemo(
    () => Array.from(new Set(phones.map((p) => p.brand))).sort(),
    [phones],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return phones.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (!needle) return true;
      return `${p.brand} ${p.model} ${p.storage ?? ""} ${p.color ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [phones, query, brand]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Хайх — загвар, өнгө, багтаамж…"
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none transition focus:border-accent"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip active={brand === ""} onClick={() => setBrand("")}>
          Бүгд
        </FilterChip>
        {brands.map((b) => (
          <FilterChip key={b} active={brand === b} onClick={() => setBrand(b)}>
            {b}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted">Илэрц олдсонгүй.</p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <PhoneCard key={p.id} phone={p} methods={methods} />
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">{filtered.length} утас</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
