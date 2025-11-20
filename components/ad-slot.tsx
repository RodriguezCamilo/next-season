"use client";

import { useEffect, useRef } from "react";

type AdSize = "banner" | "rect" | "skyscraper";

export default function AdSlot({
  id,
  size = "banner",
  className = "",
}: {
  id: string;
  size?: AdSize;
  className?: string;
}) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      loaded.current = true;
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // Tamaños fijos o responsivos según el tipo
  // banner: 728x90 (desktop) / 320x50 (mobile) -> responsive
  // rect: 300x250 (inline)
  // skyscraper: 300x600 (sidebar)

  const style =
    size === "rect"
      ? { display: "inline-block", width: "300px", height: "250px" }
      : size === "skyscraper"
        ? { display: "inline-block", width: "300px", height: "600px" }
        : { display: "block" }; // banner es responsive por defecto

  const slotFormat = size === "banner" ? "auto" : undefined;
  const responsive = size === "banner" ? "true" : "false";

  return (
    <div
      className={`flex w-full justify-center overflow-hidden ${className}`}
      data-ad-wrapper={id}
    >
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || "1234567890"}
        data-ad-format={slotFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
