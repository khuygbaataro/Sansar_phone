import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Phone } from "@/lib/types";
import { PhoneForm } from "@/components/admin/PhoneForm";

export const dynamic = "force-dynamic";

export default async function EditPhonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("phones")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted hover:text-accent">
        ← Утаснууд
      </Link>
      <h1 className="mt-2 text-xl font-bold">Утас засах</h1>
      <div className="mt-5">
        <PhoneForm phone={data as Phone} />
      </div>
    </div>
  );
}
