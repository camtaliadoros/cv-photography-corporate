import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { homeContent, settingsContent } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery, {}, ["siteSettings"]);

  return (
    <>
      <main id="main">{children}</main>
      <Footer
        email={settings?.contactEmail || settingsContent.contactEmail}
        familySiteUrl={settings?.familySiteUrl || settingsContent.familySiteUrl}
        familySiteLabel={settings?.familySiteLabel || settingsContent.familySiteLabel}
        areas={settings?.footerAreas || settingsContent.footerAreas}
      />
      <MobileBar
        text={settings?.mobileBarText || settingsContent.mobileBarText}
        cta={homeContent.hero.primaryCta}
      />
    </>
  );
}
