import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Lato, Lora, Source_Serif_4 } from "next/font/google";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/types";
import { heroFallbackPhoto, settingsContent } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

// Lora carries the headings, as on the family site. It has no Light, so 400.
const lora = Lora({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lora",
  display: "swap",
});

// Source Serif 4 Light carries the body copy, roman and italic.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

// Lato is only the tracked-caps voice: labels, nav, buttons. The design asks
// for 500, which Lato doesn't have — browsers render it as 400, so load that.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lato",
  display: "swap",
});

// One use: the "Coverage from" lead-in above the price.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery, {}, ["siteSettings"]);
  const title = settings?.seoTitle || settingsContent.seoTitle;
  const description = settings?.seoDescription || settingsContent.seoDescription;
  const shareImage = settings?.shareImage?.asset
    ? urlFor(settings.shareImage).width(1200).height(630).fit("crop").auto("format").url()
    : heroFallbackPhoto.url;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | Cam Velucci` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: site.name,
      url: site.url,
      title,
      description,
      images: [{ url: shareImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${lora.variable} ${sourceSerif.variable} ${lato.variable} ${cormorant.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-paper focus:px-5 focus:py-3 focus:text-[11px] focus:tracking-[0.24em] focus:text-ink focus:uppercase"
        >
          Skip to content
        </a>
        {children}
        {/* Plausible: no cookies, no personal data, so no consent banner needed. */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            strategy="afterInteractive"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
