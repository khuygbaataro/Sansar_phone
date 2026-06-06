"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types";

const field =
  "mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none focus:border-accent";
const label = "text-sm text-muted";

const FIELDS: { key: string; label: string; textarea?: boolean }[] = [
  { key: "shop_name", label: "Дэлгүүрийн нэр" },
  { key: "hours", label: "Цагийн хуваарь" },
  { key: "phone", label: "Утас" },
  { key: "address", label: "Хаяг", textarea: true },
  { key: "facebook_url", label: "Facebook / Messenger линк" },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({
    shop_name: settings.shop_name ?? "",
    hours: settings.hours ?? "",
    phone: settings.phone ?? "",
    address: settings.address ?? "",
    facebook_url: settings.facebook_url ?? "",
    logo_url: settings.logo_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("phones")
      .upload(path, file, { upsert: true });
    if (error) {
      setMsg("Лого ачаалахад алдаа: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("phones").getPublicUrl(path);
    setForm((f) => ({ ...f, logo_url: data.publicUrl }));
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const rows = Object.entries(form).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from("settings")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      setMsg("Алдаа: " + error.message);
      return;
    }
    setMsg("Хадгаллаа ✓");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div>
        <label className={label}>Лого</label>
        <div className="mt-1 flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface-2">
            {form.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logo_url}
                alt="лого"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted">Лого</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onLogo}
            className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-foreground"
          />
        </div>
        {uploading && <p className="mt-1 text-xs text-muted">Ачаалж байна…</p>}
      </div>

      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className={label}>{f.label}</label>
          {f.textarea ? (
            <textarea
              rows={2}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className={field}
            />
          ) : (
            <input
              value={form[f.key] ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className={field}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          disabled={saving || uploading}
          className="rounded-xl bg-accent px-5 py-2 font-medium text-accent-foreground disabled:opacity-60"
        >
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </form>
  );
}
