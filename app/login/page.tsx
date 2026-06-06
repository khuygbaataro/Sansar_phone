"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Имэйл эсвэл нууц үг буруу байна.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="text-center">
          <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-accent text-xl font-bold text-accent-foreground">
            С
          </span>
          <h1 className="mt-3 text-lg font-semibold">Админ нэвтрэх</h1>
          <p className="text-sm text-muted">Сансар гар утас худалдаа</p>
        </div>

        <div>
          <label className="text-sm text-muted">Имэйл</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="text-sm text-muted">Нууц үг</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-accent py-2 font-medium text-accent-foreground transition disabled:opacity-60"
        >
          {loading ? "Нэвтэрч байна…" : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
