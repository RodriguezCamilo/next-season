import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "es" | "en" }>;
}) {
  const { locale } = await params;
  if (!["es", "en"].includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          now={new Date()}
          timeZone="America/Argentina/Buenos_Aires"
        >
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
