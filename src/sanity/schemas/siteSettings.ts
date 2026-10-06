import { defineField, defineType } from "sanity";
import { photo } from "./shared";

export default defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({
      name: "areaLine",
      title: "Area line",
      type: "string",
      description: "Under the email in the enquiry section, e.g. 'Hertfordshire · London'.",
    }),
    defineField({
      name: "footerAreas",
      title: "Footer areas",
      type: "string",
      description: "e.g. 'London · Hertfordshire'",
    }),
    defineField({ name: "familySiteUrl", title: "Family site URL", type: "url" }),
    defineField({ name: "familySiteLabel", title: "Family site link label", type: "string" }),
    defineField({ name: "mobileBarText", title: "Mobile bar prompt", type: "string" }),
    defineField({
      name: "seoTitle",
      title: "Search title",
      type: "string",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(170),
    }),
    photo("shareImage", "Share image", false),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
