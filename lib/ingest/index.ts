import { syncFromTMDB } from "./providers/tmdb";
import { syncFromAniList } from "./providers/anilist";
import { syncFromRAWG } from "./providers/rawg";
import { syncFromSteam } from "./providers/steam";

export async function syncProductByProvider(p: any) {
  switch (p.provider) {
    case "tmdb":    return syncFromTMDB(p);
    case "anilist": return syncFromAniList(p);
    case "rawg":    return syncFromRAWG(p);
    case "steam":   return syncFromSteam(p);
    default:        return { changed: false };
  }
}
