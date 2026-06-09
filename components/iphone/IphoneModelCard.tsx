import Link from "next/link";
import Image from "next/image";
import type { ModelGroup } from "@/lib/catalog";
import { formatTugrik } from "@/lib/calc";

// Apple маягийн загварын карт — каталогт нэг загвар = нэг карт.
// Цэвэр цайвар панель дээр hero зураг, "₮X-аас", өнгөний цэгүүд, Шинэ/Хуучин badge.
export function IphoneModelCard({ group }: { group: ModelGroup }) {
  const inStockColors = group.colors.filter((c) => c.inStock);

  return (
    <Link
      href={`/iphone/${group.modelSlug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/50"
    >
      <div className="relative aspect-square bg-gradient-to-b from-white to-[#eceef1]">
        {group.heroImage && (
          <Image
            src={group.heroImage}
            alt={group.modelName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          {group.hasNew && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
              Шинэ
            </span>
          )}
          {group.hasUsed && (
            <span className="rounded-full border border-black/10 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-black/70 backdrop-blur">
              Хуучин
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-semibold leading-tight">{group.modelName}</h3>

        {/* өнгөний цэгүүд */}
        <div className="mt-1.5 flex gap-1.5">
          {inStockColors.map((c) => (
            <span
              key={c.slug}
              title={c.nameMn}
              className="h-3 w-3 rounded-full ring-1 ring-black/15"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <p className="tabular mt-2 text-[13px] text-muted">
          <span className="text-base font-bold text-foreground">
            {formatTugrik(group.minPrice)}
          </span>
          -аас
        </p>
      </div>
    </Link>
  );
}
