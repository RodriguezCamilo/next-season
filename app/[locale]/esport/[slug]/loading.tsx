import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <Skeleton className="h-[240px] w-full" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
