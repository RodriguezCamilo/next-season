import type { Metadata } from "next";

export function buildSeasonMetadata(row: any): Metadata {
  const titleBase = row?.item_title ? `${row.item_title} — ${row.label}` : "Next Season";
  const desc = row?.release_at
    ? `Cuenta regresiva y fecha de estreno: ${row.item_title} — ${row.label}`
    : `Fecha por confirmar: ${row?.item_title ?? ""} — ${row?.label ?? ""}`;

  const ogTitle = titleBase;
  const ogDesc = desc;
  const ogImage = row?.cover_url || "/og-default.png";

  return {
    title: titleBase,
    description: desc,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
  };
}
