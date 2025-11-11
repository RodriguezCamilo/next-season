// src/app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="h-8 w-64"><Skeleton className="h-8 w-64" /></div>
          <div className="w-full max-w-xl">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-[var(--radius)] border border-border bg-card p-0"
            >
              <div className="relative">
                <Skeleton className="h-[180px] w-full" />
                <div className="absolute left-3 top-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-2">
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
