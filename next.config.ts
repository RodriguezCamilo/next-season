// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Si vas a servir portadas desde Supabase Storage:
      { protocol: "https", hostname: "**.supabase.co" },
      // Posibles fuentes futuras:
      { protocol: "https", hostname: "image.tmdb.org" },         // TMDB
      { protocol: "https", hostname: "static-cdn.jtvnw.net" },   // Twitch
      { protocol: "https", hostname: "cdn.myanimelist.net" }     // MAL
    ],
  },
};

export default withNextIntl(nextConfig);
