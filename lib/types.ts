export type SeasonStatus = "confirmed" | "estimated" | "delayed";

export type SeasonCardData = {
  id: string;
  title: string;
  subtitle?: string;
  label: string;
  category: "game" | "series" | "anime" | "esports";
  itemSlug: string;
  seasonSlug: string;
  coverUrl?: string | null;
  dateIso: string | null;
  status: SeasonStatus;
  sourceName?: string | null;
  sourceUrl?: string | null;
  legalUrl?: string | null;
};
