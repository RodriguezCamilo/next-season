'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [email, setEmail] = useState('robertobaradel7@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }
    router.replace(next); // redirige adonde pediste
  };

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="mb-4 text-xl font-semibold">Admin sign-in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border border-border bg-background px-3 py-2"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="email"
          autoComplete="email"
        />
        <input
          className="w-full rounded border border-border bg-background px-3 py-2"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
        />
        <button
          disabled={loading}
          className="rounded bg-[color:var(--accent)] px-3 py-2 text-[color:var(--accent-foreground)] disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
