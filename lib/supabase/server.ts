// Supabase сервер client — Server Component, Route Handler, Server Action дотор.
// Хэрэглэгчийн session-г cookie-оор уншина (нэвтэрсэн админ → RLS authenticated эрх).

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component-аас дуудвал set хийж болохгүй — middleware session-г
            // сэргээдэг тул энэ нь аюулгүй.
          }
        },
      },
    },
  );
}
