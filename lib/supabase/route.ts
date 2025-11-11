import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function supabaseServerRoute() {
  const cookieStore = await cookies(); // <- await aquí

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set({ name, value, ...options });
          }
        }
      }
    }
  );
}
