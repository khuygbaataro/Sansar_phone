import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Phone } from "@/lib/types";
import { formatTugrik } from "@/lib/calc";
import { PhoneRowActions } from "@/components/admin/PhoneRowActions";

export const dynamic = "force-dynamic";

export default async function AdminPhonesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("phones")
    .select("*")
    .order("created_at", { ascending: false });
  const phones = (data ?? []) as Phone[];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">
          Утаснууд{" "}
          <span className="text-sm font-normal text-muted">
            ({phones.length})
          </span>
        </h1>
        <Link
          href="/admin/phones/new"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          + Утас нэмэх
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400">Алдаа: {error.message}</p>
      )}

      {phones.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted">
          Утас алга байна. <span className="text-accent">«Утас нэмэх»</span>{" "}
          дарж эхэлнэ үү.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Утас</th>
                <th className="px-3 py-2 text-left font-medium">Үнэ</th>
                <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">
                  Төлөв
                </th>
                <th className="px-3 py-2 text-right font-medium">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {phones.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    <div className="font-medium">
                      {p.brand} {p.model}
                    </div>
                    <div className="text-xs text-muted">
                      {[
                        p.storage,
                        p.color,
                        p.condition === "new" ? "Шинэ" : "Хуучин",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </td>
                  <td className="tabular px-3 py-2">{formatTugrik(p.price)}</td>
                  <td className="hidden px-3 py-2 sm:table-cell">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-3 py-2">
                    <PhoneRowActions id={p.id} status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Phone["status"] }) {
  const sold = status === "sold";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${
        sold
          ? "border border-border bg-surface-2 text-muted"
          : "bg-accent/15 text-accent"
      }`}
    >
      {sold ? "Зарагдсан" : "Зарагдаж буй"}
    </span>
  );
}
