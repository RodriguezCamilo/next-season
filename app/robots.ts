export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://SeasonTrack.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/es", "/en"],
        disallow: ["/api/", "/es/admin", "/en/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
