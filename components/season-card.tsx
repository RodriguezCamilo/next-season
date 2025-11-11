import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/countdown-timer";
import type { SeasonCardData } from "@/lib/types";

export function SeasonCard({
  data,
  locale,
}: {
  data: SeasonCardData & { category: "game" | "show" | "anime" | "esport" };
  locale?: "es" | "en";
}) {
  // Página por producto (sin season en la URL)
  const href = `/${locale ?? "es"}/${data.category}/${data.itemSlug}`;

  const detailsLabel = locale === "en" ? "Details" : "Detalles";
  const tStatus = (s?: "confirmed" | "estimated" | "delayed") =>
    !s ? null :
    locale === "en" ? (s === "confirmed" ? "Confirmed" : s === "estimated" ? "Estimated" : "Delayed")
                    : (s === "confirmed" ? "Confirmado" : s === "estimated" ? "Estimado" : "Aplazado");

  return (
    <article className="group overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,.35)]">
      {data.coverUrl && (
        <div className="relative aspect-[16/9]">
          <Image
            src={data.coverUrl}
            alt={`${data.title} cover`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {data.status && <StatusPill status={data.status} label={tStatus(data.status)!} />}
        </div>
      )}

      <div className="p-4">
        <h3 className="text-base md:text-lg font-semibold">{data.title}</h3>
        {data.label && <p className="text-sm text-muted-foreground mt-0.5">{data.label}</p>}

        <div className="mt-3">
          {data.dateIso ? (
            <CountdownTimer dateIso={data.dateIso} />
          ) : (
            <span className="text-sm text-muted-foreground">
              {locale === "en" ? "To be announced" : "Por confirmar"}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {data.sourceUrl && (
            <a
              href={data.sourceUrl}
              target="_blank"
              className="text-xs underline decoration-dotted underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              {(locale === "en" ? "Source" : "Fuente") +
                (data.sourceName ? `: ${data.sourceName}` : "")}
            </a>
          )}
          <Link
            href={href}
            className="inline-flex items-center rounded-full px-3 py-1.5 text-sm bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90 transition"
          >
            {detailsLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function StatusPill({
  status,
  label,
}: {
  status: "confirmed" | "estimated" | "delayed";
  label: string;
}) {
  const cls =
    status === "confirmed"
      ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
      : status === "estimated"
      ? "bg-[color:var(--warning)] text-black"
      : "bg-[color:var(--destructive)] text-black";

  return (
    <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium shadow ${cls}`}>
      {label}
    </span>
  );
}
