import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types";
import { PaymentMethodsManager } from "@/components/admin/PaymentMethodsManager";

export const dynamic = "force-dynamic";

export default async function PaymentMethodsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payment_methods")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-xl font-bold">Төлбөрийн аргууд</h1>
      <p className="mt-1 text-sm text-muted">
        <span className="text-accent">split</span> — хүүгүй хуваан төлөлт (сар
        тооцоолно). <span className="text-accent">loan</span> — цахим зээл (дүн
        тооцохгүй).
      </p>
      <div className="mt-5">
        <PaymentMethodsManager methods={(data ?? []) as PaymentMethod[]} />
      </div>
    </div>
  );
}
