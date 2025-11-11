'use client';
export default function Error({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Ups, algo salió mal</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}
