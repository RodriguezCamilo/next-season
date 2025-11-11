// src/lib/auth.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
// import type { Database } from './types_db' // opcional

export async function requireAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // En Server Components solo leemos cookies;
        // en Route Handlers / Server Actions podés implementar set/remove reales.
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          /* no-op en RSC */
        },
        remove() {
          /* no-op en RSC */
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, redirectTo: '/auth' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin,email')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return { ok: false as const, redirectTo: '/auth' };

  return { ok: true as const, supabase, user, profile };
}
