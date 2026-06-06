"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Phone } from "@/lib/types";

const field =
  "mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none focus:border-accent";
const label = "text-sm text-muted";

export function PhoneForm({ phone }: { phone?: Phone }) {
  const router = useRouter();
  const [form, setForm] = useState({
    brand: phone?.brand ?? "",
    model: phone?.model ?? "",
    storage: phone?.storage ?? "",
    color: phone?.color ?? "",
    condition: phone?.condition ?? "new",
    price: phone?.price != null ? String(phone.price) : "",
    description: phone?.description ?? "",
    status: phone?.status ?? "available",
    image_url: phone?.image_url ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("phones")
      .upload(path, file);
    if (upErr) {
      setError("Зураг ачаалахад алдаа: " + upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("phones").getPublicUrl(path);
    set("image_url", data.publicUrl);
    setUploading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      storage: form.storage.trim() || null,
      color: form.color.trim() || null,
      condition: form.condition,
      price: parseInt(form.price, 10) || 0,
      description: form.description.trim() || null,
      status: form.status,
      image_url: form.image_url || null,
    };
    const res = phone
      ? await supabase.from("phones").update(payload).eq("id", phone.id)
      : await supabase.from("phones").insert(payload);
    if (res.error) {
      setError("Хадгалахад алдаа: " + res.error.message);
      setSaving(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Брэнд *</label>
          <input
            required
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="Apple"
            className={field}
          />
        </div>
        <div>
          <label className={label}>Загвар *</label>
          <input
            required
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="iPhone 15 Pro"
            className={field}
          />
        </div>
        <div>
          <label className={label}>Багтаамж</label>
          <input
            value={form.storage}
            onChange={(e) => set("storage", e.target.value)}
            placeholder="256GB"
            className={field}
          />
        </div>
        <div>
          <label className={label}>Өнгө</label>
          <input
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Хар"
            className={field}
          />
        </div>
        <div>
          <label className={label}>Нөхцөл</label>
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value as "new" | "used")}
            className={field}
          >
            <option value="new">Шинэ</option>
            <option value="used">Хуучин</option>
          </select>
        </div>
        <div>
          <label className={label}>Үнэ (₮) *</label>
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="1890000"
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label}>Тайлбар</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={field}
        />
      </div>

      <div>
        <label className={label}>Зураг</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface-2">
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted">Зураггүй</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-foreground"
          />
        </div>
        {uploading && <p className="mt-1 text-xs text-muted">Ачаалж байна…</p>}
      </div>

      {phone && (
        <div className="max-w-xs">
          <label className={label}>Төлөв</label>
          <select
            value={form.status}
            onChange={(e) =>
              set("status", e.target.value as "available" | "sold")
            }
            className={field}
          >
            <option value="available">Зарагдаж буй</option>
            <option value="sold">Зарагдсан</option>
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={saving || uploading}
          className="rounded-xl bg-accent px-5 py-2 font-medium text-accent-foreground transition disabled:opacity-60"
        >
          {saving ? "Хадгалж байна…" : phone ? "Хадгалах" : "Нэмэх"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-border px-5 py-2 text-muted transition hover:text-foreground"
        >
          Болих
        </button>
      </div>
    </form>
  );
}
