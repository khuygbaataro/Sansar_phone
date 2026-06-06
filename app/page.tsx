import { getAvailablePhones, getActivePaymentMethods } from "@/lib/data";
import { Catalog } from "@/components/Catalog";
import { PublicShell } from "@/components/PublicShell";

export default async function Home() {
  const [phones, methods] = await Promise.all([
    getAvailablePhones(),
    getActivePaymentMethods(),
  ]);

  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <section className="py-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Гар утас,{" "}
            <span className="text-glow text-accent">хүүгүй хуваан төлөлт</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Шинэ ба хуучин утас. Storepay, M Credit-ээр сар бүр хүүгүй төлж
            аваарай.
          </p>
        </section>

        <Catalog phones={phones} methods={methods} />
      </div>
    </PublicShell>
  );
}
