import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Header({ settings }: { settings: Settings }) {
  const name = settings.shop_name || "Сансар гар утас худалдаа";
  const tel = settings.phone?.replace(/[^0-9]/g, "");
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={name}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-bold text-accent-foreground">
              С
            </span>
          )}
          <span className="font-semibold leading-tight">{name}</span>
        </Link>
        {settings.phone && (
          <a
            href={`tel:${tel}`}
            className="rounded-lg border border-accent/40 px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/10"
          >
            📞 {settings.phone}
          </a>
        )}
      </div>
    </header>
  );
}
