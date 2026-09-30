/**
 * Seeds the Studio with the approved design copy and the two photographs the
 * design used, so Cam starts from the live page rather than empty forms.
 *
 *   node scripts/seed.mjs   (Node 22.18+, which runs the TypeScript import natively)
 *
 * Uses createIfNotExists throughout: rerunning never overwrites an edit.
 * Needs SANITY_WRITE_TOKEN in .env.local.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// The same copy the site falls back to, so there's one source of truth for it.
const { homeContent, settingsContent, heroFallbackPhoto } = await import("../src/lib/content.ts");

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}${Date.now().toString(36)}`;

async function uploadFromUrl(url, alt, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${url}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename });
  return { _type: "image", alt, asset: { _type: "reference", _ref: asset._id } };
}

const heroImage = await uploadFromUrl(heroFallbackPhoto.url, heroFallbackPhoto.alt, "hero-claude-cyber-meetup.jpg");

const events = [];
for (const [i, e] of homeContent.work.events.entries()) {
  const id = ["event-claude-cyber-meetup", "event-ai-sec-community-party"][i];
  const lead = e.lead ? await uploadFromUrl(e.lead.url, e.lead.alt, `${id}.jpg`) : undefined;
  events.push({
    _id: id,
    _type: "event",
    title: e.title,
    location: e.location,
    date: e.date,
    summary: e.summary,
    ...(lead && { lead }),
  });
}

const tx = client.transaction();
tx.createIfNotExists({ _id: "siteSettings", _type: "siteSettings", ...settingsContent });
for (const e of events) tx.createIfNotExists(e);
tx.createIfNotExists({
  _id: "homePage",
  _type: "homePage",
  hero: { ...homeContent.hero, image: heroImage },
  whatIDo: homeContent.whatIDo,
  work: {
    eyebrow: homeContent.work.eyebrow,
    heading: homeContent.work.heading,
    events: events.map((e) => ({ _type: "reference", _ref: e._id, _key: key() })),
  },
  testimonial: homeContent.testimonial,
  about: homeContent.about,
  details: {
    ...homeContent.details,
    items: homeContent.details.items.map((item) => ({ _type: "detail", _key: key(), ...item })),
  },
  enquire: homeContent.enquire,
});

await tx.commit();
console.log(`Seeded siteSettings, homePage and ${events.length} events.`);
