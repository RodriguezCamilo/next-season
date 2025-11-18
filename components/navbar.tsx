"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const switchHref = (to: "es" | "en") => {
    const parts = pathname.split("/");
    parts[1] = to;
    return parts.join("/") || `/${to}`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="font-semibold tracking-tight">Season Track</Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={`/${locale}/?c=games`} className="hover:text-foreground">{t("games")}</Link>
          <Link href={`/${locale}/?c=shows`} className="hover:text-foreground">{t("shows")}</Link>
          <Link href={`/${locale}/?c=anime`} className="hover:text-foreground">{t("anime")}</Link>
          <Link href={`/${locale}/?c=esports`} className="hover:text-foreground">{t("esports")}</Link>
          <span className="mx-2 opacity-40">|</span>
          <Link href={switchHref("es")} className="hover:text-foreground">ES</Link>
          <Link href={switchHref("en")} className="hover:text-foreground">EN</Link>
        </nav>
      </div>
    </header>
  );
}
