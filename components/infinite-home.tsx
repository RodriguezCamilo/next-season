// components/infinite-home.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { SeasonCard } from "@/components/season-card";
import AdSlot from "@/components/ad-slot";
import type { Item } from "@/app/api/upcoming/route";

type Props = {
  initialItems: Item[];
  locale: "es" | "en";
  categoryParam?: "games" | "shows" | "anime" | "esports";
};

export default function InfiniteHome({ initialItems, locale, categoryParam }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // si cambia la categoría, resetea (por navegación con tabs)
    setItems(initialItems);
    setEnd(false);
  }, [initialItems]);

  useEffect(() => {
    if (!loaderRef.current || end) return;

    const io = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || loading) return;
      setLoading(true);

      const from = items.length;
      const url = `/api/upcoming?from=${from}${categoryParam ? `&c=${categoryParam}` : ""}`;

      const res = await fetch(url, { cache: "no-store" });
      const more: Item[] = await res.json();

      if (more.length === 0) setEnd(true);
      setItems((prev) => [...prev, ...more]);
      setLoading(false);
    }, { threshold: 1 });

    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [items.length, loading, categoryParam, end]);

  return (
    <>
      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x, i) => (
          <Fragment key={`${x.key}-${i}`}>
            <div>
              <SeasonCard data={x as any} locale={locale} />
            </div>
            {i % 6 === 5 && (
              <div className="col-span-full">
                <div className="sm:hidden">
                  <AdSlot id={`home-${i}`} size="rect" />
                </div>
                <div className="hidden sm:block">
                  <AdSlot id={`home-${i}-banner`} size="banner" />
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </section>

      <div ref={loaderRef} className="flex justify-center py-10">
        {!end ? (
          <span className="text-sm text-muted-foreground">
            {loading ? (locale === "en" ? "Loading…" : "Cargando…") : (locale === "en" ? "Scroll to load more" : "Deslizá para cargar más")}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            {locale === "en" ? "No more results" : "No hay más resultados"}
          </span>
        )}
      </div>
    </>
  );
}
