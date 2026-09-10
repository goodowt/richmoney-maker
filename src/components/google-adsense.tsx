import Script from "next/script";
import { siteConfig } from "@/lib/tools";

export function GoogleAdsense() {
  const id = siteConfig.adsensePublisherId;
  if (!id) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
