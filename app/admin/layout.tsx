import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/data";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabase тохируулаагүй бол админ идэвхгүй
  if (!hasSupabase) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-semibold">
              Сансар · Админ
            </Link>
            <nav className="hidden gap-1 text-sm sm:flex">
              <NavLink href="/admin">Утаснууд</NavLink>
              <NavLink href="/admin/payment-methods">Төлбөр</NavLink>
              <NavLink href="/admin/settings">Тохиргоо</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted transition hover:text-accent"
            >
              Вэб ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="flex gap-1 px-4 pb-2 text-sm sm:hidden">
          <NavLink href="/admin">Утаснууд</NavLink>
          <NavLink href="/admin/payment-methods">Төлбөр</NavLink>
          <NavLink href="/admin/settings">Тохиргоо</NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 text-muted transition hover:bg-surface-2 hover:text-foreground"
    >
      {children}
    </Link>
  );
}
