"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PhoneRowActions({
  id,
  status,
}: {
  id: string;
  status: "available" | "sold";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const supabase = createClient();
    const next = status === "available" ? "sold" : "available";
    await supabase.from("phones").update({ status: next }).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Энэ утсыг бүрмөсөн устгах уу?")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("phones").delete().eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/admin/phones/${id}`}
        className="rounded-lg border border-border px-2.5 py-1 text-xs transition hover:border-accent hover:text-accent"
      >
        Засах
      </Link>
      <button
        onClick={toggle}
        disabled={busy}
        className="rounded-lg border border-border px-2.5 py-1 text-xs transition hover:text-foreground disabled:opacity-50"
      >
        {status === "available" ? "Зарагдсан" : "Сэргээх"}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-border px-2.5 py-1 text-xs text-red-400 transition hover:border-red-400 disabled:opacity-50"
      >
        Устгах
      </button>
    </div>
  );
}
