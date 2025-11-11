// src/lib/supabase/rsc.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function supabaseServerRSC() {
  const cookieStore = await cookies(); // <- await aquí

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        // En RSC no podemos escribir cookies
        setAll() { /* no-op */ }
      }
    }
  );
}
