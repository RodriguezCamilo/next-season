"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

type Item = { label: string; href: string; meta?: string };

export default function SearchCommand({
  items,
  placeholder = "Buscar juego o serie…",
}: {
  items: Item[];
  placeholder?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const data = useMemo(() => items, [items]);

  return (
    <div className="w-full max-w-xl">
      <Command onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
        <CommandInput placeholder={placeholder} />
        <CommandList
          className={[
            active ? "block" : "hidden",
            "mt-2 rounded-lg border border-border bg-popover"
          ].join(" ")}
        >
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="Resultados">
            {data.map((x) => (
              <CommandItem
                key={x.href}
                value={x.label}
                onSelect={() => router.push(x.href)}
              >
                <span className="flex-1">{x.label}</span>
                {x.meta && (
                  <span className="text-xs text-muted-foreground">{x.meta}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
