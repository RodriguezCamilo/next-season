export default function AdSlot({ id }: { id: string }) {
  return (
    <div
      data-ad={id}
      className="flex h-24 w-full items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground"
    >
      Ad slot {id} (placeholder)
    </div>
  );
}
