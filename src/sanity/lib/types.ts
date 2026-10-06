import type { MaybeRichText } from "@/lib/text";

export interface SanityPhoto {
  asset?: { _ref: string; _type: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  /** Base64 preview from Sanity's asset metadata — used as the blur placeholder. */
  lqip?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface SiteSettings {
  contactEmail?: string;
  areaLine?: string;
  footerAreas?: string;
  familySiteUrl?: string;
  familySiteLabel?: string;
  mobileBarText?: string;
  seoTitle?: string;
  seoDescription?: string;
  shareImage?: SanityPhoto;
}

export interface EventDoc {
  _id: string;
  title?: string;
  location?: string;
  date?: string;
  summary?: MaybeRichText;
  lead?: SanityPhoto;
  details?: SanityPhoto[];
}

export interface DetailItem {
  label?: string;
  headline?: string;
  body?: MaybeRichText;
}

export interface HomePage {
  hero?: {
    eyebrow?: string;
    heading?: string;
    intro?: MaybeRichText;
    image?: SanityPhoto;
    mobileImage?: SanityPhoto;
    primaryCta?: string;
    secondaryCta?: string;
  };
  whatIDo?: { eyebrow?: string; heading?: string; body?: MaybeRichText[]; services?: string[] };
  work?: { eyebrow?: string; heading?: string; events?: EventDoc[] };
  testimonial?: { eyebrow?: string; quote?: MaybeRichText; attribution?: string };
  about?: { eyebrow?: string; heading?: string; body?: MaybeRichText[]; portrait?: SanityPhoto };
  details?: {
    eyebrow?: string;
    priceLead?: string;
    price?: string;
    priceNote?: MaybeRichText;
    cta?: string;
    items?: DetailItem[];
  };
  enquire?: {
    eyebrow?: string;
    heading?: string;
    intro?: MaybeRichText;
    successHeading?: string;
    successBody?: MaybeRichText;
  };
}
