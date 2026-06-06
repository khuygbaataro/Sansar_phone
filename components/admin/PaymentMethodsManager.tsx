"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PaymentMethod, PaymentType } from "@/lib/types";

const field =
  "mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent";
const label = "text-xs text-muted";

export function PaymentMethodsManager({
  methods,
}: {
  methods: PaymentMethod[];
}) {
  const nextSort =
    methods.reduce((max, m) => Math.max(max, m.sort_order), 0) + 1;

  return (
    <div className="space-y-4">
      {methods.map((m) => (
        <MethodCard key={m.id} method={m} />
      ))}
      <AddMethod nextSort={nextSort} />
    </div>
  );
}

function MethodCard({ method }: { method: PaymentMethod }) {
  const router = useRouter();
  const [m, setM] = useState({
    name: method.name,
    type: method.type as PaymentType,
    max_installments: method.max_installments?.toString() ?? "",
    min_amount: method.min_amount?.toString() ?? "",
    note: method.note ?? "",
    is_active: method.is_active,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("payment_methods")
      .update({
        name: m.name.trim(),
        type: m.type,
        max_installments:
          m.type === "split" && m.max_installments
            ? parseInt(m.max_installments, 10)
            : null,
        min_amount: m.min_amount ? parseInt(m.min_amount, 10) : null,
        note: m.note.trim() || null,
        is_active: m.is_active,
      })
      .eq("id", method.id);
    setSaving(false);
    if (error) {
      setMsg("Алдаа: " + error.message);
      return;
    }
    setMsg("Хадгаллаа ✓");
    router.refresh();
  }

  async function remove() {
    if (!confirm(`"${method.name}"-г устгах уу?`)) return;
    const supabase = createClient();
    await supabase.from("payment_methods").delete().eq("id", method.id);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Нэр</label>
          <input
            value={m.name}
            onChange={(e) => setM({ ...m, name: e.target.value })}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Төрөл</label>
          <select
            value={m.type}
            onChange={(e) => setM({ ...m, type: e.target.value as PaymentType })}
            className={field}
          >
            <option value="split">split — хүүгүй хуваан төлөлт</option>
            <option value="loan">loan — цахим зээл</option>
          </select>
        </div>
        {m.type === "split" && (
          <div>
            <label className={label}>Хамгийн их хуваалт (сар)</label>
            <input
              type="number"
              min="2"
              value={m.max_installments}
              onChange={(e) =>
                setM({ ...m, max_installments: e.target.value })
              }
              placeholder="6"
              className={field}
            />
          </div>
        )}
        <div>
          <label className={label}>Доод дүн (₮, заавал биш)</label>
          <input
            type="number"
            min="0"
            value={m.min_amount}
            onChange={(e) => setM({ ...m, min_amount: e.target.value })}
            placeholder="100000"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Тэмдэглэл</label>
          <input
            value={m.note}
            onChange={(e) => setM({ ...m, note: e.target.value })}
            className={field}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={m.is_active}
            onChange={(e) => setM({ ...m, is_active: e.target.checked })}
            className="accent-[var(--accent)]"
          />
          Идэвхтэй
        </label>
        <div className="flex items-center gap-2">
          {msg && <span className="text-xs text-muted">{msg}</span>}
          <button
            onClick={remove}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-400 hover:border-red-400"
          >
            Устгах
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-60"
          >
            {saving ? "…" : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddMethod({ nextSort }: { nextSort: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [m, setM] = useState({
    name: "",
    type: "split" as PaymentType,
    max_installments: "",
    min_amount: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (!m.name.trim()) {
      setError("Нэр оруулна уу.");
      return;
    }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("payment_methods").insert({
      name: m.name.trim(),
      type: m.type,
      max_installments:
        m.type === "split" && m.max_installments
          ? parseInt(m.max_installments, 10)
          : null,
      min_amount: m.min_amount ? parseInt(m.min_amount, 10) : null,
      note: m.note.trim() || null,
      sort_order: nextSort,
      is_active: true,
    });
    setSaving(false);
    if (error) {
      setError("Алдаа: " + error.message);
      return;
    }
    setOpen(false);
    setM({ name: "", type: "split", max_installments: "", min_amount: "", note: "" });
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-border py-3 text-sm text-muted hover:border-accent hover:text-accent"
      >
        + Шинэ апп нэмэх
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/40 bg-surface p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Нэр</label>
          <input
            value={m.name}
            onChange={(e) => setM({ ...m, name: e.target.value })}
            placeholder="Storepay"
            className={field}
          />
        </div>
        <div>
          <label className={label}>Төрөл</label>
          <select
            value={m.type}
            onChange={(e) => setM({ ...m, type: e.target.value as PaymentType })}
            className={field}
          >
            <option value="split">split — хүүгүй хуваан төлөлт</option>
            <option value="loan">loan — цахим зээл</option>
          </select>
        </div>
        {m.type === "split" && (
          <div>
            <label className={label}>Хамгийн их хуваалт (сар)</label>
            <input
              type="number"
              min="2"
              value={m.max_installments}
              onChange={(e) =>
                setM({ ...m, max_installments: e.target.value })
              }
              placeholder="6"
              className={field}
            />
          </div>
        )}
        <div>
          <label className={label}>Доод дүн (₮, заавал биш)</label>
          <input
            type="number"
            min="0"
            value={m.min_amount}
            onChange={(e) => setM({ ...m, min_amount: e.target.value })}
            placeholder="100000"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Тэмдэглэл</label>
          <input
            value={m.note}
            onChange={(e) => setM({ ...m, note: e.target.value })}
            className={field}
          />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted"
        >
          Болих
        </button>
        <button
          onClick={add}
          disabled={saving}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-60"
        >
          {saving ? "…" : "Нэмэх"}
        </button>
      </div>
    </div>
  );
}
