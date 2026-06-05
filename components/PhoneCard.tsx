import Link from "next/link";
import type { Phone, PaymentMethod } from "@/lib/types";
import { bestSplitHighlight, formatTugrik } from "@/lib/calc";
import { PhoneImage } from "./PhoneImage";

export function PhoneCard({
  phone,
  methods,
}: {
  phone: Phone;
  methods: PaymentMethod[];
}) {
  const best = bestSplitHighlight(phone.price, methods);
  const isNew = phone.condition === "new";
  return (
    <Link
      href={`/phones/${phone.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/50"
    >
      <div className="relative aspect-square">
        <PhoneImage phone={phone} className="h-full w-full object-cover" />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            isNew
              ? "bg-accent text-accent-foreground"
              : "border border-border bg-surface-2 text-muted"
          }`}
        >
          {isNew ? "Шинэ" : "Хуучин"}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs text-muted">{phone.brand}</p>
        <h3 className="font-semibold leading-tight">{phone.model}</h3>
        <p className="mt-0.5 text-xs text-muted">
          {[phone.storage, phone.color].filter(Boolean).join(" · ")}
        </p>
        <p className="tabular mt-2 text-lg font-bold text-accent">
          {formatTugrik(phone.price)}
        </p>
        {best && (
          <p className="mt-1 text-xs text-muted">
            {best.method.name}-ээр сард{" "}
            <span className="tabular font-medium text-foreground">
              {formatTugrik(best.option.monthly)}
            </span>
            -аас, хүүгүй
          </p>
        )}
      </div>
    </Link>
  );
}
