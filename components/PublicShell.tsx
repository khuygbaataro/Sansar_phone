import { getSettings } from "@/lib/data";
import { Header } from "./Header";
import { Footer } from "./Footer";

// Олон нийтийн хуудсуудын бүрхүүл: дэлгүүрийн толгой + footer.
// (Админ хуудсууд үүнийг ашиглахгүй тул цэвэр админ chrome-той болно.)
export async function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
