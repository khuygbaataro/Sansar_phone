import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhoneById, getActivePaymentMethods } from "@/lib/data";
import { PaymentSection } from "@/components/PaymentSection";
import { PhoneImage } from "@/components/PhoneImage";
import { formatTugrik } from "@/lib/calc";

export default async function PhoneDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [phone, methods] = await Promise.all([
    getPhoneById(id),
    getActivePaymentMethods(),
  ]);

  // Зарагдсан эсвэл байхгүй утас → олон нийтэд харагдахгүй
  if (!phone || phone.status !== "available") notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/" className="text-sm text-muted transition hover:text-accent">
        ← Буцах
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
          <PhoneImage phone={phone} className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-sm text-muted">{phone.brand}</p>
          <h1 className="text-2xl font-bold">{phone.model}</h1>

          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {phone.storage && <Tag>{phone.storage}</Tag>}
            {phone.color && <Tag>{phone.color}</Tag>}
            <Tag>{phone.condition === "new" ? "Шинэ" : "Хуучин"}</Tag>
          </div>

          <p className="text-glow tabular mt-4 text-3xl font-bold text-accent">
            {formatTugrik(phone.price)}
          </p>

          {phone.description && (
            <p className="mt-3 text-sm text-muted">{phone.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <PaymentSection price={phone.price} methods={methods} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-muted">
      {children}
    </span>
  );
}
