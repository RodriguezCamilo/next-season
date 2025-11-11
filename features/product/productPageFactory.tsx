import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabaseServer } from "@/lib/supabase";
import CountdownTimer from "@/components/countdown-timer";

type Locale = "es" | "en";
type Category = "game" | "show" | "anime" | "esport";

export function productPageFactory(category: Category) {
  // ---- generateMetadata
  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale; slug: string }>;
  }): Promise<Metadata> {
    const { locale, slug } = await params;
    const sb = supabaseServer();
    const { data: product } = await sb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("category", category)
      .single();

    if (!product) return { title: "Next Season" };

    const title = `${product.title} — ${category.toUpperCase()}`;
    const desc =
      locale === "en"
        ? `Countdowns and release tracker for ${product.title}.`
        : `Cuenta regresiva y próximos lanzamientos de ${product.title}.`;

    return {
      title,
      description: desc,
      alternates: {
        canonical: `/${locale}/${category}/${product.slug}`,
        languages: {
          en: `/en/${category}/${product.slug}`,
          es: `/es/${category}/${product.slug}`,
        },
      },
      openGraph: {
        title,
        description: desc,
        images: [{ url: product.cover_url ?? "/og-default.png" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: [product.cover_url ?? "/og-default.png"],
      },
    };
  }

  // ---- Page
  async function Page({
    params,
  }: {
    params: Promise<{ locale: Locale; slug: string }>;
  }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "home" });
    const sb = supabaseServer();

    const { data: product } = await sb
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("category", category)
      .single();

    if (!product) {
      return (
        <div className="mx-auto max-w-4xl p-6">
          <h1 className="text-xl font-semibold">
            {locale === "en" ? "Not found" : "No encontrado"}
          </h1>
        </div>
      );
    }

    const { data: seasons } = await sb
      .from("seasons")
      .select("*")
      .eq("product_id", product.id)
      .order("release_at", { ascending: true, nullsFirst: true });

    const now = Date.now();
    const upcoming =
      seasons?.find(
        (s) => !s.release_at || new Date(s.release_at as string).getTime() > now
      ) ?? null;
    const past = (seasons ?? [])
      .filter((s) => s.id !== upcoming?.id)
      .sort(
        (a, b) =>
          new Date(b.release_at ?? 0).getTime() -
          new Date(a.release_at ?? 0).getTime()
      );

    const fmt = (iso?: string | null) =>
      iso
        ? new Date(iso).toLocaleString(locale, {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : locale === "en"
        ? "To be announced"
        : "Por confirmar";

    const statusLabel = (s?: "confirmed" | "estimated" | "delayed" | null) =>
      !s
        ? ""
        : locale === "en"
        ? s === "confirmed"
          ? "Confirmed"
          : s === "estimated"
          ? "Estimated"
          : "Delayed"
        : s === "confirmed"
        ? "Confirmado"
        : s === "estimated"
        ? "Estimado"
        : "Aplazado";

    const icsHref = upcoming?.release_at
      ? `/api/ics?title=${encodeURIComponent(
          `${product.title} — ${upcoming.label}`
        )}&date=${encodeURIComponent(
          upcoming.release_at
        )}&url=${encodeURIComponent(product.official_url ?? "")}`
      : null;

    return (
      <article className="mx-auto max-w-5xl p-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-card">
          {product.cover_url && (
            <Image
              src={product.cover_url}
              alt={`${product.title} cover`}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <header className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {category}
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
              {product.title}
            </h1>
            {product.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.official_url && (
              <a
                href={product.official_url}
                target="_blank"
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent/10"
              >
                {locale === "en" ? "Official site" : "Sitio oficial"}
              </a>
            )}
            {product.source_url && (
              <a
                href={product.source_url}
                target="_blank"
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent/10"
              >
                {(locale === "en" ? "Source" : "Fuente") +
                  (product.source_name ? `: ${product.source_name}` : "")}
              </a>
            )}
          </div>
        </header>

        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {locale === "en" ? "Next season" : "Próxima temporada"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {upcoming?.label ??
                  (locale === "en" ? "To be announced" : "Por confirmar")}
                {upcoming?.status ? ` • ${statusLabel(upcoming.status)}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {upcoming?.release_at ? (
                <CountdownTimer dateIso={upcoming.release_at} />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {locale === "en" ? "TBA" : "Por confirmar"}
                </span>
              )}
              {icsHref && (
                <a
                  href={icsHref}
                  className="rounded-full bg-[color:var(--accent)] px-3 py-1.5 text-sm text-[color:var(--accent-foreground)] hover:opacity-90"
                >
                  {locale === "en"
                    ? "Add to calendar"
                    : "Agregar al calendario"}
                </a>
              )}
            </div>
          </div>
        </section>

        {past.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 text-base font-semibold">
              {locale === "en" ? "All seasons" : "Todas las temporadas"}
            </h3>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {past.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {statusLabel(s.status)} • {fmt(s.release_at)}
                    </p>
                  </div>
                  {s.source_url && (
                    <a
                      href={s.source_url}
                      target="_blank"
                      className="text-xs underline decoration-dotted underline-offset-4 text-muted-foreground hover:text-foreground"
                    >
                      {(locale === "en" ? "Source" : "Fuente") +
                        (s.source_name ? `: ${s.source_name}` : "")}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="mt-10 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {locale === "en" ? "Back to home" : "Volver al inicio"}
          </Link>
        </nav>
      </article>
    );
  }

  return { Page, generateMetadata };
}
