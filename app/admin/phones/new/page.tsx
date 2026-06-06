import Link from "next/link";
import { PhoneForm } from "@/components/admin/PhoneForm";

export default function NewPhonePage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-muted hover:text-accent">
        ← Утаснууд
      </Link>
      <h1 className="mt-2 text-xl font-bold">Шинэ утас нэмэх</h1>
      <div className="mt-5">
        <PhoneForm />
      </div>
    </div>
  );
}
