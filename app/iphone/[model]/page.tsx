import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAvailablePhones,
  getActivePaymentMethods,
  getSettings,
} from "@/lib/data";
import { getIphoneModel } from "@/lib/catalog";
import { IphoneDetail } from "@/components/iphone/IphoneDetail";
import { PublicShell } from "@/components/PublicShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const phones = await getAvailablePhones();
  const group = getIphoneModel(phones, model);
  return { title: group ? `${group.modelName} — Сансар` : "Олдсонгүй" };
}

export default async function IphoneModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = await params;
  const [phones, methods, settings] = await Promise.all([
    getAvailablePhones(),
    getActivePaymentMethods(),
    getSettings(),
  ]);

  const group = getIphoneModel(phones, model);
  if (!group) notFound();

  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-accent"
        >
          ← Буцах
        </Link>
        <div className="mt-5">
          <IphoneDetail group={group} methods={methods} settings={settings} />
        </div>
      </div>
    </PublicShell>
  );
}
