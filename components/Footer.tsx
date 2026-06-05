import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  const name = settings.shop_name || "Сансар гар утас худалдаа";
  const fb = settings.facebook_url?.trim();
  const tel = settings.phone?.replace(/[^0-9]/g, "");
  return (
    <footer id="contact" className="mt-16 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          {settings.hours && (
            <p className="mt-2 text-sm text-muted">🕒 {settings.hours}</p>
          )}
        </div>
        <div className="space-y-2 text-sm">
          {settings.phone && (
            <p>
              📞{" "}
              <a className="hover:text-accent" href={`tel:${tel}`}>
                {settings.phone}
              </a>
            </p>
          )}
          {settings.address && <p className="text-muted">📍 {settings.address}</p>}
          {fb && (
            <p>
              💬{" "}
              <a
                className="text-accent hover:underline"
                href={fb}
                target="_blank"
                rel="noreferrer"
              >
                Facebook / Messenger
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {name}
      </div>
    </footer>
  );
}
