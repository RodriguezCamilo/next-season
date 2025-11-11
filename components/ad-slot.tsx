export default function AdSlot({
  id,
  size = "banner", // 'banner' | 'rect' | 'skyscraper'
  className = "",
}: {
  id: string;
  size?: "banner" | "rect" | "skyscraper";
  className?: string;
}) {
  const sizes = {
    banner: "h-24",        // ~728x90 / 970x90
    rect: "h-40",          // ~300x250 / 336x280
    skyscraper: "h-[600px]"// ~300x600
  } as const;

  return (
    <div
      data-ad={id}
      className={[
        "flex w-full items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground",
        sizes[size],
        className
      ].join(" ")}
    >
      Ad slot {id} ({size})
    </div>
  );
}
