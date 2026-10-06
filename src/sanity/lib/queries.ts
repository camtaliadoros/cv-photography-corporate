import { groq } from "next-sanity";

/** Pulls the blur preview and dimensions alongside every photograph. */
const photo = `{ ..., "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions }`;

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  ...,
  shareImage${photo}
}`;

export const homePageQuery = groq`*[_type == "homePage" && _id == "homePage"][0]{
  ...,
  hero{ ..., image${photo}, mobileImage${photo} },
  about{ ..., portrait${photo} },
  work{
    ...,
    "events": events[]->{
      _id, title, location, date, summary,
      lead${photo},
      details[]${photo}
    }
  }
}`;
