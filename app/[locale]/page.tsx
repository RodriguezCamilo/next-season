import { getTranslations, setRequestLocale } from "next-intl/server";
import SearchCommand from "@/components/search-command";
import InfiniteHome from "@/components/infinite-home";
import { supabaseServerRSC } from "@/lib/supabase/rsc";
import type { Metadata } from "next";

export const revalidate = 300;

type Locale = "es" | "en";
type C = "games" | "shows" | "anime" | "esports";
type Category = "game" | "show" | "anime" | "esport";

type VUpcomingRow = {
  product_id: string | null;
  product_slug: string;
  title: string;
  season_label: string | null;
  category: Category;
  season_slug: string | null;
  cover_url: string | null;
  release_at: string | null;
  status: "confirmed" | "estimated" | "delayed" | null;
  source_name: string | null;
  source_url: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://SeasonTrack.app";

  const title =
    locale === "es"
      ? "Cuándo sale la próxima temporada de tus series, animes y juegos | SeasonTrack"
      : "Track upcoming seasons for your favorite games, shows and anime | SeasonTrack";

  const description =
    locale === "es"
      ? "SeasonTrack te muestra cuándo sale la próxima temporada de tus series, animes, videojuegos y esports favoritos. Cuenta regresiva, estados de estreno y fuentes oficiales."
      : "SeasonTrack helps you track the next seasons of your favorite TV shows, anime, games and esports. Countdown, release status and official sources.";

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
      },
    },
  };
}


export default async function Home({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ c?: C }>;
}) {
  const { locale } = await params;
  const { c } = (await searchParams) ?? {};
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const sb = await supabaseServerRSC();

  const map: Record<C, Category> = {
    games: "game",
    shows: "show",
    anime: "anime",
    esports: "esport"
  };

  let query = sb.from("v_upcoming").select("*").limit(24);
  if (c) query = query.eq("category", map[c]);

  const { data: rows } = (await query) as unknown as { data: VUpcomingRow[] | null };

  const items = (rows ?? []).map((r) => ({
    key: (r.product_id ?? r.product_slug) as string,
    title: r.title,
    label: r.season_label,
    category: r.category,
    itemSlug: r.product_slug,
    seasonSlug: r.season_slug,
    coverUrl: r.cover_url,
    dateIso: r.release_at,
    status: r.status,
    sourceName: r.source_name,
    sourceUrl: r.source_url
  }));

  const searchList = (rows ?? []).map((r) => ({
    label: r.season_label ? `${r.title} • ${r.season_label}` : `${r.title}`,
    href: `/${locale}/${r.category}/${r.product_slug}`,
    meta: r.category as string
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {(["games", "shows", "anime", "esports"] as const).map((tab) => {
              const active = c === tab || (!c && tab === "games");
              return (
                <a
                  key={tab}
                  href={`/${locale}/?c=${tab}`}
                  className={[
                    "rounded-full px-3 py-1 text-sm border transition",
                    active
                      ? "bg-accent text-[color:var(--accent-foreground)] border-accent"
                      : "hover:bg-accent/10"
                  ].join(" ")}
                >
                  {t(`tabs.${tab}`)}
                </a>
              );
            })}
          </div>
          <SearchCommand items={searchList} placeholder={t("searchPlaceholder")} />
        </div>

        {/* Aquí entra el scroll infinito */}
        <InfiniteHome initialItems={items} locale={locale} categoryParam={c} />
      </main>
    </div>
  );
}
