import type { SiteSettings } from "@/sanity/lib/types";

/**
 * The approved design copy (Corporate Landing Page v3). Every section renders
 * `cms ?? fallback`, so the site is complete before Sanity holds a document,
 * and a field left empty in the Studio falls back rather than disappearing.
 *
 * Photographs here are plain URLs rather than Sanity images — the two Pixieset
 * covers the design itself used. Frames with nothing to show render as empty
 * placeholders until a photograph is added in the Studio.
 */

export interface FallbackPhoto {
  url: string;
  alt: string;
}

export const heroFallbackPhoto: FallbackPhoto = {
  url: "https://images.pixieset.com/988197121/ff03f63bd3cd1077e54467480d99286f-cover.jpg",
  alt: "Guests networking at a corporate AI meetup photographed in Shoreditch, London",
};

export const settingsContent = {
  contactEmail: "hello@camvelucci.com",
  areaLine: "Hertfordshire · London & the Home Counties",
  footerAreas: "London · Hertfordshire",
  familySiteUrl: "https://www.camvelucci.com",
  familySiteLabel: "Family & portrait work",
  mobileBarText: "Event coming up?",
  seoTitle: "Corporate Event Photographer, London & Hertfordshire | Cam Velucci",
  seoDescription:
    "Documentary-style corporate event photography in London and Hertfordshire. Conference, meetup and company event coverage delivered fast, with images you can actually use. Request a quote.",
} satisfies SiteSettings;

export interface FallbackEvent {
  _id: string;
  title: string;
  location: string;
  date: string;
  summary: string;
  lead?: FallbackPhoto;
  details: (FallbackPhoto | undefined)[];
}

export const homeContent = {
  hero: {
    eyebrow: "Corporate & event photography",
    heading: "Corporate event photographer in London and Hertfordshire",
    intro:
      "Conferences, meetups, launches and company days, covered quietly and delivered as a gallery your team can use the same week.",
    primaryCta: "Request a quote",
    secondaryCta: "See the work",
  },
  whatIDo: {
    eyebrow: "What I do",
    heading: "Corporate event photography",
    body: [
      "I photograph corporate events across London and Hertfordshire: conferences, tech and AI meetups, panel evenings, launches, awards nights and team days. The approach is unobtrusive. I work the room rather than stage it, so the images look like your event actually happened. Where a shot needs setting up, like a sponsor wall, a group or a speaker portrait, I set it up quickly and get out of the way.",
      "Everything comes back as a colour-corrected online gallery with full commercial usage for marketing, social, press and recruitment. Half-day and full-day coverage; evening and multi-day events on request.",
    ],
    services: ["Conferences", "Meetups", "Launches & awards", "Team days", "Speaker portraits"],
  },
  work: {
    eyebrow: "Selected work",
    heading: "Recent events",
    events: [
      {
        _id: "fallback-claude-cyber",
        title: "Claude Cyber Meetup",
        location: "Shoreditch, London",
        date: "2026-09-01",
        summary:
          "100 guests, three talks, one photographer at the Granola office in Shoreditch. Arrival and networking through to the wind-down, shot in working light with no flash into the room.",
        lead: undefined,
        details: [undefined, undefined],
      },
      {
        _id: "fallback-ai-sec",
        title: "AI Sec Community Party",
        location: "London",
        date: "2026-09-01",
        summary:
          "A community evening for people working in AI security. Arrivals, conversation and the energy of a full room, covered from the first guests through to the last drinks.",
        lead: {
          url: "https://images.pixieset.com/767190321/bdecef93cbe1efae31f1b743bffbeb38-cover.jpg",
          alt: "Guests at the AI Sec Community Party, a corporate event photographed in London",
        },
        details: [undefined, undefined],
      },
    ] satisfies FallbackEvent[],
  },
  testimonial: {
    eyebrow: "What the client said",
    quote:
      "Cam was completely unobtrusive all evening. Half the room didn't realise she was working. The gallery landed fast and we've used it everywhere since.",
    attribution: "Organiser name · Claude Cyber Meetup, London",
  },
  about: {
    eyebrow: "About",
    heading: "Easy to brief, straightforward on the day",
    body: [
      "I'm Cam Velucci, a photographer based in Hertfordshire and working across London and the Home Counties. My corporate work runs on the same instinct as the rest of my photography: read the room, catch the real moment. Here it's applied to events where the images have a job to do.",
      "One short call or email to agree the run sheet and the shots you must have, an arrival well before doors, and a photographer your guests barely notice. Highlights for social within 24 hours, the full edited gallery within three working days.",
    ],
  },
  details: {
    eyebrow: "Practical details",
    priceLead: "Coverage from",
    price: "£350",
    priceNote: "For up to 2 hours of coverage. Longer events quoted on request.",
    cta: "Request a quote",
    items: [
      {
        label: "Turnaround",
        headline: "24h highlights",
        body: "Full edited gallery delivered within 3 working days.",
      },
      {
        label: "Included",
        body: "A full gallery of individually edited photographs, typically 30+ per hour of coverage. Delivered privately online at high and web resolution, with full commercial usage.",
      },
      {
        label: "Coverage",
        body: "London, Hertfordshire and the Home Counties. Travel outside London quoted separately.",
      },
    ],
  },
  enquire: {
    eyebrow: "Enquire",
    heading: "Tell me about the event",
    intro:
      "Date, location and roughly what's happening is enough to start. I'll come back within one working day with availability and a quote.",
    successHeading: "Thanks, that's with me",
    successBody:
      "I'll come back within one working day with availability and a quote. If it's urgent, email me directly.",
  },
};
