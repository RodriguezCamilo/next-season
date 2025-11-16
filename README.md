# Next Season — Release Tracker for Anime, Games & Series

> 🇪🇸 Next Season es una herramienta para seguir fechas de estreno de animes, juegos y series: saber cuándo vuelve tu próxima temporada.

Next Season is a side project focused on tracking **upcoming seasons and releases** (anime, games, movies, series) in a clean, searchable interface.

It uses a structured data model to store “products” (titles) with release dates, categories and sources.

## Core Idea

- Show upcoming releases for titles (e.g. “Jujutsu Kaisen Season 3”, “Monster Hunter Wilds”).
- Organize by category (anime, game, series) and date.
- Mix automatic sources (APIs/feeds) with manual curation.

## Tech Stack

- Next.js (TypeScript)
- Supabase (PostgreSQL)
- Tailwind CSS
- Deployed to Vercel (planned)

## Features (current / planned)

- `products` table with fields like:
  - `slug`, `title`, `category`, `description`
  - `official_url`, `source_name`, `source_url`
  - `provider`, `provider_id`
  - `manual_release_at`, `manual_status`, etc.
- Public UI to browse/search upcoming releases (planned).
- Filters by category and date (planned).
- Simple admin UI for manual curation (planned).
- External API integrations (planned).

## Getting Started

```bash
npm install
cp .env.example .env.local   # Supabase keys, external APIs
npm run dev
