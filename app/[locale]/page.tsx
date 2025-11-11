import { getTranslations, setRequestLocale } from "next-intl/server";
import { supabaseServer } from "@/lib/supabase";
import { SeasonCard } from "@/components/season-card";
import SearchCommand from "@/components/search-command";

export const revalidate = 300;
type C = "games" | "shows" | "anime" | "esports";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
    languages: { en: "/en", es: "/es" },
  },
  title: "Next Season",
  description: "Track next seasons for games, shows, anime & esports.",
};

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: "es" | "en" }>;
  searchParams?: Promise<{ c?: C }>;
}) {
  const { locale } = await params;
  const { c } = (await searchParams) ?? {};
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const sb = supabaseServer();

  // UI -> BD
  const map: Record<C, "game" | "show" | "anime" | "esport"> = {
    games: "game",
    shows: "show",
    anime: "anime",
    esports: "esport",
  };

  let query = sb.from("v_upcoming").select("*").limit(24);
  if (c) query = query.eq("category", map[c]);
  const { data: rows } = await query;

  const items = (rows ?? []).map((r) => ({
    key: r.product_id ?? r.product_slug, // para React key
    title: r.title as string,
    label: r.season_label as string | null,
    category: r.category as "game" | "show" | "anime" | "esport",
    itemSlug: r.product_slug as string,
    seasonSlug: (r.season_slug as string) ?? null,
    coverUrl: (r.cover_url as string) ?? null,
    dateIso: (r.release_at as string) ?? null,
    status: r.status as "confirmed" | "estimated" | "delayed" | null,
    sourceName: (r.source_name as string) ?? null,
    sourceUrl: (r.source_url as string) ?? null,
  }));

  const searchList = (rows ?? []).map((r) => ({
    label: r.season_label ? `${r.title} • ${r.season_label}` : `${r.title}`,
    href: `/${locale}/${r.category}/${r.product_slug}`, // página por producto
    meta: r.category as string,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {(["games", "shows", "anime", "esports"] as const).map((tab) => {
              const active = c === tab || (!c && tab === "games"); // define tu default
              return (
                <a
                  key={tab}
                  href={`/${locale}/?c=${tab}`}
                  className={[
                    "rounded-full px-3 py-1 text-sm border transition",
                    active
                      ? "bg-accent text-[color:var(--accent-foreground)] border-accent"
                      : "hover:bg-accent/10",
                  ].join(" ")}
                >
                  {t(`tabs.${tab}`)}
                </a>
              );
            })}
          </div>
          <SearchCommand
            items={searchList}
            placeholder={t("searchPlaceholder")}
          />
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <SeasonCard key={x.key as string} data={x as any} locale={locale} />
          ))}
        </section>
      </main>
    </div>
  );
}
