"use client";

import { useState } from "react";
import type { PaymentMethod } from "@/lib/types";
import { computeSplitOptions, formatTugrik } from "@/lib/calc";

/** split (хүүгүй) аппуудын интерактив хуваан төлөлт. */
export function SplitCalculator({
  price,
  methods,
}: {
  price: number;
  methods: PaymentMethod[];
}) {
  const plans = methods
    .filter((m) => m.type === "split")
    .map((m) => ({ method: m, options: computeSplitOptions(price, m) }))
    .filter((p) => p.options.length > 0);

  if (plans.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">Хүүгүй хуваан төлөлт</h2>
      {plans.map(({ method }) => (
        <SplitMethodCard key={method.id} method={method} price={price} />
      ))}
    </section>
  );
}

function SplitMethodCard({
  method,
  price,
}: {
  method: PaymentMethod;
  price: number;
}) {
  const options = computeSplitOptions(price, method);
  const [months, setMonths] = useState(options[options.length - 1].months);
  const current = options.find((o) => o.months === months) ?? options[0];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{method.name}</span>
        <span className="rounded-full border border-accent/40 px-2 py-0.5 text-xs text-accent">
          хүүгүй
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.months}
            onClick={() => setMonths(o.months)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              o.months === months
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {o.months} сар
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted">
        Сард{" "}
        <span className="tabular text-xl font-bold text-foreground">
          {formatTugrik(current.monthly)}
        </span>{" "}
        × {current.months} сар
      </p>
      <p className="text-sm text-muted">
        Нийт ={" "}
        <span className="tabular font-medium text-foreground">
          {formatTugrik(current.total)}
        </span>{" "}
        <span className="text-accent">(хүүгүй)</span>
      </p>
      {method.min_amount != null && (
        <p className="mt-1 text-xs text-muted">
          * {formatTugrik(method.min_amount)}-аас дээш дүнд боломжтой.
        </p>
      )}
    </div>
  );
}
